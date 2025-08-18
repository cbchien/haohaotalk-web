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
}

export interface ScenariosListResponse {
  scenarios: Scenario[]
  total: number
  page: number
  limit: number
  total_pages: number
}

class ScenariosApiService {
  async getScenarios(params: ScenariosListParams = {}): Promise<ApiResponse<Scenario[]>> {
    const searchParams = new URLSearchParams()
    
    if (params.category) searchParams.append('category', params.category)
    if (params.difficulty) searchParams.append('difficulty', params.difficulty)
    if (params.search) searchParams.append('search', params.search)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())

    const endpoint = searchParams.toString() 
      ? `scenarios?${searchParams.toString()}` 
      : 'scenarios'

    return apiClient.get<Scenario[]>(endpoint)
  }

  async getScenario(id: string): Promise<ApiResponse<Scenario>> {
    return apiClient.get<Scenario>(`scenarios/${id}`)
  }

  async getScenarioRoles(scenarioId: string): Promise<ApiResponse<ScenarioRole[]>> {
    return apiClient.get<ScenarioRole[]>(`scenarios/${scenarioId}/roles`)
  }

  async getFeaturedScenarios(): Promise<ApiResponse<Scenario[]>> {
    return apiClient.get<Scenario[]>('scenarios?featured=true&limit=10')
  }

  async getScenariosByCategory(category: string): Promise<ApiResponse<Scenario[]>> {
    return apiClient.get<Scenario[]>(`scenarios?category=${category}`)
  }

  async searchScenarios(query: string): Promise<ApiResponse<Scenario[]>> {
    return apiClient.get<Scenario[]>(`scenarios?search=${encodeURIComponent(query)}`)
  }
}

export const scenariosApiService = new ScenariosApiService()