// Session Performance Types (from backend API)
export interface SessionPerformance {
  session_id: string
  final_score: number
  total_turns: number
  avg_score_change: number
  breakthrough_moments: Array<{
    id: string
    session_id: string
    turn_number: number
    user_message: string
    ai_response: string
    ai_rationale: string
    connection_score_change: number
    character_state: Record<string, unknown>
    created_at: string
  }>
  setback_moments: Array<{
    id: string
    session_id: string
    turn_number: number
    user_message: string
    ai_response: string
    ai_rationale: string
    connection_score_change: number
    character_state: Record<string, unknown>
    created_at: string
  }>
  score_distribution?: {
    scenario_title: string
    total_sessions: number
    user_percentile: number
    scores: Array<{
      score: number
      userCount: number
    }>
    has_minimum_sample: boolean
  }
}

export interface SessionInsights {
  session_id: string
  what_went_well: string[]
  key_moments: string[]
  things_to_try_next: string[]
}

// Comparative Performance Types
export interface ScoreDistribution {
  score_range: string
  user_count: number
  percentage: number
}

export interface UserPercentile {
  user_score: number
  percentile: number
  better_than_percentage: number
}

// Session turn from API (actual structure)
export interface SessionTurn {
  id: string
  session_id: string
  turn_number: number
  user_message: string
  ai_response: string
  connection_score_change: number
  ai_rationale: string
  character_state: Record<string, unknown>
  created_at: string
}

// Session detail response from API
export interface SessionDetailResponse {
  session_info: {
    id: string
    scenario_key: string
    status: string
    current_turn: number
    connection_score: number
    user_rating?: number
    user_feedback?: string
    started_at: string
    completed_at?: string
  }
  participants: {
    user: {
      role_name: string
      avatar_url: string
    }
    ai: {
      role_name: string
      avatar_url: string
    }
  }
  turns: SessionTurn[]
  cumulative_scores: Array<{
    turn_number: number
    current_score: number
  }>
}

// Session History Types (based on actual API response)
export interface SessionListItem {
  id: string
  user_id: string
  scenario_role_id: string
  scenario_id: string
  scenario_key: string
  status: 'completed' | 'active' | 'abandoned'
  current_turn: number
  connection_score: number
  user_rating?: number
  user_feedback?: string
  session_metadata: Record<string, unknown>
  started_at: string
  completed_at?: string
  scenario_role: {
    id: string
    language: string
    role_key: string
    role_name: string
    avatar_url: string
    created_at: string
    scenario_id: string
    initial_message: string
    role_constraints: string[]
    character_description: string
    initial_emotional_state: Record<string, unknown>
  }
  scenario: {
    id: string
    title: string
    context: string
    category: string
    language: string
    image_url?: string
    is_active: boolean
    max_turns: number
    objective: string
    created_at: string
    scenario_key: string
    display_order: number
    practice_count: number
    difficulty_level: string
  }
  user: {
    id: string
    email: string
    display_name: string
  }
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
}

// Chart Data Types for Recharts
export interface ChartDataPoint {
  turn: number
  score: number
  change: number
}

export interface DistributionChartData {
  range: string
  count: number
  isUserRange: boolean
}
