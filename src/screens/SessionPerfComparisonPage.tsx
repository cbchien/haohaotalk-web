import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import { useAuthStore } from '@/store/authStore'
import { useSessionComparisonData } from '@/hooks/useSessionQueries'
import { ScoreDistributionChart } from '@/components/sessions/charts/ScoreDistributionChart'
import { RecommendationItem } from '@/components/sessions/insights/RecommendationItem'
import { calculateUserPercentile } from '@/utils/percentileCalculator'

export const SessionPerfComparisonPage = () => {
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

  // Use React Query for cached data fetching
  const { performance, sessionDetail, isLoading, error, isError } =
    useSessionComparisonData(sessionId, !sessionData)

  // Use session data from navigation state or fetched data
  const currentSessionData = sessionData || sessionDetail

  // Handle auth-related loading and errors
  const isAuthLoading = authLoading || !isInitialized
  const isNotAuthenticated = !isAuthenticated && !authToken

  // Show auth loading state
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-100 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  // Show auth error
  if (isNotAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Please log in to view performance
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-100 text-white rounded-lg"
          >
            {t.common.goBack}
          </button>
        </div>
      </div>
    )
  }

  const handleBack = () => {
    navigate(`/session/${sessionId}/insights`)
  }

  const handleExitToSessions = () => {
    navigate('/sessions')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-100 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  // Show data loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-100 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (isError || error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {error?.message || 'Comparison data not available'}
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

  // Show no data state
  if (!performance) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No performance data available</p>
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
      category: t.performance.neutralDescription,
      description: t.performance.neutralDescriptionDetail,
    },
    {
      category: t.performance.expressEmotions,
      description: t.performance.expressEmotionsDetail,
    },
    {
      category: t.performance.clarifyNeeds,
      description: t.performance.clarifyNeedsDetail,
    },
    {
      category: t.performance.positiveResponse,
      description: t.performance.positiveResponseDetail,
    },
    {
      category: t.performance.understandNeeds,
      description: t.performance.understandNeedsDetail,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
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
                  t.performance.performanceComparison}
              </h1>
              <p className="text-sm text-gray-600">
                {t.performance.compareWithOthers}
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

      <div className="p-4 space-y-6 max-w-xl mx-auto sm:pt-8">
        {/* Score Distribution Chart */}
        <div className="bg-white rounded-xl p-4 border border-gray-300">
          <h2 className="text-center font-semibold mb-4 text-gray-900">
            {t.performance.relativeToOthers}
          </h2>
          {performance?.score_distribution &&
          performance.score_distribution.scores &&
          Array.isArray(performance.score_distribution.scores) &&
          performance.score_distribution.scores.length > 0 ? (
            (() => {
              const userScore = performance.final_score || 0
              const distributionData = performance.score_distribution

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
                    {t.performance.betterThanPercentage.replace(
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
