import { useNavigate } from 'react-router-dom'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { useAppStore, useAuthStore } from '@/store'
import type { Scenario } from '@/services'
import { useTranslation } from '@/utils/translations'
import { useHomeScenarios } from '@/hooks/useHomeQueries'

const CONTEXT_DISPLAY_CHARACTER_COUNT = 100

export const ScenarioGrid = () => {
  const navigate = useNavigate()
  const { selectedCategories, currentLanguage } = useAppStore()
  const {
    incrementViewedScenarios,
    shouldShowConversionPrompt,
    setShowConversionPrompt,
    user,
  } = useAuthStore()
  const t = useTranslation(currentLanguage)

  const category =
    selectedCategories.length > 0 ? selectedCategories[0] : undefined
  const scenariosQuery = useHomeScenarios(category, currentLanguage)

  const scenarios = scenariosQuery.data || []
  const loading = scenariosQuery.isLoading

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

  const renderScenarioSkeleton = (index: number) => (
    <div
      key={`skeleton-${index}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm break-inside-avoid mb-3"
    >
      {/* Image skeleton */}
      <div className="h-32 bg-gray-200 animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />
        
        {/* Description skeleton - varies by index to simulate different content lengths */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
          {index % 3 === 0 && <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />}
        </div>
        
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-1 mb-8">
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-12" />
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-14" />
        </div>
        
        {/* Practice count skeleton */}
        <div className="flex items-center space-x-1 justify-end">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-8" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="px-4 pb-4">
        {/* Pinterest-style masonry layout with skeletons */}
        <div className="columns-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => renderScenarioSkeleton(index))}
        </div>
      </div>
    )
  }

  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="px-4 pb-4 flex justify-center items-center h-32">
        <div className="text-gray-500">{t.scenarios.noScenariosAvailable}</div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-4">
      {/* Pinterest-style masonry layout using CSS columns */}
      <div className="columns-2 gap-3">
        {scenarios.map(scenario => (
          <div
            key={scenario.id}
            onClick={() => handleScenarioClick(scenario)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer break-inside-avoid mb-3"
          >
            {/* Illustration - Same height for all cards */}
            <div className="h-32 bg-gradient-to-br from-blue-10 via-green-10 to-yellow-10 flex items-center justify-center">
              {scenario.image_url ? (
                <img
                  src={scenario.image_url}
                  alt={scenario.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-16 h-10 bg-white bg-opacity-90 rounded-lg flex items-center justify-center border border-gray-200">
                  <span className="text-xs font-medium text-gray-600">
                    [Image]
                  </span>
                </div>
              )}
            </div>

            {/* Content - Height determined by content length */}
            <div className="p-4 relative">
              <h3 className="font-bold text-gray-900 text-sm mb-2 leading-tight">
                {scenario.title}
              </h3>

              {/* Context/Description */}
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                {scenario.context &&
                scenario.context.length > CONTEXT_DISPLAY_CHARACTER_COUNT
                  ? `${scenario.context.substring(0, CONTEXT_DISPLAY_CHARACTER_COUNT)}...`
                  : scenario.context || scenario.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-8">
                <span className="px-2 py-1 bg-blue-10 text-blue-100 text-xs rounded-full border">
                  {scenario.category}
                </span>
                <span className="px-2 py-1 bg-green-10 text-green-100 text-xs rounded-full border">
                  {scenario.difficulty_level}
                </span>
                {scenario.tags &&
                  scenario.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              {/* Practice Count - positioned at bottom right */}
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center space-x-1 text-gray-500">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    {scenario.practice_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
