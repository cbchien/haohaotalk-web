import { useState, useMemo } from 'react'
import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { getGenericConversationTips } from '@/utils/conversationTips'
import type { ScenarioTip } from '@/services'

interface TipsModalProps {
  isVisible: boolean
  onClose: () => void
  scenarioId?: string
}

export const TipsModal = ({
  isVisible,
  onClose,
  scenarioId,
}: TipsModalProps) => {
  const { currentLanguage, getScenarioTips } = useAppStore()
  const t = useTranslation(currentLanguage)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  const scenarioTips = scenarioId ? getScenarioTips(scenarioId) : undefined
  const genericTips = getGenericConversationTips(t)
  const baseTips =
    scenarioTips && scenarioTips.length > 0 ? scenarioTips : genericTips

  const tips = useMemo(() => {
    const shuffled = [...baseTips]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [baseTips])

  const handleTipNavigation = (direction: 'prev' | 'next') => {
    setCurrentTipIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % tips.length
      } else {
        return prev === 0 ? tips.length - 1 : prev - 1
      }
    })
  }

  if (!isVisible) return null

  const currentTip = tips[currentTipIndex]

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">💡 {t.chat.tips}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {tips.length > 1 && (
            <div className="flex justify-center space-x-2 mb-4">
              {tips.map((_: ScenarioTip, index: number) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentTipIndex ? 'bg-blue-100' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="relative">
            {tips.length > 1 && (
              <>
                <button
                  onClick={() => handleTipNavigation('prev')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 hover:text-blue-100 transition-colors z-10"
                  aria-label="Previous tip"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleTipNavigation('next')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 hover:text-blue-100 transition-colors z-10"
                  aria-label="Next tip"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            <div className="px-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-left">
                {currentTip.title}
              </h3>
              <p className="text-gray-600 text-sm text-left leading-relaxed">
                {currentTip.description}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-100 text-white rounded-xl hover:bg-blue-200 transition-colors"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
