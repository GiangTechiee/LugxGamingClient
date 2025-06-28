'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useProfileModal } from '@/hooks/useProfileModal';
import { UserResponse } from '@/types/user';
import { userService } from '@/services/userService';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import { CreateOrderDto } from '@/types/order';
import { CreatePaymentDto, PaymentMethod, PaymentStatus } from '@/types/payment';
import UserInfoSection from './UserInfoSection';
import OrderSummary from './OrderSummary';
import ProfileModal from '@/components/forms/ProfileModal';
import toast from 'react-hot-toast';

export default function OrderPage() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [promotionCode, setPromotionCode] = useState<string | null>(null);
  const router = useRouter();
  
  const { checkoutItems, clearCheckoutData } = useCheckoutStore();
  const { isOpen: isModalOpen, openModal, closeModal } = useProfileModal();

  const handleVoucherApplied = (voucher: string | null) => {
    setPromotionCode(voucher);
  };

  // Kiểm tra authentication và checkout data
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        toast.error('Vui lòng đăng nhập để tiếp tục');
        router.push('/auth/login');
        return;
      }

      try {
        const parsedUser: UserResponse = JSON.parse(userData);
        // Lấy thông tin user mới nhất từ API
        const response = await userService.findOne(parsedUser.user_id);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Không thể tải thông tin người dùng');
        // Fallback to stored user data
        try {
          const parsedUser: UserResponse = JSON.parse(userData);
          setUser(parsedUser);
        } catch {
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, checkoutItems.length]);

  const handleEditProfile = async () => {
    if (!user || isPaymentCompleted) return;

    try {
      const response = await userService.findOne(user.user_id);
      setUser(response.data);
      // Cập nhật localStorage với thông tin mới
      localStorage.setItem('user', JSON.stringify(response.data));
      openModal();
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Không thể tải thông tin người dùng.');
    }
  };

  const handleCheckout = async (totalAmount: number) => {
    if (!user) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    try {
      // Prepare order data
      const selected_game_ids = checkoutItems.map(item => item.game_id);
      
      const orderData: CreateOrderDto = {
        selected_game_ids,
        notes: `Đơn hàng từ ${user.username} - ${checkoutItems.length} sản phẩm`,
        promotion_code: promotionCode || undefined,
      };

      console.log('Creating order with data:', orderData);
      
      // Call create order API
      const orderResponse = await orderService.createOrder(orderData);
      
      if (orderResponse.data) {
        console.log('Order created successfully:', orderResponse.data);
        
        // Tạo payment sau khi tạo order thành công
        const paymentData: CreatePaymentDto = {
          order_id: orderResponse.data.order_id,
          payment_method: PaymentMethod.BANK_TRANSFER,
          amount: totalAmount.toString(),
          status: PaymentStatus.COMPLETED,
          payment_date: new Date().toISOString(),
          transaction_id: `TXN_${Date.now()}_${orderResponse.data.order_id}`
        };

        console.log('Creating payment with data:', paymentData);
        
        // Call create payment API
        const paymentResponse = await paymentService.createPayment(paymentData);
        
        if (paymentResponse.data) {
          console.log('Payment created successfully:', paymentResponse.data);
          //toast.success('Đặt hàng và thanh toán thành công!');
          setIsPaymentCompleted(true);
        
          clearCheckoutData();
          window.dispatchEvent(new CustomEvent('cart-updated'));
          router.push('/');
        } else {
          throw new Error('Không thể tạo thanh toán');
        }
      } else {
        throw new Error('Không thể tạo đơn hàng');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user || checkoutItems.length === 0) {
    return null; // Component will redirect in useEffect
  }

  return (
    <>
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {isPaymentCompleted ? 'Đặt hàng thành công' : 'Đặt hàng'}
            </h1>
            <p className="text-indigo-400 mt-2">
              {isPaymentCompleted 
                ? 'Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.'
                : 'Xem lại thông tin và hoàn tất đơn hàng của bạn'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Info Section - Left Column on Desktop */}
            <div className="lg:col-span-1">
              <UserInfoSection 
                user={user} 
                onEditProfile={handleEditProfile}
                hideEditButton={isPaymentCompleted}
              />
            </div>

            {/* Order Summary - Right Column on Desktop */}
            <div className="lg:col-span-2">
              <OrderSummary 
                items={checkoutItems}
                onCheckout={handleCheckout}
                onVoucherApplied={handleVoucherApplied}
                isPaymentCompleted={isPaymentCompleted}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal - Only show if payment not completed */}
      {!isPaymentCompleted && (
        <ProfileModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          user={user}
        />
      )}
    </>
  );
}