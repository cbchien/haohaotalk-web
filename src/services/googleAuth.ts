export interface GoogleUser {
  id: string
  email: string
  name: string
  picture?: string
  email_verified: boolean
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialize: (config: any) => void
          prompt: () => void
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          renderButton: (element: HTMLElement, config: any) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

class GoogleAuthService {
  private clientId: string
  private isInitialized = false

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () =>
        reject(new Error('Failed to load Google Identity script'))
      document.head.appendChild(script)
    })
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    if (!this.clientId) {
      throw new Error('Google Client ID not configured')
    }

    await this.loadGoogleScript()

    window.google!.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: false,
    })

    this.isInitialized = true
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleCredentialResponse(response: any): void {
    // This will be handled by the promise in signIn method
    if (this.credentialResponseResolver) {
      this.credentialResponseResolver(response)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private credentialResponseResolver: ((response: any) => void) | null = null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch {
      throw new Error('Invalid JWT token')
    }
  }

  async signIn(): Promise<{ user: GoogleUser; credential: string }> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      // Create temporary button and auto-click it (more reliable than prompt)
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'fixed'
      tempContainer.style.top = '-9999px'
      tempContainer.style.left = '-9999px'
      document.body.appendChild(tempContainer)

      this.credentialResponseResolver = response => {
        try {
          // Clean up the temporary container
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer)
          }

          if (!response.credential) {
            reject(new Error('Google sign-in cancelled'))
            return
          }

          const payload = this.parseJWT(response.credential)

          const user: GoogleUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            email_verified: payload.email_verified,
          }

          // Return both user and credential
          resolve({ user, credential: response.credential })
        } catch (error) {
          // Clean up on error
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer)
          }
          reject(error)
        } finally {
          this.credentialResponseResolver = null
        }
      }

      try {
        window.google!.accounts.id.renderButton(tempContainer, {
          type: 'standard',
          size: 'large',
          text: 'continue_with',
          theme: 'outline',
        })

        // Auto-click the button after a brief delay
        setTimeout(() => {
          const button = tempContainer.querySelector(
            'div[role="button"]'
          ) as HTMLElement
          if (button) {
            button.click()
          } else {
            document.body.removeChild(tempContainer)
            reject(new Error('Google button not rendered'))
          }
        }, 100)

        // Clean up after 30 seconds if no response
        setTimeout(() => {
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer)
            if (this.credentialResponseResolver) {
              this.credentialResponseResolver = null
              reject(new Error('Google sign-in timeout'))
            }
          }
        }, 30000)
      } catch {
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer)
        }
        reject(new Error('Failed to initialize Google sign-in button'))
      }
    })
  }

  async signOut(): Promise<void> {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
  }

  isConfigured(): boolean {
    return !!this.clientId
  }
}

export const googleAuthService = new GoogleAuthService()
