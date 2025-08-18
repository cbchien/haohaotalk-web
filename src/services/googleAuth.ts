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
          initialize: (config: any) => void
          prompt: () => void
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
      script.onerror = () => reject(new Error('Failed to load Google Identity script'))
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
    })

    this.isInitialized = true
  }

  private handleCredentialResponse(response: any): void {
    // This will be handled by the promise in signIn method
    if (this.credentialResponseResolver) {
      this.credentialResponseResolver(response)
    }
  }

  private credentialResponseResolver: ((response: any) => void) | null = null

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
    } catch (error) {
      throw new Error('Invalid JWT token')
    }
  }

  async signIn(): Promise<GoogleUser> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      this.credentialResponseResolver = (response) => {
        try {
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

          resolve(user)
        } catch (error) {
          reject(error)
        } finally {
          this.credentialResponseResolver = null
        }
      }

      // Trigger the sign-in prompt
      window.google!.accounts.id.prompt()
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