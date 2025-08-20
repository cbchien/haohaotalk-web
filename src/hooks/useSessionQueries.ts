import { useQuery } from '@tanstack/react-query'
import { SessionPerformanceAPI } from '@/services/sessionPerformanceApi'
import { cacheKeys, cacheTime, staleTime } from '@/utils/cacheKeys'
import type {
  SessionPerformance,
  SessionInsights,
  SessionListItem,
} from '@/types/sessionPerformance'

// High Priority: Session Performance Hook
export const useSessionPerformance = (sessionId: string | undefined) => {
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
    enabled: !!sessionId,
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
    enabled: !!sessionId,
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
  return useQuery({
    queryKey: [...cacheKeys.sessions.list, { limit }],
    queryFn: async (): Promise<SessionListItem[]> => {
      const response = await SessionPerformanceAPI.getUserSessions({ limit })
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load sessions')
      }
      return response.data
    },
    // Smart caching - stale after 2 minutes, cache for 30 minutes
    staleTime: staleTime.MEDIUM,
    gcTime: cacheTime.LONG,
    // Refetch on focus to get latest sessions
    refetchOnWindowFocus: true,
  })
}

// Utility hook: Single Session Detail (for navigation state)
export const useSessionDetail = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: sessionId ? cacheKeys.sessions.detail(sessionId) : [],
    queryFn: async (): Promise<SessionListItem> => {
      if (!sessionId) throw new Error('Session ID required')
      const response = await SessionPerformanceAPI.getSession(sessionId)
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load session details')
      }
      // API returns array, we want first item
      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data
      if (!data) throw new Error('Session not found')
      return data as SessionListItem
    },
    enabled: !!sessionId,
    // Medium cache time for session metadata
    staleTime: staleTime.MEDIUM,
    gcTime: cacheTime.LONG,
  })
}

// Combined hook for Insights Page (loads both performance and insights)
export const useSessionInsightsData = (sessionId: string | undefined) => {
  const performanceQuery = useSessionPerformance(sessionId)
  const insightsQuery = useSessionInsights(sessionId)

  return {
    performance: performanceQuery.data,
    insights: insightsQuery.data,
    isLoading: performanceQuery.isLoading || insightsQuery.isLoading,
    error: performanceQuery.error || insightsQuery.error,
    isError: performanceQuery.isError || insightsQuery.isError,
    // Both queries succeeded
    isSuccess: performanceQuery.isSuccess && insightsQuery.isSuccess,
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
