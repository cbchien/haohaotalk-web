import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '@/store'
import { googleAuthService } from '@/services/googleAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'login' | 'register' | 'guest'

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, setLoading } = useAuthStore()

  const handleGuestAccess = async () => {
    setIsLoading(true)
    setLoading(true)

    // Simulate API call for guest user creation
    setTimeout(() => {
      const guestUser = {
        id: `guest_${Date.now()}`,
        display_name: `Guest${Math.floor(Math.random() * 1000)}`,
        account_type: 'guest' as const,
        verification_status: 'unverified' as const,
        join_date: new Date(),
        preferred_language: 'en' as const,
      }

      setUser(guestUser)
      setIsLoading(false)
      onClose()
    }, 1000)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const user = {
        id: `user_${Date.now()}`,
        display_name: displayName || email.split('@')[0],
        email,
        account_type: 'registered' as const,
        verification_status: 'email_verified' as const,
        join_date: new Date(),
        preferred_language: 'en' as const,
      }

      setUser(user)
      setIsLoading(false)
      onClose()
    }, 1500)
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setLoading(true)

    try {
      const googleUser = await googleAuthService.signIn()
      
      const user = {
        id: googleUser.id,
        display_name: googleUser.name,
        email: googleUser.email,
        account_type: 'registered' as const,
        verification_status: 'oauth_verified' as const,
        join_date: new Date(),
        preferred_language: 'en' as const,
        avatar_url: googleUser.picture,
      }

      setUser(user)
      setLoading(false)
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage !== 'Google sign-in cancelled') {
        console.error('Google sign-in failed:', error)
      }
      setLoading(false)
      // Could show error message to user here for real errors
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'guest'
              ? 'Continue as Guest'
              : mode === 'register'
                ? 'Create Account'
                : 'Welcome Back'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {mode === 'guest' ? (
            <>
              <p className="text-gray-600 text-sm">
                Start practicing conversations right away. You can create an
                account later to save your progress.
              </p>
              <button
                onClick={handleGuestAccess}
                disabled={isLoading}
                className="w-full py-3 bg-blue-100 text-white rounded-xl font-semibold hover:bg-blue-75 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Setting up...' : 'Continue as Guest'}
              </button>
              <button
                onClick={() => setMode('login')}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                I have an account
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-100 text-white rounded-xl font-semibold hover:bg-blue-75 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading
                    ? 'Please wait...'
                    : mode === 'register'
                      ? 'Create Account'
                      : 'Sign In'}
                </button>
              </form>

              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              <div className="text-center">
                <button
                  onClick={() =>
                    setMode(mode === 'login' ? 'register' : 'login')
                  }
                  className="text-blue-100 text-sm hover:underline"
                >
                  {mode === 'login'
                    ? 'Create new account'
                    : 'Already have an account?'}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={() => setMode('guest')}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Continue as Guest
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
