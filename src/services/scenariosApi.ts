import { apiClient, ApiResponse } from './api'

export interface ScenarioTag {
  id: string
  en_name: string
  zh_name: string
  description: string
  created_at: string
}

export interface ScenarioTip {
  title: string
  description: string
}

export interface ScenarioTipsResponse {
  id: string
  scenario_id: string
  tips: ScenarioTip[]
  created_at: string
  updated_at: string
}

export interface Scenario {
  id: string
  scenario_key: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  max_turns: number
  estimated_duration_minutes: number
  tags: string[]
  is_active: boolean
  practice_count: number
  created_at: string
  updated_at: string
  // Legacy fields for backward compatibility
  context?: string
  objective?: string
  difficulty_level?: 'easy' | 'medium' | 'hard'
  language?: string
  display_order?: number
  image_url?: string | null
}

export interface ScenarioRole {
  id: string
  scenario_id: string
  role_name: string
  role_name_en: string
  role_description: string
  role_description_en: string
  initial_message: string
  initial_message_en: string
  avatar_url?: string
}

export interface ScenariosListParams {
  category?: string
  difficulty?: string
  search?: string
  page?: number
  limit?: number
  language?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  tags?: string
}

export interface ScenariosListResponse {
  scenarios: Scenario[]
  total: number
  page: number
  limit: number
  total_pages: number
}

class ScenariosApiService {
  async getScenarios(
    params: ScenariosListParams = {}
  ): Promise<ApiResponse<Scenario[]>> {
    const searchParams = new URLSearchParams()

    if (params.category) searchParams.append('category', params.category)
    if (params.difficulty) searchParams.append('difficulty', params.difficulty)
    if (params.search) searchParams.append('search', params.search)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (params.language) searchParams.append('language', params.language)
    if (params.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder)
    if (params.tags) searchParams.append('tags', params.tags)

    const endpoint = searchParams.toString()
      ? `scenarios?${searchParams.toString()}`
      : 'scenarios'

    return apiClient.get<Scenario[]>(endpoint)
  }

  async getScenario(
    scenarioId: string,
    params?: { language?: string }
  ): Promise<ApiResponse<Scenario>> {
    const searchParams = new URLSearchParams()
    if (params?.language) searchParams.append('language', params.language)

    const queryString = searchParams.toString()
    const url = queryString
      ? `scenarios/${scenarioId}?${queryString}`
      : `scenarios/${scenarioId}`

    return apiClient.get<Scenario>(url)
  }

  async getScenarioRoles(
    scenarioId: string,
    params?: { language?: string }
  ): Promise<ApiResponse<ScenarioRole[]>> {
    const searchParams = new URLSearchParams()
    if (params?.language) searchParams.append('language', params.language)

    const queryString = searchParams.toString()
    const url = queryString
      ? `scenarios/${scenarioId}/roles?${queryString}`
      : `scenarios/${scenarioId}/roles`

    return apiClient.get<ScenarioRole[]>(url)
  }

  async getFeaturedScenarios(
    language?: string
  ): Promise<ApiResponse<Scenario[]>> {
    const params = new URLSearchParams()
    params.append('featured', 'true')
    params.append('limit', '10')
    if (language) params.append('language', language)

    return apiClient.get<Scenario[]>(`scenarios?${params.toString()}`)
  }

  async getScenariosByCategory(
    category: string,
    language?: string
  ): Promise<ApiResponse<Scenario[]>> {
    const params = new URLSearchParams()
    params.append('category', category)
    if (language) params.append('language', language)

    return apiClient.get<Scenario[]>(`scenarios?${params.toString()}`)
  }

  async searchScenarios(
    query: string,
    language?: string
  ): Promise<ApiResponse<Scenario[]>> {
    const params = new URLSearchParams()
    params.append('search', encodeURIComponent(query))
    if (language) params.append('language', language)

    return apiClient.get<Scenario[]>(`scenarios?${params.toString()}`)
  }

  async getTags(): Promise<ApiResponse<ScenarioTag[]>> {
    return apiClient.get<ScenarioTag[]>('tags')
  }

  async getScenarioTips(scenarioId: string): Promise<ApiResponse<ScenarioTipsResponse>> {
    return apiClient.get<ScenarioTipsResponse>(`scenarios/${scenarioId}/tips`)
  }
}

export const scenariosApiService = new ScenariosApiService()
