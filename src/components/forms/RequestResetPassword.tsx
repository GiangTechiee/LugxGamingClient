'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '@/services/authService';
import { Mail, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';

interface RequestResetFormProps {
  onBack?: () => void;
  onNavigateToReset?: () => void;
}

export function RequestResetForm({ onBack, onNavigateToReset }: RequestResetFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.requestPasswordReset(email);
      setResetMessage(response.message);
      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Email đã được gửi!
          </h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            {resetMessage}
          </p>
          <p className="text-gray-300 mb-2 leading-relaxed">
            Mã khôi phục đã được gửi đến email <br />
            <span className="font-semibold text-blue-300">{email}</span>
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Vui lòng kiểm tra hộp thư và sử dụng mã để đặt lại mật khẩu. Mã có hiệu lực trong 15 phút.
          </p>
          
          <div className="space-y-3">
            <motion.button
              onClick={onNavigateToReset}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              whileTap={{ scale: 0.98 }}
            >
              Nhập mã khôi phục
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl transition-all duration-200 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4"
        >
          <Mail className="w-12 h-12 text-blue-400 mx-auto" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Đặt lại mật khẩu?
        </h2>
        <p className="text-gray-300 text-sm">
          Nhập email của bạn để nhận mã đặt lại mật khẩu
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            placeholder="Nhập email của bạn"
            disabled={isLoading}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang gửi...
            </div>
          ) : (
            'Gửi mã khôi phục'
          )}
        </motion.button>

        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      </form>
    </motion.div>
  );
}