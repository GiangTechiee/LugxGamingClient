'use client';

import { useRef } from 'react';
import { LoginForm } from "@/components/forms/LoginForm";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { RequestResetForm } from '@/components/forms/RequestResetPassword';
import { ResetPasswordForm } from '@/components/forms/ResetPassword';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface AuthUIProps {
  slug: string;
}

export default function AuthUI({ slug }: AuthUIProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNavigation = (path: string) => {
    router.push(`/auth/${path}`);
  };

  const renderAuthForm = () => {
    switch (slug) {
      case 'login':
        return <LoginForm />;
      
      case 'register':
        return <RegisterForm />;
      
      case 'reset-password':
        return (
          <RequestResetForm 
            onBack={() => handleNavigation('login')}
            onNavigateToReset={() => handleNavigation('confirm-reset-password')}
          />
        );
      
      case 'confirm-reset-password':
        return (
          <ResetPasswordForm 
            onBack={() => handleNavigation('reset-password')}
          />
        );
      
      default:
        // Default to login if slug is invalid
        return <LoginForm />;
    }
  };

  const getPageTitle = () => {
    switch (slug) {
      case 'login':
        return 'Đăng nhập';
      case 'register':
        return 'Đăng ký';
      case 'forgot-password':
        return 'Quên mật khẩu';
      case 'reset-password':
        return 'Đặt lại mật khẩu';
      default:
        return 'Xác thực';
    }
  };

  return (
    <motion.div
      className="relative w-screen h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/crystal.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Container */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-4 pt-20"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          {/* Dynamic Page Title for SEO/Accessibility */}
          <div className="sr-only">
            <h1>{getPageTitle()}</h1>
          </div>
          
          {/* Render appropriate form based on slug */}
          <motion.div
            key={slug} // Key prop để trigger re-animation khi slug thay đổi
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderAuthForm()}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}