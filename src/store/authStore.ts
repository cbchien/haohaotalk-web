import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from './types'
import { googleAuthService } from '@/services/googleAuth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  setUser: (user: User) => void
  clearUser: () => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUserProfile: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: user =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      logout: async () => {
        // Sign out from Google if user was signed in via OAuth
        try {
          await googleAuthService.signOut()
        } catch (error) {
          console.warn('Google sign-out failed:', error)
        }
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setLoading: loading => set({ isLoading: loading }),

      updateUserProfile: updates => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },
    }),
    {
      name: 'haohaotalk-auth',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
