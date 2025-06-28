import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      
      if (response.statusCode === 200 || response.statusCode === 201) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        window.dispatchEvent(new Event('login-success'));
        
        router.push('/');
        return true;
      } else {
        setError(response.message || 'Đăng nhập thất bại');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(credentials);
      
      if (response.statusCode === 200 || response.statusCode === 201) {
        return true;
      } else {
        setError(response.message || 'Đăng ký thất bại');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.refreshToken();
      if (response.statusCode === 200 || response.statusCode === 201) {
        localStorage.setItem('access_token', response.data.access_token);
        window.dispatchEvent(new Event('auth-change'));
        return true;
      }
      throw new Error(response.message);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      setError(errorMessage);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-change'));
      router.push('/auth/login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Silent error to ensure logout proceeds
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setError(null);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/auth/login');
  };

  return {
    login,
    register,
    refreshToken,
    logout,
    isLoading,
    error
  };
}