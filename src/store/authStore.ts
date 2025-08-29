import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { User } from './types'
import { googleAuthService } from '@/services/googleAuth'
import { authApiService, apiClient } from '@/services'
import { ConversionEmailData } from '@/services/authApi'
import { getDefaultLanguage } from '@/utils/browserLanguage'
import { useAppStore } from './appStore'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  authToken: string | null
  authLoadingType: 'login' | 'logout' | null
  showAuthModal: boolean

  // Conversion state
  isConverting: boolean
  conversionError: string | null
  showConversionPrompt: boolean

  // Engagement tracking
  viewedScenariosCount: number
  completedSessionsCount: number

  // Actions
  setUser: (user: User, token?: string) => void
  clearUser: () => void
  logout: () => Promise<void>
  setLoading: (loading: boolean) => void
  setAuthLoading: (type: 'login' | 'logout' | null) => void
  setShowAuthModal: (show: boolean) => void
  updateUserProfile: (updates: Partial<User>) => Promise<void>
  initializeAuth: () => Promise<void>

  // Conversion actions
  convertGuestToEmail: (data: ConversionEmailData) => Promise<void>
  convertGuestToGoogle: (idToken: string) => Promise<void>
  setShowConversionPrompt: (show: boolean) => void
  setConversionError: (error: string | null) => void

  // Engagement tracking actions
  incrementViewedScenarios: () => void
  incrementCompletedSessions: () => void
  shouldShowConversionPrompt: () => boolean
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
        showAuthModal: false,

        // Conversion state
        isConverting: false,
        conversionError: null,
        showConversionPrompt: false,

        // Engagement tracking
        viewedScenariosCount: 0,
        completedSessionsCount: 0,

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

          // Reset language to browser default on logout
          const browserLanguage = getDefaultLanguage()
          useAppStore.getState().setLanguage(browserLanguage)

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            authToken: null,
            authLoadingType: null,
          })

          // Navigate to landing page after logout
          if (typeof window !== 'undefined') {
            window.location.pathname = '/'
          }
        },

        setLoading: loading => set({ isLoading: loading }),

        setAuthLoading: type => set({ authLoadingType: type }),

        setShowAuthModal: show => set({ showAuthModal: show }),

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

        // Conversion methods
        convertGuestToEmail: async (data: ConversionEmailData) => {
          const { user } = get()
          if (!user?.isGuest) {
            set({ conversionError: 'Only guest users can be converted' })
            return
          }

          set({ isConverting: true, conversionError: null })

          try {
            const response = await authApiService.convertGuestToEmail(data)

            if (response.success && response.data) {
              set({
                user: response.data.user,
                authToken: response.data.token,
                isConverting: false,
                showConversionPrompt: false,
                conversionError: null,
              })
            } else {
              set({
                isConverting: false,
                conversionError: response.error || 'Conversion failed',
              })
            }
          } catch {
            set({
              isConverting: false,
              conversionError: 'Network error. Please try again.',
            })
          }
        },

        convertGuestToGoogle: async (idToken: string) => {
          const { user } = get()
          if (!user?.isGuest) {
            set({ conversionError: 'Only guest users can be converted' })
            return
          }

          set({ isConverting: true, conversionError: null })

          try {
            const response = await authApiService.convertGuestToGoogle({
              idToken,
            })

            if (response.success && response.data) {
              set({
                user: response.data.user,
                authToken: response.data.token,
                isConverting: false,
                showConversionPrompt: false,
                conversionError: null,
              })
            } else {
              set({
                isConverting: false,
                conversionError: response.error || 'Conversion failed',
              })
            }
          } catch {
            set({
              isConverting: false,
              conversionError: 'Network error. Please try again.',
            })
          }
        },

        setShowConversionPrompt: show => set({ showConversionPrompt: show }),

        setConversionError: error => set({ conversionError: error }),

        // Engagement tracking methods
        incrementViewedScenarios: () => {
          const { viewedScenariosCount } = get()
          const newCount = viewedScenariosCount + 1
          set({ viewedScenariosCount: newCount })
        },

        incrementCompletedSessions: () => {
          const { completedSessionsCount } = get()
          const newCount = completedSessionsCount + 1
          set({ completedSessionsCount: newCount })
        },

        shouldShowConversionPrompt: () => {
          const {
            user,
            viewedScenariosCount,
            completedSessionsCount,
            showConversionPrompt,
          } = get()

          // Don't show if already showing, user is not guest, or already converted
          if (showConversionPrompt || !user?.isGuest) {
            return false
          }

          // Show based on engagement thresholds
          return viewedScenariosCount >= 4 || completedSessionsCount >= 2
        },
      }),
      {
        name: 'haohaotalk-auth',
        partialize: state => {
          // For guest users, persist engagement tracking but not auth state
          if (state.user?.isGuest) {
            return {
              user: state.user,
              isAuthenticated: state.isAuthenticated,
              authToken: state.authToken,
              viewedScenariosCount: state.viewedScenariosCount,
              completedSessionsCount: state.completedSessionsCount,
            }
          }
          // For registered users, persist auth state and engagement
          return {
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            authToken: state.authToken,
            viewedScenariosCount: state.viewedScenariosCount,
            completedSessionsCount: state.completedSessionsCount,
          }
        },
      }
    ),
    {
      name: 'AuthStore',
    }
  )
)
