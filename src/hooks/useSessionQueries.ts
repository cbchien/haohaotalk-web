import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SessionPerformanceAPI } from '@/services/sessionPerformanceApi'
import { sessionsApiService } from '@/services/sessionsApi'
import { scenariosApiService } from '@/services/scenariosApi'
import { cacheKeys, cacheTime, staleTime } from '@/utils/cacheKeys'
import { useAuthStore } from '@/store'
import type {
  SessionPerformance,
  SessionInsights,
  SessionListItem,
  SessionDetailResponse,
} from '@/types/sessionPerformance'
import type { ScenarioTipsResponse } from '@/services/scenariosApi'

// High Priority: Session Performance Hook
export const useSessionPerformance = (sessionId: string | undefined) => {
  const { isInitialized, isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: sessionId ? cacheKeys.sessions.performance(sessionId) : [],
    queryFn: async (): Promise<SessionPerformance> => {
      if (!sessionId) throw new Error('Session ID required')
      const response =
        await SessionPerformanceAPI.getSessionPerformance(sessionId)
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load session performance')
      }
      return response.data
    },
    enabled: !!sessionId && isInitialized && isAuthenticated,
    // Permanent cache for completed sessions (immutable data)
    staleTime: staleTime.NEVER,
    gcTime: cacheTime.PERMANENT,
    // Don't refetch this data - it never changes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  })
}

// High Priority: Session Insights Hook
export const useSessionInsights = (sessionId: string | undefined) => {
  const { isInitialized, isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: sessionId ? cacheKeys.sessions.insights(sessionId) : [],
    queryFn: async (): Promise<SessionInsights> => {
      if (!sessionId) throw new Error('Session ID required')
      const response = await SessionPerformanceAPI.getSessionInsights(sessionId)
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load session insights')
      }
      return response.data
    },
    enabled: !!sessionId && isInitialized && isAuthenticated,
    // Permanent cache for insights (immutable data)
    staleTime: staleTime.NEVER,
    gcTime: cacheTime.PERMANENT,
    // Don't refetch this data - it never changes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  })
}

// Medium Priority: Sessions List Hook
export const useSessionsList = (limit: number = 20) => {
  const { isInitialized, isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: [...cacheKeys.sessions.list, { limit }],
    queryFn: async (): Promise<SessionListItem[]> => {
      const response = await SessionPerformanceAPI.getUserSessions({ limit })
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load sessions')
      }
      return response.data
    },
    // Only run query after auth is initialized and user is authenticated
    enabled: isInitialized && isAuthenticated,
    // Smart caching - stale after 2 minutes, cache for 30 minutes
    staleTime: staleTime.MEDIUM,
    gcTime: cacheTime.LONG,
    // Refetch on focus to get latest sessions
    refetchOnWindowFocus: true,
  })
}

// Utility hook: Single Session Detail (for navigation state)
export const useSessionDetail = (sessionId: string | undefined) => {
  const { isInitialized, isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: sessionId ? cacheKeys.sessions.detail(sessionId) : [],
    queryFn: async (): Promise<SessionDetailResponse> => {
      if (!sessionId) throw new Error('Session ID required')
      const response = await SessionPerformanceAPI.getSession(sessionId)
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load session details')
      }
      return response.data
    },
    enabled: !!sessionId && isInitialized && isAuthenticated,
    // Medium cache time for session metadata
    staleTime: staleTime.MEDIUM,
    gcTime: cacheTime.LONG,
  })
}

// Combined hook for Insights Page (loads performance, insights, and session detail with turns)
export const useSessionInsightsData = (sessionId: string | undefined) => {
  const performanceQuery = useSessionPerformance(sessionId)
  const insightsQuery = useSessionInsights(sessionId)
  const sessionDetailQuery = useSessionDetail(sessionId)

  return {
    performance: performanceQuery.data,
    insights: insightsQuery.data,
    turns: sessionDetailQuery.data?.turns || [],
    isLoading:
      performanceQuery.isLoading ||
      insightsQuery.isLoading ||
      sessionDetailQuery.isLoading,
    error:
      performanceQuery.error || insightsQuery.error || sessionDetailQuery.error,
    isError:
      performanceQuery.isError ||
      insightsQuery.isError ||
      sessionDetailQuery.isError,
    // All queries succeeded
    isSuccess:
      performanceQuery.isSuccess &&
      insightsQuery.isSuccess &&
      sessionDetailQuery.isSuccess,
  }
}

// Combined hook for Comparison Page (loads performance + optional session detail)
export const useSessionComparisonData = (
  sessionId: string | undefined,
  needsSessionDetail: boolean = false
) => {
  const performanceQuery = useSessionPerformance(sessionId)
  const sessionDetailQuery = useSessionDetail(
    needsSessionDetail ? sessionId : undefined
  )

  return {
    performance: performanceQuery.data,
    sessionDetail: sessionDetailQuery.data,
    isLoading:
      performanceQuery.isLoading ||
      (needsSessionDetail && sessionDetailQuery.isLoading),
    error: performanceQuery.error || sessionDetailQuery.error,
    isError: performanceQuery.isError || sessionDetailQuery.isError,
    isSuccess:
      performanceQuery.isSuccess &&
      (!needsSessionDetail || sessionDetailQuery.isSuccess),
  }
}

// Rating mutation for sessions
export const useRateSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      rating,
      feedback,
    }: {
      sessionId: string
      rating: number
      feedback?: string
    }) => {
      const response = await sessionsApiService.rateSession(sessionId, {
        rating,
        feedback,
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to submit rating')
      }

      return response.data
    },
    onSuccess: (_, variables) => {
      // Invalidate sessions list to show updated rating
      queryClient.invalidateQueries({
        queryKey: cacheKeys.sessions.list,
      })

      // Update specific session detail cache if exists
      queryClient.invalidateQueries({
        queryKey: cacheKeys.sessions.detail(variables.sessionId),
      })

      // Update session performance cache if exists
      queryClient.invalidateQueries({
        queryKey: cacheKeys.sessions.performance(variables.sessionId),
      })
    },
  })
}

// Scenario tips hook - used by session performance pages
export const useScenarioTips = (scenarioId: string | undefined) => {
  return useQuery({
    queryKey: cacheKeys.scenarios.tips(scenarioId),
    queryFn: async (): Promise<ScenarioTipsResponse> => {
      if (!scenarioId) {
        throw new Error('Scenario ID is required')
      }
      const response = await scenariosApiService.getScenarioTips(scenarioId)
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load scenario tips')
      }
      return response.data
    },
    // Only run query if scenarioId is provided
    enabled: !!scenarioId,
    // Cache tips for long time since they rarely change
    staleTime: staleTime.LONG,
    gcTime: cacheTime.LONG,
    // Don't refetch on focus since tips are fairly static
    refetchOnWindowFocus: false,
    // Retry on error, but not for 404s (tips might not exist)
    retry: (failureCount, error) => {
      const errorMessage = error?.message || ''
      if (
        errorMessage.includes('404') ||
        errorMessage.includes('SCENARIO_TIPS_NOT_FOUND')
      ) {
        return false
      }
      return failureCount < 2
    },
  })
}
