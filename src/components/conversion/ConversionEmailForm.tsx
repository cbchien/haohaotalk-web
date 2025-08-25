import { useState } from 'react'
import { useAuthStore, useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'

interface ConversionEmailFormProps {
  onSuccess: () => void
  error: string | null
  isLoading: boolean
}

export const ConversionEmailForm = ({
  onSuccess,
  error,
  isLoading,
}: ConversionEmailFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const { convertGuestToEmail, user } = useAuthStore()
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

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

  const validateForm = () => {
    const errors: Record<string, string> = {}

    const emailError = validateEmail(email)
    if (emailError) errors.email = emailError

    const passwordError = validatePassword(password)
    if (passwordError) errors.password = passwordError

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await convertGuestToEmail({
        email,
        password,
        displayName: displayName || user?.displayName,
      })

      // If no error, conversion was successful
      if (!error) {
        onSuccess()
      }
    } catch {
      // Error handling is done in the store
    }
  }

  const isEmailExists =
    error?.includes('EMAIL_EXISTS') || error?.includes('already registered')

  return (
    <div className="space-y-4">
      {/* Email already exists message */}
      {isEmailExists && (
        <div className="bg-yellow-10 border border-yellow-25 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-100 text-sm mb-2">
            {t.conversion.emailExists.title}
          </h3>
          <p className="text-yellow-100 text-xs mb-3">
            {t.conversion.emailExists.message}
          </p>
          <button className="text-yellow-100 text-xs font-semibold hover:underline">
            {t.conversion.emailExists.loginInstead}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.auth.displayName} ({t.conversion.optional})
          </label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-transparent"
            placeholder={user?.displayName || t.auth.displayName}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.auth.email} *
          </label>
          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              if (validationErrors.email) {
                setValidationErrors(prev => ({ ...prev, email: '' }))
              }
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
              validationErrors.email
                ? 'border-pink-100 focus:ring-pink-100'
                : 'border-gray-300 focus:ring-blue-100'
            }`}
            placeholder={t.auth.email}
          />
          {validationErrors.email && (
            <p className="text-pink-100 text-xs mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.auth.password} *
          </label>
          <input
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              if (validationErrors.password) {
                setValidationErrors(prev => ({ ...prev, password: '' }))
              }
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
              validationErrors.password
                ? 'border-pink-100 focus:ring-pink-100'
                : 'border-gray-300 focus:ring-blue-100'
            }`}
            placeholder="••••••••"
          />
          {validationErrors.password && (
            <p className="text-pink-100 text-xs mt-1">
              {validationErrors.password}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {t.conversion.passwordRequirement}
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-100 text-white rounded-xl font-semibold hover:bg-blue-75 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? t.conversion.converting : t.conversion.createAccount}
        </button>
      </form>

      {/* General error */}
      {error && !isEmailExists && (
        <div className="bg-pink-25 text-pink-100 border border-pink-100 rounded-xl p-3 text-sm">
          {error}
        </div>
      )}

      {/* Progress note */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">
          {t.conversion.progressPreservationNote}
        </p>
      </div>
    </div>
  )
}
