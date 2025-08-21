import { useQuery } from '@tanstack/react-query'
import { scenariosApiService } from '@/services/scenariosApi'
import { cacheKeys, cacheTime, staleTime } from '@/utils/cacheKeys'
import type { Scenario } from '@/services/scenariosApi'

// Home page scenarios hook - cached per category and language
export const useHomeScenarios = (
  category: string | undefined,
  language: 'en' | 'zh'
) => {
  return useQuery({
    queryKey: cacheKeys.scenarios.home(category, language),
    queryFn: async (): Promise<Scenario[]> => {
      const response = await scenariosApiService.getScenarios({
        category: category === 'featured' ? undefined : category,
        language,
        limit: 20,
      })
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load home scenarios')
      }
      return response.data
    },
    // Cache scenarios for medium time since they change moderately
    staleTime: staleTime.MEDIUM,
    gcTime: cacheTime.MEDIUM,
    // Refetch on focus to get latest data
    refetchOnWindowFocus: true,
  })
}
