import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'

interface AuthLoadingPageProps {
  type: 'login' | 'logout'
  message?: string
}

export const AuthLoadingPage = ({ type, message }: AuthLoadingPageProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  const defaultMessages = {
    login: t.auth.loading.signingIn,
    logout: t.auth.loading.signingOut,
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Logo/Brand */}
      {/* <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 text-center">
          HaoHaoTalk
        </h1>
      </div> *}

      {/* Loading Spinner */}
      <div className="mb-6">
        <div className="w-8 h-8 border-2 border-blue-100 border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Loading Message */}
      <p className="text-gray-600 text-center">
        {message || defaultMessages[type]}
      </p>

      {/* Additional context for logout */}
      {type === 'logout' && (
        <p className="text-gray-400 text-sm text-center mt-2">
          {t.auth.loading.thankYou}
        </p>
      )}
    </div>
  )
}
