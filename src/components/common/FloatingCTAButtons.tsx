import { useNavigate } from 'react-router-dom'
import { HomeIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'

interface FloatingCTAButtonsProps {
  scenarioId?: string
  onTryAgain?: () => void
}

export const FloatingCTAButtons = ({
  scenarioId,
  onTryAgain,
}: FloatingCTAButtonsProps) => {
  const navigate = useNavigate()
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  const handleReturnToHome = () => {
    navigate('/')
  }

  const handleTryAgain = () => {
    if (onTryAgain) {
      onTryAgain()
    } else if (scenarioId) {
      navigate(`/scenario/${scenarioId}/configure`)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
          <div className="flex items-center justify-center space-x-4">
            {/* Return to Home */}
            <button
              onClick={handleReturnToHome}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <HomeIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                {t.navigation.home}
              </span>
            </button>

            {/* Try Again */}
            <button
              onClick={handleTryAgain}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5 text-white" />
              <span className="font-medium text-white">{t.common.retry}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
