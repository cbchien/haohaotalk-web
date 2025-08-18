import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from './types'
import { googleAuthService } from '@/services/googleAuth'
import { authApiService, apiClient } from '@/services'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  authToken: string | null

  // Actions
  setUser: (user: User, token?: string) => void
  clearUser: () => void
  logout: () => Promise<void>
  setLoading: (loading: boolean) => void
  updateUserProfile: (updates: Partial<User>) => Promise<void>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authToken: null,

      setUser: (user, token) => {
        if (token) {
          apiClient.setAuthToken(token)
        }
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          authToken: token || get().authToken,
        })
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
        // Sign out from Google if user was signed in via OAuth
        try {
          await googleAuthService.signOut()
        } catch (error) {
          console.warn('Google sign-out failed:', error)
        }
        
        apiClient.setAuthToken(null)
        authApiService.logout()
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          authToken: null,
        })
      },

      setLoading: loading => set({ isLoading: loading }),

      updateUserProfile: async updates => {
        const { user } = get()
        if (!user) return

        try {
          const response = await authApiService.updateProfile(updates)
          if (response.success && response.data) {
            set({ user: response.data })
          }
        } catch (error) {
          console.error('Failed to update profile:', error)
        }
      },

      initializeAuth: async () => {
        const { authToken } = get()
        if (!authToken) return

        try {
          apiClient.setAuthToken(authToken)
          const response = await authApiService.getCurrentUser()
          
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
            })
          } else {
            // Token is invalid, clear auth state
            get().clearUser()
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error)
          get().clearUser()
        }
      },
    }),
    {
      name: 'haohaotalk-auth',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        authToken: state.authToken,
      }),
    }
  )
)
