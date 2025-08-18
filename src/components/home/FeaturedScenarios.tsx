import { useState, useEffect } from 'react'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { useAppStore } from '@/store'
import { scenariosApiService, Scenario } from '@/services'

const CONTEXT_DISPLAY_CHARACTER_COUNT = 100

export const ScenarioGrid = () => {
  const { selectedCategories } = useAppStore()
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchScenarios = async () => {
      setLoading(true)
      try {
        const category =
          selectedCategories.length > 0 ? selectedCategories[0] : undefined

        const response = await scenariosApiService.getScenarios({
          category: category === 'featured' ? undefined : category,
          limit: 20,
        })

        if (response.success && response.data) {
          setScenarios(response.data)
        } else {
          console.error('Failed to fetch scenarios:', response.error)
          setScenarios([])
        }
      } catch (error) {
        console.error('Error fetching scenarios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchScenarios()
  }, [selectedCategories])

  if (loading) {
    return (
      <div className="px-4 pb-4 flex justify-center items-center h-32">
        <div className="text-gray-500">Loading scenarios...</div>
      </div>
    )
  }

  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="px-4 pb-4 flex justify-center items-center h-32">
        <div className="text-gray-500">No scenarios available</div>
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
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer break-inside-avoid mb-3"
          >
            {/* Illustration - Same height for all cards */}
            <div className="h-32 bg-gradient-to-br from-blue-10 via-green-10 to-yellow-10 p-4 flex items-center justify-center">
              {scenario.image_url ? (
                <img
                  src={scenario.image_url}
                  alt={scenario.title}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                  <span className="text-xl">🎭</span>
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
                {scenario.context.length > CONTEXT_DISPLAY_CHARACTER_COUNT
                  ? `${scenario.context.substring(0, CONTEXT_DISPLAY_CHARACTER_COUNT)}...`
                  : scenario.context}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-8">
                <span className="px-2 py-1 bg-blue-10 text-blue-100 text-xs rounded-full border">
                  {scenario.category}
                </span>
                <span className="px-2 py-1 bg-green-10 text-green-100 text-xs rounded-full border">
                  {scenario.difficulty_level}
                </span>
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
