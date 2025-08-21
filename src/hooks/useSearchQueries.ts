import { useQuery } from '@tanstack/react-query'
import { scenariosApiService } from '@/services/scenariosApi'
import { cacheKeys, cacheTime, staleTime } from '@/utils/cacheKeys'
import type { Scenario, ScenarioTag } from '@/services/scenariosApi'

// Popular scenarios hook - cached across navigation
export const usePopularScenarios = (language: 'en' | 'zh') => {
  return useQuery({
    queryKey: cacheKeys.scenarios.popular(language),
    queryFn: async (): Promise<Scenario[]> => {
      const response = await scenariosApiService.getScenarios({
        sortBy: 'practice_count',
        sortOrder: 'desc',
        limit: 10,
        language,
      })
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load popular scenarios')
      }
      return response.data
    },
    // Cache popular scenarios for medium time since they don't change often
    staleTime: staleTime.MEDIUM,
    gcTime: cacheTime.LONG,
    // Refetch on focus to get latest practice counts
    refetchOnWindowFocus: true,
  })
}

// Search scenarios hook - cached per query and language
export const useSearchScenarios = (
  query: string,
  language: 'en' | 'zh',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: cacheKeys.scenarios.search(query, language),
    queryFn: async (): Promise<Scenario[]> => {
      const response = await scenariosApiService.getScenarios({
        search: query,
        language,
      })
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to search scenarios')
      }
      return response.data
    },
    enabled: enabled && query.trim().length > 0,
    // Cache search results for medium time
    staleTime: staleTime.MEDIUM,
    gcTime: cacheTime.MEDIUM,
    // Don't refetch search results automatically
    refetchOnWindowFocus: false,
  })
}

// Tag filtered scenarios hook - cached per tag and language
export const useTagScenarios = (
  tagName: string,
  language: 'en' | 'zh',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: cacheKeys.scenarios.tag(tagName, language),
    queryFn: async (): Promise<Scenario[]> => {
      const response = await scenariosApiService.getScenarios({
        tags: tagName,
        language,
      })
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load tag scenarios')
      }
      return response.data
    },
    enabled: enabled && tagName.trim().length > 0,
    // Cache tag results for medium time
    staleTime: staleTime.MEDIUM,
    gcTime: cacheTime.MEDIUM,
    // Don't refetch tag results automatically
    refetchOnWindowFocus: false,
  })
}

// Available tags hook - cached globally
export const useAvailableTags = () => {
  return useQuery({
    queryKey: cacheKeys.tags.list,
    queryFn: async (): Promise<ScenarioTag[]> => {
      const response = await scenariosApiService.getTags()
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load tags')
      }
      return response.data
    },
    // Cache tags for long time since they rarely change
    staleTime: staleTime.LONG,
    gcTime: cacheTime.LONG,
    // Don't refetch tags automatically
    refetchOnWindowFocus: false,
  })
}
