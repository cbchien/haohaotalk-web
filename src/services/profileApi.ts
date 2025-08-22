import { apiClient } from './api'
import type { ApiResponse } from './api'

// Feedback interfaces
export interface FeedbackRequest {
  subject: string
  body: string
}

export interface FeedbackResponse {
  id: string
  subject: string
  created_at: string
}

// Account deletion interfaces
export interface AccountDeletionResponse {
  message: string
  deletedAt: string
}

class ProfileApiService {
  // Submit feedback
  async submitFeedback(
    feedback: FeedbackRequest
  ): Promise<ApiResponse<FeedbackResponse>> {
    return apiClient.post<FeedbackResponse>('feedback', feedback)
  }

  // Delete user account
  async deleteAccount(): Promise<ApiResponse<AccountDeletionResponse>> {
    return apiClient.delete<AccountDeletionResponse>('users/me')
  }
}

export const profileApiService = new ProfileApiService()