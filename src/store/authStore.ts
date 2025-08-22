import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { User } from './types'
import { googleAuthService } from '@/services/googleAuth'
import { authApiService, apiClient } from '@/services'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  authToken: string | null
  authLoadingType: 'login' | 'logout' | null

  // Actions
  setUser: (user: User, token?: string) => void
  clearUser: () => void
  logout: () => Promise<void>
  setLoading: (loading: boolean) => void
  setAuthLoading: (type: 'login' | 'logout' | null) => void
  updateUserProfile: (updates: Partial<User>) => Promise<void>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: false,
        authToken: null,
        authLoadingType: null,

        setUser: (user, token) => {
          if (token) {
            apiClient.setAuthToken(token)
          }
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            authToken: token || get().authToken,
            authLoadingType: null,
          })

          // Navigate to home tab after login
          if (typeof window !== 'undefined') {
            window.location.pathname = '/'
          }
        },

        clearUser: () => {
          apiClient.setAuthToken(null)
          authApiService.logout()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            authToken: null,
          })
        },

        logout: async () => {
          // Set logout loading state
          set({ authLoadingType: 'logout' })

          try {
            // Sign out from Google if user was signed in via OAuth
            await googleAuthService.signOut()
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Google sign-out failed:', error)
          }

          // Add delay to show logout loading page with thank you message
          await new Promise(resolve => setTimeout(resolve, 800))

          apiClient.setAuthToken(null)
          authApiService.logout()

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            authToken: null,
            authLoadingType: null,
          })

          // Navigate to home tab after logout
          if (typeof window !== 'undefined') {
            window.location.pathname = '/'
          }
        },

        setLoading: loading => set({ isLoading: loading }),

        setAuthLoading: type => set({ authLoadingType: type }),

        updateUserProfile: async updates => {
          const { user } = get()
          if (!user) return

          try {
            const response = await authApiService.updateProfile(updates)
            if (response.success && response.data) {
              set({ user: response.data })
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to update profile:', error)
          }
        },

        initializeAuth: async () => {
          const { authToken } = get()
          if (!authToken) {
            set({ isInitialized: true })
            return
          }

          try {
            apiClient.setAuthToken(authToken)
            const response = await authApiService.getCurrentUser()

            if (response.success && response.data) {
              set({
                user: response.data.user,
                isAuthenticated: true,
                isInitialized: true,
              })
            } else {
              // Token is invalid, clear auth state
              get().clearUser()
              set({ isInitialized: true })
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize auth:', error)
            get().clearUser()
            set({ isInitialized: true })
          }
        },
      }),
      {
        name: 'haohaotalk-auth',
        partialize: state => {
          // Only persist registered users, not guest users
          // Guest sessions should start fresh each browser session
          if (state.user?.isGuest) {
            return {
              user: null,
              isAuthenticated: false,
              authToken: null,
            }
          }
          return {
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            authToken: state.authToken,
          }
        },
      }
    ),
    {
      name: 'AuthStore',
    }
  )
)
