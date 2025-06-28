'use client';

import { createPortal } from 'react-dom';
import { Payment, OrderItem } from '@/types/payment';
import { X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Chưa có';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const PaymentModal = ({ isOpen, onClose, payment }: PaymentModalProps) => {
  if (!isOpen || !payment) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4 sm:px-0">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-11/12 sm:w-full max-w-md mx-auto flex flex-col max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4 text-white">Chi tiết thanh toán</h2>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
          <div>
            <span className="text-sm text-gray-400">ID Thanh toán:</span>
            <span className="text-white font-medium"> #{payment.payment_id}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400">ID Người dùng:</span>
            <span className="text-white font-medium"> {payment.order?.user_id || 'N/A'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400">ID Đơn hàng:</span>
            <span className="text-white font-medium"> {payment.order_id}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400">ID Giao dịch:</span>
            <span className="text-white font-medium"> {payment.transaction_id || 'Chưa có'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Số tiền:</span>
            <span className="text-white font-medium"> {parseFloat(payment.amount).toLocaleString()} VNĐ</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Trạng thái:</span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              payment.status === 'COMPLETED' ? 'bg-green-600' :
              payment.status === 'PENDING' ? 'bg-yellow-600' :
              payment.status === 'FAILED' ? 'bg-red-600' : 'bg-gray-600'
            }`}>
              {payment.status}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Ngày thanh toán: </span>
            <span className="text-white font-medium">{formatDate(payment.payment_date)}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Lý do thất bại:</span>
            <span className="text-white font-medium"> {payment.failure_reason || 'Không có'}</span>
          </div>
          <hr className="border-gray-600 my-3" />
          <div>
            <span className="text-sm text-gray-400">Số tiền sau giảm giá:</span>
            <span className="text-white font-medium">
              {payment.order?.discounted_amount
                ? parseFloat(payment.order.discounted_amount).toLocaleString() + ' VNĐ'
                : 'Không có'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Trạng thái đơn hàng:</span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              payment.order?.status === 'DELIVERED' ? 'bg-green-600' :
              payment.order?.status === 'PENDING' ? 'bg-yellow-600' :
              payment.order?.status === 'CANCELLED' ? 'bg-red-600' : 'bg-blue-600'
            }`}>
              {payment.order?.status || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Ghi chú:</span>
            <span className="text-white font-medium"> {payment.order?.notes || 'Không có'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Ngày tạo: </span>
            <span className="text-white font-medium">{formatDate(payment.order?.created_at)}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Ngày cập nhật: </span>
            <span className="text-white font-medium">{formatDate(payment.order?.updated_at)}</span>
          </div>
          {payment.order?.order_items?.map((item: OrderItem, index: number) => (
            <div key={index} className="border-t border-gray-600 pt-2 mt-2">
              <div>
                <span className="text-sm text-gray-400">ID Game:</span>
                <span className="text-white font-medium"> {item.game_id}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Giá:</span>
                <span className="text-white font-medium">
                  {' '}
                  {parseFloat(item.game.price).toLocaleString()} VNĐ
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Giá giảm:</span>
                <span className="text-white font-medium">
                  {' '}
                  {item.game.discount_price
                    ? parseFloat(item.game.discount_price).toLocaleString() + ' VNĐ'
                    : 'Không có'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center"
            title="Đóng"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PaymentModal;