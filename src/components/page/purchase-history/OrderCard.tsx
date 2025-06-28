'use client';

import { Order } from '@/types/order';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const formatCurrency = (amount: string) => {
    return parseInt(amount).toLocaleString('vi-VN') + ' VNĐ';
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'PENDING': 'Chờ xử lý',
      'PROCESSING': 'Đang xử lý',
      'SHIPPED': 'Đã gửi',
      'DELIVERED': 'Đã giao',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      'PENDING': 'text-yellow-400',
      'PROCESSING': 'text-blue-400',
      'SHIPPED': 'text-purple-400',
      'DELIVERED': 'text-green-400',
      'CANCELLED': 'text-red-400'
    };
    return colorMap[status as keyof typeof colorMap] || 'text-gray-400';
  };

  return (
    <div
      className="bg-white/10 backdrop-blur-md text-white p-4 rounded-xl cursor-pointer hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40"
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="border-b border-white/20 pb-2">
          <h3 className="text-lg font-semibold truncate">Đơn hàng #{order.order_id}</h3>
          <p className="text-sm text-gray-300">
            {new Date(order.created_at).toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Status */}
        <div>
          <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>

        {/* Price info */}
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {formatCurrency(order.total_amount)}
          </p>
          {order.discounted_amount && (
            <p className="text-xs text-green-400">
              Giảm: {formatCurrency(order.discounted_amount)}
            </p>
          )}
        </div>

        {/* Items count */}
        <div className="pt-2 border-t border-white/20">
          <p className="text-sm text-gray-300">
            {order.order_items.length} sản phẩm
          </p>
        </div>
      </div>
    </div>
  );
}