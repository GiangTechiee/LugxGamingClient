'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFormValidation } from '@/hooks/useFormValidation';
import { LoginCredentials } from '@/types/auth';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const { errors, validateField, validateForm } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData, 'login')) return;
    
    const success = await login(formData);
    if (success) {
      router.push('/');
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value, formData);
  };

  const handleNavigation = (path: string) => {
    router.push(`/auth/${path}`);
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl p-8 max-w-md w-full border border-white/30">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Đăng nhập</h1>
        <p className="text-gray-200">Chào mừng bạn quay trở lại!</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-full border backdrop-blur-sm bg-white/20 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
              errors.email ? 'border-red-300' : 'border-white/40'
            }`}
            placeholder="Nhập địa chỉ email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full px-4 py-3 rounded-full border backdrop-blur-sm bg-white/20 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
              errors.password ? 'border-red-300' : 'border-white/40'
            }`}
            placeholder="Nhập mật khẩu"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-full transition duration-200 flex items-center justify-center ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-200">
          Chưa có tài khoản?{' '}
          <button
            onClick={() => handleNavigation('register')}
            className="text-blue-300 hover:text-blue-400 font-medium transition duration-200"
            disabled={isLoading}
          >
            Đăng ký ngay
          </button>
        </p>
        
        <p className="mt-4">
          <button
            onClick={() => handleNavigation('reset-password')}
            className="text-sm text-gray-300 hover:text-gray-400 transition duration-200"
            disabled={isLoading}
          >
            Quên mật khẩu?
          </button>
        </p>
      </div>
    </div>
  );
}