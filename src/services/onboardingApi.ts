import { apiClient } from './api'
import type { ApiResponse } from './api'
import type { User } from '@/store/types'

class OnboardingApiService {
  async updateOnboardingStatus(completed: boolean): Promise<ApiResponse<User>> {
    return apiClient.put('users/profile', {
      onboardingCompleted: completed,
    })
  }

  async getOnboardingStatus(): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get('auth/me')
  }

  // Local storage fallback for offline scenarios
  setLocalOnboardingStatus(userId: string, completed: boolean): void {
    localStorage.setItem(`onboarding-completed-${userId}`, completed.toString())
  }

  getLocalOnboardingStatus(userId: string): boolean {
    return localStorage.getItem(`onboarding-completed-${userId}`) === 'true'
  }
}

export const OnboardingAPI = new OnboardingApiService()
