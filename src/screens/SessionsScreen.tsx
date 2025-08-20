import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import { SessionPerformanceAPI } from '@/services/sessionPerformanceApi'
import type { SessionListItem } from '@/types/sessionPerformance'

export const SessionsScreen = () => {
  const navigate = useNavigate()
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  const [sessions, setSessions] = useState<SessionListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await SessionPerformanceAPI.getUserSessions({
          limit: 20,
        })
        // eslint-disable-next-line no-console
        console.log('Sessions API response:', response)
        if (response.success && response.data) {
          setSessions(response.data)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load sessions:', err)
        setError('Failed to load session history')
      } finally {
        setIsLoading(false)
      }
    }

    loadSessions()
  }, [])

  const handleSessionClick = (session: SessionListItem) => {
    navigate(`/session/${session.id}/insights`, {
      state: {
        sessionData: session,
        scenarioKey: session.scenario_key,
      },
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-100 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-900">
          {t.navigation.progress}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {t.sessions.conversationAnalysis}
        </p>
      </div>

      <div className="p-4">
        {error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-100 text-white rounded-lg"
            >
              {t.common.retry}
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
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-blue-40 transition-colors active:scale-98"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-10 to-blue-25 flex items-center justify-center">
                    <span className="text-lg">💬</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {session.status === 'complete'
                        ? t.sessions.completedSession
                        : t.sessions.practiceSession}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {session.completed_at
                        ? formatDate(session.completed_at)
                        : formatDate(session.created_at)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="px-2 py-1 bg-blue-10 rounded-full">
                          <span className="text-xs font-medium text-blue-100">
                            {formatScore(session.connection_score)}%
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {session.current_turn} turns
                        </span>
                      </div>
                      <div className="text-gray-400">
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
