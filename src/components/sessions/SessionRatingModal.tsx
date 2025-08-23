import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'

interface SessionRatingModalProps {
  isOpen: boolean
  onSubmit: (rating: number, feedback?: string) => Promise<void>
  onSkip: () => void
  isSubmitting?: boolean
}

export const SessionRatingModal = ({
  isOpen,
  onSubmit,
  onSkip,
  isSubmitting = false,
}: SessionRatingModalProps) => {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)
  const [error, setError] = useState('')

  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  const handleSubmit = async () => {
    if (rating === 0) {
      return
    }

    try {
      setError('')
      await onSubmit(rating, feedback.trim() || undefined)
    } catch {
      setError(t.chat.rating.error)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSkip()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-bounce-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">⭐</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t.chat.rating.title}
          </h2>
          <p className="text-gray-600 text-sm">{t.chat.rating.subtitle}</p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map(star => {
            const isFilled = star <= (hoveredRating || rating)
            const StarComponent = isFilled ? StarIconSolid : StarIcon

            return (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                disabled={isSubmitting}
                className="p-1 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <StarComponent
                  className={`w-8 h-8 transition-colors ${
                    isFilled
                      ? 'text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* Feedback Textarea */}
        <div className="mb-6">
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder={t.chat.rating.placeholder}
            disabled={isSubmitting}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-100 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-400 mt-1 text-right">
            {feedback.length}/500
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full py-3 bg-blue-100 text-white rounded-xl font-semibold hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? t.chat.rating.submitting : t.chat.rating.submit}
          </button>

          <button
            onClick={onSkip}
            disabled={isSubmitting}
            className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 disabled:cursor-not-allowed transition-colors"
          >
            {t.chat.rating.skip}
          </button>
        </div>
      </div>
    </div>
  )
}
