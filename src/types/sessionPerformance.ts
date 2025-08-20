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

// Session History Types (based on actual API response)
export interface SessionListItem {
  id: string
  user_id: string
  scenario_role_id: string
  scenario_key: string
  status: 'complete' | 'active' | 'abandoned'
  current_turn: number
  connection_score: number
  user_rating?: number
  user_feedback?: string
  session_metadata: Record<string, unknown>
  started_at: string
  completed_at?: string
  created_at: string
  updated_at: string
  scenario_role?: {
    id: string
    role_name: string
    character_description: string
    avatar_url: string
    scenario: {
      id: string
      scenario_key: string
      title: string
      category: string
      difficulty_level: string
      max_turns: number
    }
  }
  counterpart_role?: {
    id: string
    role_name: string
    character_description: string
    avatar_url: string
  }
  user?: {
    id: string
    display_name: string
    email: string
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
