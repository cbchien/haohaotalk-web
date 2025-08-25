import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'

interface ConversionBenefitsProps {
  trigger:
    | 'post-session'
    | 'profile-access'
    | 'scenario-browsing'
    | 'session-milestone'
  onEmailSelect: () => void
  onGoogleSelect: () => void
}

export const ConversionBenefits = ({
  trigger,
  onEmailSelect,
  onGoogleSelect,
}: ConversionBenefitsProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'post-session':
        return t.conversion.triggerMessages.postSession
      case 'profile-access':
        return t.conversion.triggerMessages.profileAccess
      case 'scenario-browsing':
        return t.conversion.triggerMessages.scenarioBrowsing
      case 'session-milestone':
        return t.conversion.triggerMessages.sessionMilestone
      default:
        return t.conversion.triggerMessages.default
    }
  }

  const benefits = [
    {
      icon: '🔐',
      title: t.conversion.benefits.secureProgress.title,
      description: t.conversion.benefits.secureProgress.description,
    },
    {
      icon: '⚡',
      title: t.conversion.benefits.fasterLogin.title,
      description: t.conversion.benefits.fasterLogin.description,
    },
    {
      icon: '📊',
      title: t.conversion.benefits.advancedInsights.title,
      description: t.conversion.benefits.advancedInsights.description,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Trigger-specific message */}
      <div className="text-center">
        <p className="text-gray-600 text-base leading-relaxed">
          {getTriggerMessage()}
        </p>
      </div>

      {/* Benefits grid */}
      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 bg-blue-10 rounded-xl"
          >
            <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion buttons */}
      <div className="space-y-3 pt-2">
        {/* Google button */}
        <button
          onClick={onGoogleSelect}
          className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
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
          {t.conversion.continueWithGoogle}
        </button>

        {/* Email button */}
        <button
          onClick={onEmailSelect}
          className="w-full py-3 bg-blue-100 text-white rounded-xl font-semibold hover:bg-blue-75 transition-colors"
        >
          {t.conversion.createWithEmail}
        </button>
      </div>

      {/* Progress preservation note */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">
          {t.conversion.progressPreservationNote}
        </p>
      </div>
    </div>
  )
}
