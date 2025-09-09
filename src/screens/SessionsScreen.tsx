import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { StarIcon } from '@heroicons/react/24/solid'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import { useSessionsList } from '@/hooks/useSessionQueries'
import { cacheKeys } from '@/utils/cacheKeys'
import type { SessionListItem } from '@/types/sessionPerformance'

export const SessionsScreen = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [isRetrying, setIsRetrying] = useState(false)

  // Use React Query for cached sessions list
  const {
    data: sessions = [],
    isLoading,
    error,
    isError,
    isFetching,
  } = useSessionsList(20)

  const handleSessionClick = (session: SessionListItem) => {
    navigate(`/session/${session.id}/insights`, {
      state: {
        sessionData: session,
        scenarioKey: session.scenario_key,
      },
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString(
      currentLanguage === 'zh' ? 'zh-CN' : 'en-US',
      {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  const formatScore = (score?: number) => {
    if (score === undefined || score === null) return 0
    return Math.round(((score + 5) / 10) * 100)
  }

  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl))
  }

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await queryClient.refetchQueries({
        queryKey: [...cacheKeys.sessions.list, { limit: 20 }],
      })
    } catch {
      // Error will be handled by React Query's error state
    } finally {
      setIsRetrying(false)
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <StarIcon
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
      </div>
    )
  }

  const renderSessionSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse ml-2" />
          </div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mb-2" />
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
            <div className="flex items-center space-x-3">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
              <div className="px-2 py-1 bg-gray-200 rounded-full animate-pulse w-10 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-6 py-5 bg-white border-b border-gray-100">
          <h1 className="text-lg font-medium text-gray-900">
            {t.sessions.pastPracticeSessions}
          </h1>
        </div>

        <div className="p-4 max-w-xl mx-auto sm:pt-8">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`initial-skeleton-${index}`}>
                {renderSessionSkeleton()}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-5 bg-white border-b border-gray-100">
        <h1 className="text-lg font-medium text-gray-900">
          {t.sessions.pastPracticeSessions}
        </h1>
      </div>

      <div className="p-4 max-w-xl mx-auto sm:pt-8">
        {isError || error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {error?.message || 'Failed to load session history'}
            </p>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="px-4 py-2 bg-blue-100 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRetrying ? t.common.loading : t.common.retry}
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentLanguage === 'zh'
                ? '還沒有練習紀錄'
                : 'No practice sessions yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {currentLanguage === 'zh'
                ? '開始第一次對話練習'
                : 'Start your first conversation'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-100 text-white rounded-xl font-semibold"
            >
              {t.sessions.browseScenarios}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {isFetching && sessions.length > 0 && (
              <div className="space-y-3">
                {Array.from({ length: Math.min(3, sessions.length) }).map(
                  (_, index) => (
                    <div key={`skeleton-${index}`}>
                      {renderSessionSkeleton()}
                    </div>
                  )
                )}
              </div>
            )}
            {(!isFetching || sessions.length === 0) &&
              sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-blue-40 transition-colors active:scale-98"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {session.scenario_role?.avatar_url &&
                      !failedImages.has(session.scenario_role.avatar_url) ? (
                        <img
                          src={session.scenario_role.avatar_url}
                          alt={session.scenario_role.role_name}
                          className="w-full h-full object-cover"
                          onError={() =>
                            handleImageError(session.scenario_role.avatar_url)
                          }
                        />
                      ) : session.scenario_role?.avatar_url &&
                        failedImages.has(session.scenario_role.avatar_url) ? (
                        <span className="text-lg">🗣️</span>
                      ) : (
                        <span className="text-lg">💬</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {session.scenario?.title ||
                            t.sessions.practiceSession}
                        </h3>
                        <div className="text-gray-400 ml-2">
                          <svg
                            className="w-5 h-5"
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
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {session.scenario_role?.role_name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {session.completed_at
                            ? formatDate(session.completed_at)
                            : formatDate(session.started_at)}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-500">
                            {session.current_turn} turns
                          </span>
                          <div className="px-2 py-1 bg-blue-10 rounded-full">
                            <span className="text-xs font-medium text-blue-100">
                              {formatScore(session.connection_score)}%
                            </span>
                          </div>
                        </div>
                        {/* Rating display */}
                        {session.user_rating && (
                          <div className="mt-2">
                            {renderStars(session.user_rating)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
