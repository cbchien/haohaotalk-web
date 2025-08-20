import { apiClient, ApiResponse } from './api'

export interface CreateSessionData {
  scenario_id: string
  scenario_role_id: string
  relationship_level?: 'low' | 'normal' | 'high'
  language: 'en' | 'zh'
}

export interface Session {
  id: string
  user_id: string
  scenario_id: string
  role_id: string
  language: 'en' | 'zh'
  status: 'active' | 'completed' | 'abandoned'
  turns_count: number
  connection_score?: number
  is_completed?: boolean
  max_turns?: number
  current_turn?: number
  rating?: number
  feedback?: string
  started_at: string
  completed_at?: string
  created_at: string
  updated_at: string
  turns?: ConversationTurn[]
}

export interface ConversationTurn {
  id: string
  session_id: string
  turn_number: number
  user_message: string
  ai_response: string
  ai_feedback?: string
  character_emotion?: 'neutral' | 'happy' | 'concerned' | 'frustrated'
  score_change?: number
  created_at: string
}

export interface CreateTurnData {
  user_message: string
  language?: 'en' | 'zh'
}

export interface CreateTurnResponse {
  turn: ConversationTurn
  session: {
    connection_score: number
    current_turn: number
    max_turns: number
    is_completed: boolean
    completion_reason?: 'max_turns' | 'manual' | 'objective_achieved'
  }
  session_completed?: boolean
}

export interface RateSessionData {
  rating: number
  feedback?: string
}

export interface SessionsListParams {
  status?: Session['status']
  scenario_id?: string
  page?: number
  limit?: number
}

export interface SessionsListResponse {
  sessions: Session[]
  total: number
  page: number
  limit: number
  total_pages: number
}

class SessionsApiService {
  async createSession(data: CreateSessionData): Promise<ApiResponse<Session>> {
    return apiClient.post<Session>('sessions', data)
  }

  async getSessions(
    params: SessionsListParams = {}
  ): Promise<ApiResponse<SessionsListResponse>> {
    const searchParams = new URLSearchParams()

    if (params.status) searchParams.append('status', params.status)
    if (params.scenario_id)
      searchParams.append('scenario_id', params.scenario_id)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())

    const endpoint = searchParams.toString()
      ? `sessions?${searchParams.toString()}`
      : 'sessions'

    return apiClient.get<SessionsListResponse>(endpoint)
  }

  async getSession(id: string): Promise<ApiResponse<Session>> {
    return apiClient.get<Session>(`sessions/${id}`)
  }

  async getSessionTurns(
    sessionId: string
  ): Promise<ApiResponse<ConversationTurn[]>> {
    return apiClient.get<ConversationTurn[]>(`sessions/${sessionId}/turns`)
  }

  async createTurn(
    sessionId: string,
    data: CreateTurnData
  ): Promise<ApiResponse<CreateTurnResponse>> {
    return apiClient.post<CreateTurnResponse>(
      `sessions/${sessionId}/turns`,
      data
    )
  }

  async submitTurn(
    sessionId: string,
    data: CreateTurnData
  ): Promise<ApiResponse<CreateTurnResponse>> {
    return this.createTurn(sessionId, data)
  }

  async endSession(sessionId: string): Promise<ApiResponse<Session>> {
    return apiClient.post<Session>(`sessions/${sessionId}/end`, {})
  }

  async rateSession(
    sessionId: string,
    data: RateSessionData
  ): Promise<ApiResponse<Session>> {
    return apiClient.put<Session>(`sessions/${sessionId}/rating`, data)
  }

  async abandonSession(sessionId: string): Promise<ApiResponse<Session>> {
    return apiClient.put<Session>(`sessions/${sessionId}`, {
      status: 'abandoned',
    })
  }
}

export const sessionsApiService = new SessionsApiService()
