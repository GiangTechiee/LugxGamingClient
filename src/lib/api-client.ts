import { IResponse, ErrorResponse } from '../types/api';
import { AuthResponse } from '../types/auth';

export class ApiClient {
  private readonly baseUrl: string;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string | null) => void> = [];

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') {
    if (!baseUrl) {
      throw new Error('API base URL is not defined. Please set NEXT_PUBLIC_API_URL in your environment variables.');
    }
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response, init: RequestInit): Promise<IResponse<T>> {
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        const newAccessToken = await this.handleTokenRefresh();
        if (!newAccessToken) {
          throw new Error('Invalid refresh token. Please try again or login again.');
        }

        // Retry lại yêu cầu ban đầu với token mới
        return await this.retryRequest<T>(response.url, init);
      }
      const errorData = data as ErrorResponse;
      throw new Error(
        Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message,
      );
    }
    return data as IResponse<T>;
  }

  private async handleTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push(resolve);
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        const newAccessToken = (data as IResponse<AuthResponse>).data.access_token;
        localStorage.setItem('access_token', newAccessToken);
        this.refreshSubscribers.forEach((callback) => callback(newAccessToken));
        this.refreshSubscribers = [];
        return newAccessToken;
      }
      const errorData = data as ErrorResponse;
      const errorMessage = Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message;
      throw new Error(errorMessage);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi làm mới token. Vui lòng thử lại.';
      this.refreshSubscribers.forEach((callback) => callback(null));
      this.refreshSubscribers = [];
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      throw new Error(errorMessage);
    } finally {
      this.isRefreshing = false;
    }
  }

  private async retryRequest<T>(url: string, init: RequestInit): Promise<IResponse<T>> {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      credentials: 'include',
    });
    return this.handleResponse<T>(response, init);
  }

  async get<T>(endpoint: string, headers: HeadersInit = {}): Promise<IResponse<T>> {
    const accessToken = localStorage.getItem('access_token');
    const init: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        ...headers,
      },
      credentials: 'include',
    };
    const response = await fetch(`${this.baseUrl}/${endpoint}`, init);
    return this.handleResponse<T>(response, init);
  }

  async post<T, D = unknown>(endpoint: string, body?: D, headers: HeadersInit = {}): Promise<IResponse<T>> {
    const accessToken = localStorage.getItem('access_token');
    const init: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    };
    const response = await fetch(`${this.baseUrl}/${endpoint}`, init);
    return this.handleResponse<T>(response, init);
  }

  async put<T, D>(endpoint: string, body: D, headers: HeadersInit = {}): Promise<IResponse<T>> {
    const accessToken = localStorage.getItem('access_token');
    const init: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        ...headers,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    };
    const response = await fetch(`${this.baseUrl}/${endpoint}`, init);
    return this.handleResponse<T>(response, init);
  }

  async patch<T, D>(endpoint: string, body: D, headers: HeadersInit = {}): Promise<IResponse<T>> {
    const accessToken = localStorage.getItem('access_token');
    const init: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        ...headers,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    };
    const response = await fetch(`${this.baseUrl}/${endpoint}`, init);
    return this.handleResponse<T>(response, init);
  }

  async delete<T>(endpoint: string, headers: HeadersInit = {}): Promise<IResponse<T>> {
    const accessToken = localStorage.getItem('access_token');
    const init: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        ...headers,
      },
      credentials: 'include',
    };
    const response = await fetch(`${this.baseUrl}/${endpoint}`, init);
    return this.handleResponse<T>(response, init);
  }
}

export const apiClient = new ApiClient();