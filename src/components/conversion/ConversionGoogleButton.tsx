import { useAuthStore, useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { googleAuthService } from '@/services/googleAuth'

interface ConversionGoogleButtonProps {
  onSuccess: () => void
  error: string | null
  isLoading: boolean
}

export const ConversionGoogleButton = ({
  onSuccess,
  error,
  isLoading,
}: ConversionGoogleButtonProps) => {
  const { convertGuestToGoogle } = useAuthStore()
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  const handleGoogleConversion = async () => {
    try {
      if (!googleAuthService.isConfigured()) {
        throw new Error(t.auth.errors.googleOAuthNotConfigured)
      }

      const { credential } = await googleAuthService.signIn()
      await convertGuestToGoogle(credential)

      // If no error, conversion was successful
      if (!error) {
        onSuccess()
      }
    } catch {
      // Error handling is done in the store or Google auth service
    }
  }

  const isGoogleExists =
    error?.includes('EMAIL_EXISTS') || error?.includes('already registered')

  return (
    <div className="space-y-4">
      {/* Google account already exists message */}
      {isGoogleExists && (
        <div className="bg-yellow-10 border border-yellow-25 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-100 text-sm mb-2">
            {t.conversion.googleExists.title}
          </h3>
          <p className="text-yellow-100 text-xs mb-3">
            {t.conversion.googleExists.message}
          </p>
          <button className="text-yellow-100 text-xs font-semibold hover:underline">
            {t.conversion.googleExists.loginInstead}
          </button>
        </div>
      )}

      {/* Google conversion explanation */}
      <div className="bg-blue-10 border border-blue-25 rounded-xl p-4">
        <h3 className="font-semibold text-blue-100 text-sm mb-2">
          {t.conversion.googleConversion.title}
        </h3>
        <p className="text-blue-100 text-xs leading-relaxed">
          {t.conversion.googleConversion.description}
        </p>
      </div>

      {/* Google conversion button */}
      <button
        onClick={handleGoogleConversion}
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
        {isLoading ? t.conversion.converting : t.conversion.convertWithGoogle}
      </button>

      {/* General error */}
      {error && !isGoogleExists && (
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
