import { Payment } from '@/types/payment';
import { Eye } from 'lucide-react';

interface PaymentCardProps {
  payment: Payment;
  onView: (payment: Payment) => void;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Chưa có';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const PaymentCard = ({ payment, onView }: PaymentCardProps) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col h-full text-white">
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">ID Thanh toán:</span>
          <span className="text-white font-medium">#{payment.payment_id}</span>
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
      </div>
      <hr className="border-gray-600 my-4" />
      <div className="flex justify-center">
        <button
          onClick={() => onView(payment)}
          className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
          title="Xem"
        >
          <Eye size={16} />
        </button>
      </div>
    </div>
  );
};

export default PaymentCard;