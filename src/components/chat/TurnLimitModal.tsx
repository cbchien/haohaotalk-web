import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'

interface TurnLimitModalProps {
  isVisible: boolean
  onContinue: () => void
  onEnd: () => void
}

export const TurnLimitModal = ({
  isVisible,
  onContinue,
  onEnd,
}: TurnLimitModalProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={e => {
        if (e.target === e.currentTarget) return
      }}
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">
          {t.chat.turnLimitModalTitle}
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          {t.chat.turnLimitModalMessage}
        </p>

        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full py-3 bg-blue-100 text-white rounded-xl font-semibold hover:bg-blue-75 transition-colors"
          >
            {t.chat.continueButton}
          </button>
          <button
            onClick={onEnd}
            className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t.chat.endButton}
          </button>
        </div>
      </div>
    </div>
  )
}
