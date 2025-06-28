'use client';

import { useState, useEffect } from 'react';
import { paymentService } from '@/services/paymentService';
import { Payment } from '@/types/payment';
import PaymentCard from './PaymentCard';
import PaymentModal from './PaymentModal';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const PaymentPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await paymentService.getAllPayments();
      setPayments(response.data || []);
    } catch {
      toast.error('Lỗi khi tải danh sách thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-black">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Quản lý thanh toán</h1>
      </div>

      {isLoading ? (
        <div className="text-center text-white">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {payments.map((payment) => (
            <PaymentCard
              key={payment.payment_id}
              payment={payment}
              onView={handleView}
            />
          ))}
        </div>
      )}

      <PaymentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentPage;