import { useState, useEffect } from 'react'
import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { getGenericConversationTips } from '@/utils/conversationTips'

interface LoadingWithTipsProps {
  scenarioId?: string
  loadingText?: string
  className?: string
}

export const LoadingWithTips = ({
  scenarioId,
  loadingText,
  className = '',
}: LoadingWithTipsProps) => {
  const { currentLanguage, getScenarioTips } = useAppStore()
  const t = useTranslation(currentLanguage)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [intervalId, setIntervalId] = useState<number | null>(null)

  const defaultLoadingText = loadingText || t.scenarios.loading

  // Get tips - scenario-specific or generic fallback
  const scenarioTips = scenarioId ? getScenarioTips(scenarioId) : undefined
  const genericTips = getGenericConversationTips(t)
  const tips = scenarioTips && scenarioTips.length > 0 ? scenarioTips : genericTips

  // Rotate tips every 4.5 seconds
  useEffect(() => {
    if (tips.length <= 1) return

    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % tips.length)
    }, 4500)
    
    setIntervalId(interval)

    return () => {
      clearInterval(interval)
    }
  }, [tips.length])

  // Handle manual tip navigation
  const handleTipClick = (direction: 'prev' | 'next') => {
    // Clear current interval
    if (intervalId) {
      clearInterval(intervalId)
    }

    // Update tip index
    setCurrentTipIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % tips.length
      } else {
        return prev === 0 ? tips.length - 1 : prev - 1
      }
    })

    // Restart interval after a short delay (reset the 4.5-second timer)
    setTimeout(() => {
      if (tips.length > 1) {
        const newInterval = setInterval(() => {
          setCurrentTipIndex(prev => (prev + 1) % tips.length)
        }, 4500)
        setIntervalId(newInterval)
      }
    }, 100)
  }

  const currentTip = tips[currentTipIndex]

  return (
    <div className={`min-h-screen bg-gray-50 sm:bg-gray-100 flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-md mx-auto sm:max-w-xl text-center space-y-6 sm:bg-gray-50 sm:rounded-2xl sm:shadow-xl sm:p-8">
        {/* Loading spinner */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-blue-100 border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Loading text */}
        <p className="text-gray-600 text-lg">{defaultLoadingText}</p>

        {/* Tips section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            {/* Tip indicator dots */}
            {tips.length > 1 && (
              <div className="flex justify-center space-x-2 mb-4">
                {tips.map((_: unknown, index: number) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentTipIndex ? 'bg-blue-100' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Tip content with navigation */}
            <div className="relative">
              {/* Navigation arrows */}
              {tips.length > 1 && (
                <>
                  <button
                    onClick={() => handleTipClick('prev')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 p-2 hover:text-blue-100 transition-colors z-10"
                    aria-label="Previous tip"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleTipClick('next')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 p-2 hover:text-blue-100 transition-colors z-10"
                    aria-label="Next tip"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Current tip with fade transition */}
              <div 
                key={currentTipIndex}
                className="animate-[fadeIn_0.5s_ease-in-out] px-6"
              >
                <h3 className="font-semibold text-gray-900 mb-2 text-left">
                  💡 {currentTip.title}
                </h3>
                <p className="text-gray-600 text-sm text-left leading-relaxed">
                  {currentTip.description}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}