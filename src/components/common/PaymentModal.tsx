'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  totalAmount: number;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  totalAmount 
}: PaymentModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { text: 'Thanh toán sẽ được thực hiện tự động', duration: 3000 },
    { text: 'Đang tiến hành thanh toán...', duration: 4000 },
    { text: 'Thanh toán thành công!', duration: 2000 }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      setIsProcessing(false);
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    const totalDuration = 9000; // 9 seconds
    const stepDurations = [3000, 7000, 9000]; // Cumulative times: 3s, 7s, 9s
    let currentTime = 0;

    const interval = setInterval(() => {
      currentTime += 100;
      const progressPercent = (currentTime / totalDuration) * 100;
      setProgress(Math.min(progressPercent, 100));

      // Update step based on cumulative time
      if (currentTime >= stepDurations[2] && currentStep !== 2) {
        setCurrentStep(2);
      } else if (currentTime >= stepDurations[1] && currentStep !== 1) {
        setCurrentStep(1);
      } else if (currentTime >= stepDurations[0] && currentStep === 0) {
        setCurrentStep(1);
      }

      if (currentTime >= totalDuration) {
        clearInterval(interval);
        setCurrentStep(2);
        setTimeout(() => {
          onPaymentSuccess();
        }, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, onPaymentSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Close button - only show in first step */}
        {currentStep === 0 && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {currentStep === 2 ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <CreditCard className="w-8 h-8 text-blue-500" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Thanh toán đơn hàng
          </h2>
          <p className="text-lg font-medium text-blue-600">
            {formatPrice(totalAmount)}
          </p>
        </div>

        {/* Status Text */}
        <div className="text-center mb-6">
          <p className={`text-lg ${
            currentStep === 2 ? 'text-green-600 font-semibold' : 'text-gray-700'
          }`}>
            {steps[currentStep].text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-100 ${
                currentStep === 2 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Loading animation for processing steps */}
        {currentStep < 2 && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Success message */}
        {currentStep === 2 && (
          <div className="text-center">
            <p className="text-green-600 font-medium">
              Đơn hàng của bạn đã được xử lý thành công!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}