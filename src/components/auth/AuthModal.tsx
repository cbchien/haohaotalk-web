import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useAuthStore, useAppStore } from '@/store'
import { googleAuthService } from '@/services/googleAuth'
import { authApiService } from '@/services'
import { useTranslation } from '@/utils/translations'

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
  const [isGuestLoading, setIsGuestLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  const { setUser, setLoading, setAuthLoading } = useAuthStore()
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  // Helper to check if any authentication is in progress
  const isAnyLoading = isGuestLoading || isEmailLoading || isGoogleLoading

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return t.auth.validation.emailRequired
    if (!emailRegex.test(email)) return t.auth.validation.emailInvalid
    return ''
  }

  const validatePassword = (password: string) => {
    if (!password) return t.auth.validation.passwordRequired
    if (password.length < 8) return t.auth.validation.passwordTooShort
    return ''
  }

  const validateDisplayName = (displayName: string) => {
    if (mode === 'register' && !displayName)
      return t.auth.validation.displayNameRequired
    return ''
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (mode === 'register') {
      const displayNameError = validateDisplayName(displayName)
      if (displayNameError) newErrors.displayName = displayNameError
    }

    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGuestAccess = async () => {
    setIsGuestLoading(true)
    setLoading(true)
    setAuthLoading('login')

    try {
      const guestName = `Guest${Math.floor(Math.random() * 1000)}`
      const response = await authApiService.createGuestUser({
        display_name: guestName,
      })

      if (response.success && response.data) {
        setUser(response.data.user, response.data.token)
        onClose()
      } else {
        // Fall back to local guest creation for development
        const guestUser = {
          id: `guest_${Date.now()}`,
          displayName: guestName,
          email: '', // Guest users don't have email
          isGuest: true,
          createdAt: new Date().toISOString(),
        }
        setUser(guestUser)
        onClose()
      }
    } catch {
      // Guest access failed, but continue with fallback
    } finally {
      setIsGuestLoading(false)
      setLoading(false)
      setAuthLoading(null)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')

    if (!validateForm()) {
      return
    }

    setIsEmailLoading(true)
    setLoading(true)
    setAuthLoading('login')

    try {
      let response

      if (mode === 'register') {
        response = await authApiService.register({
          email,
          password,
          display_name: displayName || email.split('@')[0],
        })
      } else {
        response = await authApiService.login({
          email,
          password,
        })
      }

      if (response.success && response.data) {
        // Immediately set user and close modal - loading page will show
        setUser(response.data.user, response.data.token)
        onClose()
      } else {
        setErrors({
          general: response.error || t.auth.errors.authenticationFailed,
        })
      }
    } catch {
      setErrors({ general: t.auth.errors.networkError })
    } finally {
      setIsEmailLoading(false)
      setLoading(false)
      setAuthLoading(null)
    }
  }

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true)
    setLoading(true)
    setAuthLoading('login')

    try {
      if (!googleAuthService.isConfigured()) {
        throw new Error(t.auth.errors.googleOAuthNotConfigured)
      }

      const { user: googleUser, credential } = await googleAuthService.signIn()

      // Send Google credential to backend
      const response = await authApiService.googleAuth({
        idToken: credential,
      })

      if (response.success && response.data) {
        setUser(response.data.user, response.data.token)
        onClose()
      } else {
        // Use Google user data directly if backend call fails
        const user = {
          id: googleUser.id,
          displayName: googleUser.name,
          email: googleUser.email,
          isGuest: false,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          avatarUrl: googleUser.picture,
        }
        setUser(user)
        onClose()
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage !== 'Google sign-in cancelled') {
        // Re-throw error to let user know Google OAuth failed
        throw error
      }
    } finally {
      setIsGoogleLoading(false)
      setLoading(false)
      setAuthLoading(null)
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
              ? t.auth.continueAsGuest
              : mode === 'register'
                ? t.auth.createAccount
                : t.auth.signIn}
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
                {t.profile.guestModeMessage}
              </p>
              <button
                onClick={handleGuestAccess}
                disabled={isAnyLoading}
                className="w-full py-3 bg-blue-100 text-white rounded-xl font-semibold hover:bg-blue-75 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGuestLoading ? t.scenarios.loading : t.auth.continueAsGuest}
              </button>
              <button
                onClick={() => setMode('login')}
                disabled={isAnyLoading}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.auth.alreadyHaveAccount}
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.auth.displayName}
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => {
                        setDisplayName(e.target.value)
                        if (errors.displayName) {
                          setErrors(prev => ({ ...prev, displayName: '' }))
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        errors.displayName
                          ? 'border-pink-100 focus:ring-pink-100'
                          : 'border-gray-300 focus:ring-blue-100'
                      }`}
                      placeholder={t.auth.displayName}
                    />
                    {errors.displayName && (
                      <p className="text-pink-100 text-xs mt-1">
                        {errors.displayName}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.auth.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value)
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: '' }))
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      errors.email
                        ? 'border-pink-100 focus:ring-pink-100'
                        : 'border-gray-300 focus:ring-blue-100'
                    }`}
                    placeholder={t.auth.email}
                  />
                  {errors.email && (
                    <p className="text-pink-100 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.auth.password}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value)
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: '' }))
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      errors.password
                        ? 'border-pink-100 focus:ring-pink-100'
                        : 'border-gray-300 focus:ring-blue-100'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-pink-100 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isAnyLoading}
                  className="w-full py-3 bg-blue-100 text-white rounded-xl font-semibold hover:bg-blue-75 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isEmailLoading
                    ? t.scenarios.loading
                    : mode === 'register'
                      ? t.auth.createAccount
                      : t.auth.signIn}
                </button>
              </form>

              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleAuth}
                disabled={isAnyLoading}
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
                {isGoogleLoading
                  ? t.scenarios.loading
                  : t.auth.continueWithGoogle}
              </button>

              <div className="text-center">
                <button
                  onClick={() =>
                    setMode(mode === 'login' ? 'register' : 'login')
                  }
                  disabled={isAnyLoading}
                  className="text-blue-100 text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mode === 'login'
                    ? t.auth.createNewAccount
                    : t.auth.alreadyHaveAccount}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {currentLanguage === 'zh' ? '或' : 'or'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMode('guest')}
                disabled={isAnyLoading}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.auth.continueAsGuest}
              </button>

              {/* Error/Success Messages */}
              {errors.general && (
                <div className="bg-pink-25 text-pink-100 border border-pink-100 rounded-lg p-3 text-sm">
                  {errors.general}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-25 text-green-100 border border-green-100 rounded-lg p-3 text-sm">
                  {successMessage}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
