import { apiClient, ApiResponse } from './api'
import { User } from '@/store/types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  display_name: string
}

export interface GuestData {
  display_name: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface GoogleAuthData {
  credential: string
}

class AuthApiService {
  async createGuestUser(data: GuestData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('auth/guest', data)
    
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token)
    }
    
    return response
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('auth/register', data)
    
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token)
    }
    
    return response
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('auth/login', credentials)
    
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token)
    }
    
    return response
  }

  async googleAuth(data: GoogleAuthData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('auth/google', data)
    
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token)
    }
    
    return response
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('auth/me')
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>('users/profile', updates)
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>('users/password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
  }

  async convertGuestToEmail(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('auth/convert-guest', {
      email,
      password,
    })
    
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token)
    }
    
    return response
  }

  async convertGuestToGoogle(data: GoogleAuthData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('auth/convert-guest-google', data)
    
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token)
    }
    
    return response
  }

  logout(): void {
    apiClient.setAuthToken(null)
  }
}

export const authApiService = new AuthApiService()