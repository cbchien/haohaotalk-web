import { useState, useEffect } from 'react'
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
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
    }
  }, [isVisible])

  const handleContinueClick = () => {
    setIsAnimating(true)
    // Start animation, then call onContinue after animation completes
    setTimeout(() => {
      onContinue()
      setShouldRender(false)
      setIsAnimating(false)
    }, 500) // 500ms for animation duration
  }

  const handleEndClick = () => {
    setShouldRender(false)
    onEnd()
  }

  if (!isVisible && !shouldRender) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: isAnimating ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
        transition: 'background-color 500ms ease-in-out',
      }}
      onClick={e => {
        if (e.target === e.currentTarget && !isAnimating) return
      }}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          transform: isAnimating
            ? 'translate(calc(50vw - 6rem), calc(-50vh + 2rem)) scale(0.3)'
            : 'translate(0, 0) scale(1)',
          width: isAnimating ? '6rem' : '100%',
          maxWidth: isAnimating ? '6rem' : '24rem',
          height: isAnimating ? '2rem' : 'auto',
          padding: isAnimating ? '0.25rem 0.5rem' : '1.5rem',
          transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isAnimating ? 0.8 : 1,
        }}
      >
        {!isAnimating ? (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">
              {t.chat.turnLimitModalTitle}
            </h2>
            <p className="text-gray-600 mb-6 text-center text-sm">
              {t.chat.turnLimitModalMessage}
            </p>

            <div className="space-y-3">
              <button
                onClick={handleContinueClick}
                className="w-full py-3 bg-blue-100 text-white rounded-xl font-semibold hover:bg-blue-75 transition-colors"
              >
                {t.chat.continueButton}
              </button>
              <button
                onClick={handleEndClick}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t.chat.endButton}
              </button>
            </div>
          </>
        ) : (
          <div
            className="flex items-center justify-center h-full text-xs text-gray-600 font-medium whitespace-nowrap"
            style={{ lineHeight: '1.25rem' }}
          >
            {t.chat.endSessionEarly}
          </div>
        )}
      </div>
    </div>
  )
}
