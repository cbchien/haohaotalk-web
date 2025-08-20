import { apiClient } from './api'
import type { ApiResponse } from './api'
import {
  SessionPerformance,
  SessionInsights,
  SessionListItem,
} from '@/types/sessionPerformance'

class SessionPerformanceApiService {
  // Session Performance
  async getSessionPerformance(
    sessionId: string
  ): Promise<ApiResponse<SessionPerformance>> {
    return apiClient.get(`sessions/${sessionId}/analytics`)
  }

  async getSessionInsights(
    sessionId: string
  ): Promise<ApiResponse<SessionInsights>> {
    return apiClient.get(`sessions/${sessionId}/insights`)
  }

  // Session History
  async getUserSessions(filters?: {
    limit?: number
    offset?: number
    dateRange?: { start: string; end: string }
    completed?: boolean
  }): Promise<ApiResponse<SessionListItem[]>> {
    const params = new URLSearchParams()

    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.offset) params.append('offset', filters.offset.toString())
    if (filters?.completed !== undefined)
      params.append('completed', filters.completed.toString())
    if (filters?.dateRange) {
      params.append('start_date', filters.dateRange.start)
      params.append('end_date', filters.dateRange.end)
    }

    const queryString = params.toString()
    const endpoint = `sessions${queryString ? `?${queryString}` : ''}`

    return apiClient.get(endpoint)
  }

  // Get single session by ID
  async getSession(sessionId: string): Promise<ApiResponse<SessionListItem>> {
    return apiClient.get(`sessions/${sessionId}`)
  }

  // Platform Statistics (for overall analytics)
  async getPlatformStats(): Promise<
    ApiResponse<{
      totalUsers: number
      totalSessions: number
      totalScenarios: number
      averageSessionLength: number
    }>
  > {
    return apiClient.get('admin/stats')
  }
}

export const SessionPerformanceAPI = new SessionPerformanceApiService()
