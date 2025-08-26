import { useNavigate } from 'react-router-dom'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { Scenario } from '@/services/scenariosApi'
import { useTranslation } from '@/utils/translations'
import { useAuthStore } from '@/store'

interface ResultsSectionProps {
  results: Scenario[]
  isLoading: boolean
  searchType: 'popular' | 'keyword' | 'tag'
  searchQuery?: string
  selectedTagName?: string
  language: 'en' | 'zh'
}

export const ResultsSection = ({
  results,
  isLoading,
  searchType,
  searchQuery,
  selectedTagName,
  language,
}: ResultsSectionProps) => {
  const navigate = useNavigate()
  const {
    incrementViewedScenarios,
    shouldShowConversionPrompt,
    setShowConversionPrompt,
    user,
  } = useAuthStore()
  const t = useTranslation(language)

  const handleScenarioClick = (scenario: Scenario) => {
    // Track scenario viewing for guest users
    if (user?.isGuest) {
      incrementViewedScenarios()

      // Check if we should show conversion prompt after navigation
      setTimeout(() => {
        if (shouldShowConversionPrompt()) {
          setShowConversionPrompt(true)
        }
      }, 1000) // Short delay to allow navigation to complete
    }

    navigate(`/scenario/${scenario.id}/configure`)
  }

  const getSectionTitle = () => {
    switch (searchType) {
      case 'keyword':
        return `${t.search.resultsFor} "${searchQuery}"`
      case 'tag':
        return `${t.search.taggedAs} ${selectedTagName}`
      default:
        return t.search.popularScenarios
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-3">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {getSectionTitle()}
        </h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex">
                <div className="w-16 h-16 rounded-lg bg-gray-200 animate-pulse" />
                <div className="flex-1 ml-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-12" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="px-4 py-3">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {getSectionTitle()}
        </h2>
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-xl p-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t.search.noResultsFound}
            </h3>
            <p className="text-gray-600">
              {searchType === 'keyword'
                ? t.search.noResultsDescription
                : t.search.noResultsDescriptionTag}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-3">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {getSectionTitle()}
      </h2>
      <div className="space-y-3">
        {results.map(scenario => (
          <div
            key={scenario.id}
            onClick={() => handleScenarioClick(scenario)}
            className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
          >
            <div className="flex">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-10 to-green-10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {scenario.image_url ? (
                  <img
                    src={scenario.image_url}
                    alt={scenario.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white bg-opacity-90 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      [Image]
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 ml-4">
                <h3 className="font-bold text-gray-900 text-base">
                  {scenario.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {scenario.description}
                </p>
                <div className="flex items-end justify-between">
                  <div className="flex items-center space-x-1 flex-wrap">
                    <span className="px-2 py-1 bg-blue-25 text-blue-100 text-xs rounded-full">
                      {scenario.category}
                    </span>
                    {scenario.tags &&
                      scenario.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 my-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                    <span>{scenario.practice_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
