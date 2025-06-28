'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFormValidation } from '@/hooks/useFormValidation';
import { RegisterCredentials } from '@/types/auth';
import { EmailConfirmation } from '../common/EmailConfirmation';

interface RegisterFormData extends RegisterCredentials {
  confirmPassword: string;
}

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { errors, validateField, validateForm } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData, 'register')) return;
    
    const registerData = {
      username: formData.username,
      email: formData.email,
      password: formData.password
    };
    const success = await register(registerData);
    
    if (success) {
      setUserEmail(formData.email);
      setShowEmailConfirmation(true);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value, formData);
  };

  if (showEmailConfirmation) {
    return (
      <EmailConfirmation 
        email={userEmail}
        onBackToRegister={() => {
          setShowEmailConfirmation(false);
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        }}
        onGoToLogin={() => router.push('/auth/login')}
      />
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl p-8 max-w-md w-full border border-white/30">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Đăng ký</h1>
        <p className="text-white">Tạo tài khoản mới để bắt đầu</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
            Tên người dùng
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={`w-full px-4 py-3 rounded-full border backdrop-blur-sm bg-white/20 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
              errors.username ? 'border-red-300' : 'border-white/40'
            }`}
            placeholder="Nhập tên người dùng"
            disabled={isLoading}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
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
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
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
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`w-full px-4 py-3 rounded-full border backdrop-blur-sm bg-white/20 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
              errors.confirmPassword ? 'border-red-300' : 'border-white/40'
            }`}
            placeholder="Nhập lại mật khẩu"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
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
              Đang đăng ký...
            </>
          ) : (
            'Đăng ký'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-white">
          Đã có tài khoản?{' '}
          <button
            onClick={() => router.push('/auth/login')}
            className="text-blue-300 hover:text-blue-400 font-medium transition duration-200"
            disabled={isLoading}
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}