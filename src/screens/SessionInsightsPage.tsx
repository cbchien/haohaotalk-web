import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import { useSessionInsightsData } from '@/hooks/useSessionQueries'
import { ConnectionScoreChart } from '@/components/sessions/charts/ConnectionScoreChart'
import { InsightItem } from '@/components/sessions/insights/InsightItem'

export const SessionInsightsPage = () => {
  const { sessionId: urlSessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentLanguage, currentScenario } = useAppStore()
  const t = useTranslation(currentLanguage)

  // Get session data from navigation state
  const sessionData = location.state?.sessionData
  const scenarioKey = location.state?.scenarioKey
  const stateSessionId = location.state?.sessionId

  // Use sessionId from URL params, fallback to navigation state
  const sessionId = urlSessionId || stateSessionId

  // Use React Query for cached data fetching
  const { performance, insights, isLoading, error, isError } =
    useSessionInsightsData(sessionId)

  const handleBack = () => {
    navigate('/sessions')
  }

  const handleNext = () => {
    navigate(`/session/${sessionId}/performance-comparison`, {
      state: {
        sessionData,
        scenarioKey,
      },
    })
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

  // Show error state
  if (isError || error) {
    return (
      <div className="min-h-screen bg-blue-25 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {error?.message || 'Failed to load session data'}
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
                {currentScenario?.title || t.sessions.sessionInsights}
              </h1>
              <p className="text-sm text-gray-600">
                {t.sessions.conversationAnalysis}
              </p>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Connection Score Chart */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-center font-semibold mb-4 text-gray-900">
            {t.performance.connectionProgression}
          </h2>
          <ConnectionScoreChart performance={performance || null} />
        </div>

        {/* What Went Well */}
        {insights?.what_went_well && insights.what_went_well.length > 0 && (
          <div className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t.performance.whatWentWell}
            </h3>
            <div className="space-y-3">
              {insights.what_went_well.map((item, index) => (
                <InsightItem
                  key={`strength-${index}`}
                  icon="⭐"
                  text={item}
                  backgroundColor="bg-green-50"
                />
              ))}
            </div>
          </div>
        )}

        {/* Key Moments */}
        {insights?.key_moments && insights.key_moments.length > 0 && (
          <div className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t.performance.keyMoments}
            </h3>
            <div className="space-y-3">
              {insights.key_moments.map((item, index) => (
                <InsightItem
                  key={`moment-${index}`}
                  icon="💡"
                  text={item}
                  backgroundColor="bg-blue-50"
                />
              ))}
            </div>
          </div>
        )}

        {/* Things to Try Next */}
        {insights?.things_to_try_next &&
          insights.things_to_try_next.length > 0 && (
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t.performance.thingsToTryNext}
              </h3>
              <div className="space-y-3">
                {insights.things_to_try_next.map((item, index) => (
                  <InsightItem
                    key={`improvement-${index}`}
                    icon="➕"
                    text={item}
                    backgroundColor="bg-pink-50"
                  />
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
