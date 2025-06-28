'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckoutItem } from '@/store/useCheckoutStore';
import { promotionService } from '@/services/promotionService';
import OrderGameCard from './OrderGameCard';
import PaymentModal from '@/components/common/PaymentModal';

interface OrderSummaryProps {
  items: CheckoutItem[];
  onCheckout: (totalAmount: number) => void;
  onVoucherApplied: (voucher: string | null) => void;
  isPaymentCompleted?: boolean;
}

export default function OrderSummary({ items, onCheckout, onVoucherApplied, isPaymentCompleted = false }: OrderSummaryProps) {
  const [voucher, setVoucher] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Tính tổng tiền hàng
  const subtotal = items.reduce((total, item) => {
    const price = item.game.discount_price 
      ? parseFloat(item.game.discount_price) 
      : parseFloat(item.game.price);
    return total + price;
  }, 0);

  // Tổng tiền cần thanh toán
  const totalAmount = subtotal - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleApplyVoucher = async () => {
    if (!voucher.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    setIsApplyingVoucher(true);
    
    try {
      // Gọi API kiểm tra mã giảm giá
      const response = await promotionService.checkPromotionCode(voucher);
      
      // Kiểm tra xem mã giảm giá có tồn tại và hợp lệ không
      if (!response.data || !response.data.promotion) {
        toast.error('Mã giảm giá không tồn tại');
        setDiscount(0);
        setAppliedVoucher(null);
        onVoucherApplied(null);
        return;
      }

      if (response.data.status === 'ACTIVE') {
        const { promotion } = response.data;
        
        // Tính toán số tiền giảm giá
        let discountAmount = 0;
        if (promotion.discount_type === 'PERCENTAGE') {
          discountAmount = subtotal * (promotion.discount_value / 100);
        } else if (promotion.discount_type === 'FIXED_AMOUNT') {
          discountAmount = promotion.discount_value;
        }

        // Kiểm tra điều kiện đơn hàng tối thiểu
        if (promotion.minimum_order && subtotal < promotion.minimum_order) {
          toast.error(`Đơn hàng cần tối thiểu ${formatPrice(promotion.minimum_order)} để áp dụng mã này`);
          setDiscount(0);
          setAppliedVoucher(null);
          onVoucherApplied(null);
        } else {
          setDiscount(discountAmount);
          setAppliedVoucher(voucher);
          onVoucherApplied(voucher);
          toast.success('Áp dụng mã giảm giá thành công!');
        }
      } else {
        toast.error(response.data.message || 'Mã giảm giá không hợp lệ');
        setDiscount(0);
        setAppliedVoucher(null);
        onVoucherApplied(null);
      }
    } catch (error) {
      console.error('Error applying voucher:', error);
      toast.error('Mã giảm giá không tồn tại hoặc có lỗi xảy ra');
      setDiscount(0);
      setAppliedVoucher(null);
      onVoucherApplied(null);
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucher('');
    setAppliedVoucher(null);
    setDiscount(0);
    onVoucherApplied(null);
    toast.success('Đã xóa mã giảm giá');
  };

  const handleCheckoutClick = () => {
    if (isPaymentCompleted) return;
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    // Truyền totalAmount vào hàm onCheckout
    onCheckout(totalAmount);
    toast.success('Thanh toán thành công!');
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  return (
    <>
      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-6">Đơn hàng của bạn</h2>

        {/* Game cards */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <OrderGameCard key={item.cart_item_id} item={item} />
          ))}
        </div>

        {/* Voucher section - Hide if payment completed */}
        {!isPaymentCompleted && (
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={appliedVoucher !== null}
              />
              {appliedVoucher ? (
                <button
                  onClick={handleRemoveVoucher}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              ) : (
                <button
                  onClick={handleApplyVoucher}
                  disabled={!voucher.trim() || isApplyingVoucher}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isApplyingVoucher ? 'Đang áp dụng...' : 'Áp dụng'}
                </button>
              )}
            </div>

            {appliedVoucher && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                ✓ Đã áp dụng mã &quot;{appliedVoucher}&quot;
              </div>
            )}
          </div>
        )}

        {/* Price breakdown */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between text-white">
            <span>Tổng tiền hàng ({items.length} sản phẩm):</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Voucher giảm giá:</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-semibold text-white">
              <span>Số tiền cần thanh toán:</span>
              <span className="text-white">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Checkout button */}
        <button
          onClick={handleCheckoutClick}
          disabled={isPaymentCompleted}
          className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors ${
            isPaymentCompleted
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isPaymentCompleted ? '✓ Đã thanh toán' : 'Thanh toán'}
        </button>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
        totalAmount={totalAmount}
      />
    </>
  );
}