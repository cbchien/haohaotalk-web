import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  StarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid'
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
  const [expandedScenarios, setExpandedScenarios] = useState<Set<string>>(
    new Set()
  )

  // Use React Query for cached sessions list
  const {
    data: sessions = [],
    isLoading,
    error,
    isError,
    isFetching,
  } = useSessionsList(20)

  // Group sessions by scenario, filtering out sessions with 0 turns
  const sessionsByScenario = useMemo(() => {
    const grouped: Record<
      string,
      { scenario: SessionListItem['scenario']; sessions: SessionListItem[] }
    > = {}

    // Single pass: filter, group, and collect sessions
    for (const session of sessions) {
      // Skip sessions with no turns
      if (session.current_turn <= 0) continue

      const scenarioKey = session.scenario?.id || 'unknown'
      if (!grouped[scenarioKey]) {
        grouped[scenarioKey] = {
          scenario: session.scenario,
          sessions: [],
        }
      }
      grouped[scenarioKey].sessions.push(session)
    }

    // Sort sessions within each scenario by most recent first
    for (const group of Object.values(grouped)) {
      group.sessions.sort((a, b) => {
        const dateA = a.completed_at || a.started_at
        const dateB = b.completed_at || b.started_at
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })
    }

    return grouped
  }, [sessions])

  const toggleScenario = (scenarioId: string) => {
    setExpandedScenarios(prev => {
      const newSet = new Set(prev)
      if (newSet.has(scenarioId)) {
        newSet.delete(scenarioId)
      } else {
        newSet.add(scenarioId)
      }
      return newSet
    })
  }

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

    if (currentLanguage === 'zh') {
      return date
        .toLocaleDateString('zh-CN', {
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(/\//g, '/')
        .replace(' ', ' ')
    } else {
      return date
        .toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        })
        .replace(',', '')
    }
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

  const renderSession = (session: SessionListItem) => (
    <div
      key={session.id}
      onClick={() => handleSessionClick(session)}
      className="bg-gray-50 rounded-lg border border-gray-100 p-3 cursor-pointer hover:bg-white hover:border-blue-40 transition-all active:scale-98"
    >
      <div className="flex items-center gap-3">
        {/* Column 1: Avatar (Fixed) */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
          {session.scenario_role?.avatar_url &&
          !failedImages.has(session.scenario_role.avatar_url) ? (
            <img
              src={session.scenario_role.avatar_url}
              alt={session.scenario_role.role_name}
              className="w-full h-full object-cover"
              onError={() => handleImageError(session.scenario_role.avatar_url)}
            />
          ) : session.scenario_role?.avatar_url &&
            failedImages.has(session.scenario_role.avatar_url) ? (
            <span className="text-lg">🗣️</span>
          ) : (
            <span className="text-lg">💬</span>
          )}
        </div>

        {/* Column 2: Title and Date (Flexible) */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {session.scenario_role?.role_name || t.sessions.practiceSession}
          </h3>
          <p className="text-xs text-gray-400 mt-1 whitespace-nowrap">
            {session.completed_at
              ? formatDate(session.completed_at)
              : formatDate(session.started_at)}
          </p>
          <span className="text-xs text-gray-500">
            {session.current_turn} turns
          </span>
        </div>

        {/* Column 3: Connection Score and Rating (Auto-width) */}
        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
          <div className="px-2 py-1 bg-blue-10 rounded-full">
            <span className="text-xs font-medium text-blue-100">
              {formatScore(session.connection_score)}%
            </span>
          </div>
          {session.user_rating && renderStars(session.user_rating)}
        </div>

        {/* Column 4: Arrow Icon (Minimal width) */}
        <div className="flex-shrink-0">
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
        </div>
      </div>
    </div>
  )

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

        <div className="p-4 max-w-2xl mx-auto sm:pt-8">
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

      <div className="p-4 max-w-2xl mx-auto sm:pt-8">
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
              Object.entries(sessionsByScenario).map(([scenarioId, group]) => (
                <div key={scenarioId} className="space-y-2">
                  {/* Scenario Header */}
                  <div
                    onClick={() => toggleScenario(scenarioId)}
                    className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {expandedScenarios.has(scenarioId) ? (
                            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            {group.scenario?.title || 'Unknown Scenario'}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {group.sessions.length} session
                            {group.sessions.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      {group.scenario?.image_url && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={group.scenario.image_url}
                            alt={group.scenario.title}
                            className="w-full h-full object-cover"
                            onError={e => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sessions List */}
                  {expandedScenarios.has(scenarioId) && (
                    <div className="ml-4 space-y-2">
                      {group.sessions.map(session => renderSession(session))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
