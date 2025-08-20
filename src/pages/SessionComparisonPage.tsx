import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import { useAuthStore } from '@/store/authStore'
import { AnalyticsAPI } from '@/services/analyticsApi'
import { ScoreDistributionChart } from '@/components/analytics/charts/ScoreDistributionChart'
import { RecommendationItem } from '@/components/analytics/insights/RecommendationItem'
import { calculateUserPercentile } from '@/utils/percentileCalculator'
import type { SessionListItem, SessionAnalytics } from '@/types/analytics'

export const SessionComparisonPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentLanguage, currentScenario } = useAppStore()
  const {
    isLoading: authLoading,
    isAuthenticated,
    authToken,
    isInitialized,
  } = useAuthStore()
  const t = useTranslation(currentLanguage)

  // Get session data from navigation state
  const sessionData = location.state?.sessionData

  const [analytics, setAnalytics] = useState<SessionAnalytics | null>(null)
  const [currentSessionData, setCurrentSessionData] =
    useState<SessionListItem | null>(sessionData || null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadComparisonData = async () => {
      if (!sessionId) return

      // Wait for auth to be fully initialized
      if (authLoading || !isInitialized) {
        return
      }

      // Check if user is authenticated
      if (!isAuthenticated && !authToken) {
        setError('Please log in to view analytics')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Get session analytics which includes score_distribution
        const analyticsResponse =
          await AnalyticsAPI.getSessionAnalytics(sessionId)

        if (analyticsResponse.success && analyticsResponse.data) {
          setAnalytics(analyticsResponse.data)

          // If we don't have session data from navigation state, fetch it for display purposes
          if (!currentSessionData) {
            const sessionResponse = await AnalyticsAPI.getSession(sessionId)
            if (
              sessionResponse.success &&
              sessionResponse.data &&
              Array.isArray(sessionResponse.data) &&
              sessionResponse.data.length > 0
            ) {
              setCurrentSessionData(sessionResponse.data[0])
            }
          }
        } else {
          setError('Session analytics not found')
        }
      } catch {
        setError('Failed to load comparison data')
      } finally {
        setIsLoading(false)
      }
    }

    loadComparisonData()
  }, [
    sessionId,
    currentSessionData,
    authLoading,
    isAuthenticated,
    authToken,
    isInitialized,
  ])

  const handleBack = () => {
    navigate(`/session/${sessionId}/insights`)
  }

  const handleExitToSessions = () => {
    navigate('/sessions')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-25 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-100 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-blue-25 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {error || 'Comparison data not available'}
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-100 text-white rounded-lg"
          >
            {t.common.goBack}
          </button>
        </div>
      </div>
    )
  }

  // Generic recommendations (placeholder until backend provides them)
  const recommendations = [
    {
      category: t.analytics.neutralDescription,
      description: t.analytics.neutralDescriptionDetail,
    },
    {
      category: t.analytics.expressEmotions,
      description: t.analytics.expressEmotionsDetail,
    },
    {
      category: t.analytics.clarifyNeeds,
      description: t.analytics.clarifyNeedsDetail,
    },
    {
      category: t.analytics.positiveResponse,
      description: t.analytics.positiveResponseDetail,
    },
    {
      category: t.analytics.understandNeeds,
      description: t.analytics.understandNeedsDetail,
    },
  ]

  return (
    <div className="min-h-screen bg-blue-25">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            {currentScenario?.image_url && (
              <img
                src={currentScenario.image_url}
                alt={currentScenario.title}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {currentScenario?.title ||
                  currentSessionData?.scenario_role?.scenario?.title ||
                  sessionData?.scenario_role?.scenario?.title ||
                  t.analytics.performanceComparison}
              </h1>
              <p className="text-sm text-gray-600">
                {t.analytics.compareWithOthers}
              </p>
            </div>
          </div>
          <button
            onClick={handleExitToSessions}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Score Distribution Chart */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-center font-semibold mb-4 text-gray-900">
            {t.analytics.relativeToOthers}
          </h2>
          {analytics?.score_distribution &&
          analytics.score_distribution.scores &&
          Array.isArray(analytics.score_distribution.scores) &&
          analytics.score_distribution.scores.length > 0 ? (
            (() => {
              const userScore = analytics.final_score || 0
              const distributionData = analytics.score_distribution

              // Transform the data to match ScoreDistributionChart expectations
              const chartDistribution = distributionData.scores.map(item => ({
                score_range: item.score.toString(),
                user_count: item.userCount,
                percentage:
                  (item.userCount / distributionData.total_sessions) * 100,
              }))

              // Calculate user percentile based on the distribution data
              const percentileData = calculateUserPercentile(
                userScore,
                chartDistribution
              )

              return (
                <>
                  <ScoreDistributionChart
                    distribution={chartDistribution}
                    userScore={userScore}
                  />
                  <p className="text-center text-sm text-gray-600 mt-3">
                    {t.analytics.betterThanPercentage.replace(
                      '{percentage}',
                      percentileData.betterThanPercentage.toString()
                    )}
                  </p>
                </>
              )
            })()
          ) : (
            <div className="h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm text-gray-500">
                  {currentLanguage === 'zh'
                    ? '比較數據準備中'
                    : 'Comparison data preparing'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.map((recommendation, index) => (
          <RecommendationItem
            key={index}
            icon="🔵"
            category={recommendation.category}
            description={recommendation.description}
          />
        ))}
      </div>
    </div>
  )
}
