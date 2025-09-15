import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { useAppStore, useAuthStore } from '@/store'
import type { Scenario } from '@/services'
import { useTranslation } from '@/utils/translations'
import { useHomeScenarios } from '@/hooks/useHomeQueries'
import { cacheKeys } from '@/utils/cacheKeys'
import { MasonryGrid } from './MasonryGrid'

const CONTEXT_DISPLAY_CHARACTER_COUNT = 100

export const ScenarioGrid = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { selectedCategories, currentLanguage } = useAppStore()
  const {
    incrementViewedScenarios,
    shouldShowConversionPrompt,
    setShowConversionPrompt,
    user,
  } = useAuthStore()
  const t = useTranslation(currentLanguage)
  const [isRetrying, setIsRetrying] = useState(false)

  const category =
    selectedCategories.length > 0 ? selectedCategories[0] : undefined
  const scenariosQuery = useHomeScenarios(category, currentLanguage)

  const scenarios = scenariosQuery.data || []
  const loading = scenariosQuery.isLoading
  const { error, isError } = scenariosQuery

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

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await queryClient.refetchQueries({
        queryKey: cacheKeys.scenarios.home(category, currentLanguage),
      })
    } catch {
      // Error will be handled by React Query's error state
    } finally {
      setIsRetrying(false)
    }
  }

  const renderScenarioSkeleton = (index: number) => (
    <div
      key={`skeleton-${index}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm break-inside-avoid mb-3"
    >
      {/* Image skeleton */}
      <div className="h-32 sm:h-[186px] bg-gray-200 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />

        {/* Description skeleton - varies by index to simulate different content lengths */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
          {index % 3 === 0 && (
            <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
          )}
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
        <MasonryGrid gap={12} minColumnWidth={280}>
          {Array.from({ length: 6 }).map((_, index) =>
            renderScenarioSkeleton(index)
          )}
        </MasonryGrid>
      </div>
    )
  }

  if (isError || error) {
    return (
      <div className="px-4 pb-4 flex justify-center items-center h-32">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {error?.message || 'Failed to load scenarios'}
          </p>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-4 py-2 bg-blue-100 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRetrying ? t.common.loading : t.common.retry}
          </button>
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
      <MasonryGrid gap={12} minColumnWidth={280}>
        {scenarios.map(scenario => (
          <div
            key={scenario.id}
            onClick={() => handleScenarioClick(scenario)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover-shadow transition-smooth cursor-pointer mb-3 tap-highlight"
          >
            {/* Illustration - Same height for all cards */}
            <div className="h-32 sm:h-[186px] bg-gradient-to-br from-blue-10 via-green-10 to-yellow-10 flex items-center justify-center">
              {scenario.image_url ? (
                <img
                  src={scenario.image_url}
                  alt={scenario.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
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
      </MasonryGrid>
    </div>
  )
}
