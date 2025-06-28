import { apiClient } from '../lib/api-client';
import { IResponse } from '../types/api';
import { AuthResponse, LoginCredentials, RegisterCredentials, ResetPasswordData } from '../types/auth';

export class AuthService {
  async register(data: RegisterCredentials): Promise<IResponse<AuthResponse>> {
    return apiClient.post<AuthResponse, RegisterCredentials>('auth/register', data);
  }

  async login(data: LoginCredentials): Promise<IResponse<AuthResponse>> {
    return apiClient.post<AuthResponse, LoginCredentials>('auth/login', data);
  }

  async verifyEmail(token: string): Promise<IResponse<string>> {
    return apiClient.post<string, { token: string }>('auth/verify-email', { token });
  }

  async verifyEmailByQuery(token: string): Promise<string> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        Array.isArray(error.message) ? error.message.join(', ') : error.message,
      );
    }
    return response.text();
  }

  async requestPasswordReset(email: string): Promise<IResponse<string>> {
    return apiClient.post<string, { email: string }>('auth/request-password-reset', { email });
  }

  async resetPassword(data: ResetPasswordData): Promise<IResponse<string>> {
    return apiClient.post<string, ResetPasswordData>('auth/reset-password', data);
  }

  async refreshToken(): Promise<IResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('auth/refresh');
  }

  async logout(): Promise<IResponse<string>> {
    return apiClient.post<string>('auth/logout');
  }
}

export const authService = new AuthService();