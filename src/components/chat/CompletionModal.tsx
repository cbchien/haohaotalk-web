import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '@/utils/translations'
import { useAppStore, useAuthStore } from '@/store'
import { useRateSession } from '@/hooks/useSessionQueries'
import { SessionRatingModal } from '@/components/sessions/SessionRatingModal'
import { ConversionModal } from '@/components/conversion'
import { cacheKeys } from '@/utils/cacheKeys'
import type { Session } from '@/services'

interface CompletionModalProps {
  session: Session
  finalScore: number
  onClose: () => void
  onSessionUpdate?: (updatedSession: Session) => void
  sessionId: string
}

export const CompletionModal = ({
  session,
  finalScore,
  onClose,
  onSessionUpdate,
  sessionId,
}: CompletionModalProps) => {
  // Only show rating if session doesn't already have a rating
  const [showRating, setShowRating] = useState(!session.rating)
  const [showConversionModal, setShowConversionModal] = useState(false)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { currentLanguage, currentScenario } = useAppStore()
  const { user, incrementCompletedSessions, shouldShowConversionPrompt } =
    useAuthStore()
  const t = useTranslation(currentLanguage)
  const rateSessionMutation = useRateSession()

  // Track session completion for guest users and invalidate sessions cache
  useEffect(() => {
    if (user?.isGuest) {
      incrementCompletedSessions()
    }
    
    // Invalidate sessions list to show the new completed session
    queryClient.invalidateQueries({
      queryKey: cacheKeys.sessions.list,
    })
  }, [user?.isGuest, incrementCompletedSessions, queryClient])

  // Convert score from -5/+5 range to percentage
  const scorePercentage = Math.max(
    0,
    Math.min(100, ((finalScore + 5) / 10) * 100)
  )

  const handleRatingSubmit = async (rating: number, feedback?: string) => {
    const updatedSession = await rateSessionMutation.mutateAsync({
      sessionId: session.id,
      rating,
      feedback,
    })

    // Update the parent component's session state
    if (onSessionUpdate && updatedSession) {
      onSessionUpdate(updatedSession)
    }

    setShowRating(false)
    checkAndShowConversion()
  }

  const handleRatingSkip = () => {
    setShowRating(false)
    checkAndShowConversion()
  }

  const checkAndShowConversion = useCallback(() => {
    // Check if we should show conversion prompt for guest users
    if (user?.isGuest && shouldShowConversionPrompt()) {
      setShowConversionModal(true)
    }
  }, [user?.isGuest, shouldShowConversionPrompt])

  // If no rating needed, check for conversion after initial render
  useEffect(() => {
    if (!showRating && user?.isGuest) {
      const timer = setTimeout(() => {
        checkAndShowConversion()
      }, 500) // Small delay to let completion modal settle

      return () => clearTimeout(timer)
    }
  }, [showRating, user?.isGuest, checkAndShowConversion])

  const handleViewResults = () => {
    onClose()
    navigate(`/session/${sessionId}/insights`, {
      state: { sessionId },
    })
  }

  const handleTryAgain = () => {
    onClose()
    // Use global scenario state first, fallback to session data
    const scenarioId = currentScenario?.id || session.scenario_id
    if (scenarioId) {
      navigate(`/scenario/${scenarioId}/configure`)
    } else {
      navigate('/')
    }
  }

  const handleBackToHome = () => {
    onClose()
    navigate('/')
  }

  const handleClose = () => {
    onClose()
    navigate('/sessions')
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <>
      {/* Rating Modal - shown first */}
      <SessionRatingModal
        isOpen={showRating}
        onSubmit={handleRatingSubmit}
        onSkip={handleRatingSkip}
        isSubmitting={rateSessionMutation.isPending}
      />

      {/* Completion Modal - shown after rating */}
      {!showRating && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-bounce-in relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg">×</span>
            </button>

            <div className="text-center">
              {/* Celebration emoji */}
              <div className="text-6xl mb-4">🎉</div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {t.chat.conversationComplete}
              </h2>

              {/* Message */}
              <p className="text-gray-600 mb-6">
                {t.chat.conversationCompleteMessage}
              </p>

              {/* Final score display */}
              <div className="bg-blue-10 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-600 mb-1">
                  {t.chat.finalScore}
                </div>
                <div className="text-2xl font-bold text-blue-100">
                  {Math.round(scorePercentage)}%
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleViewResults}
                  className="w-full py-3 bg-blue-100 text-white rounded-xl font-semibold hover:bg-blue-500 transition-colors"
                >
                  {t.chat.viewDetailedResults}
                </button>

                <button
                  onClick={handleTryAgain}
                  className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {t.chat.practiceAgain}
                </button>

                <button
                  onClick={handleBackToHome}
                  className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
                >
                  {t.chat.backToHome}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversion Modal - shown for guest users who meet criteria */}
      <ConversionModal
        isOpen={showConversionModal}
        onClose={() => setShowConversionModal(false)}
        trigger="post-session"
        sessionData={{ session, finalScore, scorePercentage }}
      />
    </>
  )
}
