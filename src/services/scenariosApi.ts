import { apiClient, ApiResponse } from './api'

export interface Scenario {
  id: string
  title: string
  category: string
  context: string
  objective: string
  difficulty_level: 'easy' | 'medium' | 'hard'
  language: string
  max_turns: number
  practice_count: number
  scenario_key: string
  display_order: number
  image_url: string | null
  is_active: boolean
  created_at: string
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
}

export interface ScenariosListParams {
  category?: string
  difficulty?: string
  search?: string
  page?: number
  limit?: number
  language?: string
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
}

export const scenariosApiService = new ScenariosApiService()
