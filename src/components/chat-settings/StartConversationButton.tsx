import { useState } from 'react'
import { useAppStore } from '@/store'
import { useTranslation, type Translations } from '@/utils/translations'
import { sessionsApiService, type Scenario } from '@/services'

// Enhanced error handling for session creation
const getSessionCreationErrorMessage = (
  errorMessage: string | undefined,
  t: Translations
) => {
  if (!errorMessage) return t.chatSettings.errors.sessionCreationFailed

  // Parse HTTP status codes and provide user-friendly messages
  if (errorMessage.includes('HTTP 400')) {
    return t.chatSettings.errors.invalidConfiguration
  }
  if (errorMessage.includes('HTTP 401')) {
    return t.chatSettings.errors.pleaseLogin
  }
  if (errorMessage.includes('HTTP 403')) {
    return t.chatSettings.errors.noPermission
  }
  if (errorMessage.includes('HTTP 404')) {
    return t.chatSettings.errors.scenarioNoLongerAvailable
  }
  if (errorMessage.includes('HTTP 429')) {
    return t.chatSettings.errors.tooManySessions
  }
  if (errorMessage.includes('HTTP 500')) {
    return t.chatSettings.errors.serverError
  }

  // Return original error message if no specific handling
  return errorMessage
}

interface StartConversationButtonProps {
  scenario: Scenario
  selectedRole: string | null
  relationshipLevel: 'low' | 'normal' | 'high'
  disabled: boolean
  onSessionCreated: (sessionId: string) => void
}

export const StartConversationButton = ({
  scenario,
  selectedRole,
  relationshipLevel,
  disabled,
  onSessionCreated,
}: StartConversationButtonProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartConversation = async () => {
    if (!selectedRole || disabled) return

    setIsCreating(true)
    setError(null)

    try {
      const response = await sessionsApiService.createSession({
        scenario_id: scenario.id,
        scenario_role_id: selectedRole,
        relationship_level: relationshipLevel,
        language: currentLanguage,
      })

      if (response.success && response.data) {
        onSessionCreated(response.data.id)
      } else {
        // Enhanced error handling based on API response
        const errorMessage = getSessionCreationErrorMessage(response.error, t)
        setError(errorMessage)
      }
    } catch {
      // Network or unexpected errors
      setError(t.chatSettings.errors.networkError)
    } finally {
      setIsCreating(false)
    }
  }

  const buttonText = t.chatSettings.startConversation
  const loadingText = t.chatSettings.preparing

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-pink-25 text-pink-100 border border-pink-100 rounded-xl p-2 text-sm text-center">
          {error}
        </div>
      )}

      <button
        onClick={handleStartConversation}
        disabled={disabled || isCreating}
        className={`w-full py-3 rounded-2xl text-base font-semibold transition-all duration-200 ${
          disabled || isCreating
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-100 text-white hover:bg-blue-75 active:scale-98'
        }`}
      >
        {isCreating ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {loadingText}
          </div>
        ) : (
          buttonText
        )}
      </button>
    </div>
  )
}
