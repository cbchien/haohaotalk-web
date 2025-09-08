import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'

interface ConnectionScoreBarProps {
  score: number // Score from -5 to +5
}

export const ConnectionScoreBar = ({ score }: ConnectionScoreBarProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  // Convert score from -5/+5 range to 0-100% for progress bar
  const progressPercentage = Math.max(
    0,
    Math.min(100, ((score + 5) / 10) * 100)
  )

  // Use consistent theme blue for all scores
  const scoreColor = 'bg-blue-100'

  return (
    <div className="bg-white border-b border-gray-200 sm:bg-gray-100 sm:border-transparent">
      <div className="max-w-xl mx-auto px-4 py-3 sm:bg-white sm:border-b sm:border-gray-200">
        <div className="flex items-center mb-1">
        <span className="text-sm text-gray-600">{t.chat.connectionScore}</span>
      </div>

        <div className="relative">
          {/* Background track */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            {/* Progress fill */}
            <div
              className={`h-3 rounded-full transition-all duration-500 ease-out ${scoreColor}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
