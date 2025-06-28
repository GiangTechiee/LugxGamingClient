'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Order } from '@/types/order';

interface OrderModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderModal({ order, onClose }: OrderModalProps) {
  const totalPrice = parseFloat(order.total_amount);
  const discount = order.discounted_amount ? parseFloat(order.discounted_amount) : 0;
  const finalTotal = totalPrice - discount;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'PENDING': 'chờ xử lý',
      'PROCESSING': 'đang xử lý',
      'SHIPPED': 'đã gửi',
      'DELIVERED': 'đã giao',
      'CANCELLED': 'đã hủy'
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 pt-20">
      <div className="bg-white/10 backdrop-blur-md text-white p-6 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-white/20 scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Đơn hàng #{order.order_id}
            </h2>
            <div className="space-y-1">
              <p className="text-sm text-gray-300">
                Đặt ngày: {new Date(order.created_at).toLocaleDateString('vi-VN')} lúc{' '}
                {new Date(order.created_at).toLocaleTimeString('vi-VN')}
              </p>
              <p className="text-sm">
                Trạng thái:{' '}
                <span className={`font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </p>
              <p className="text-sm text-gray-300">
                Khách hàng: {order.user.username}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Products */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 border-b border-white/20 pb-2">
            Sản phẩm ({order.order_items.length})
          </h3>
          <div className="space-y-4">
            {order.order_items.map((item) => {
              const gameImage = item.game.game_images && item.game.game_images.length > 0 
                ? item.game.game_images[0].image_url 
                : item.game.thumbnail;
              
              return (
                <div key={item.order_item_id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  {/* Game Image */}
                  <div className="flex-shrink-0">
                    {gameImage ? (
                      <Link href={`/games/${item.game_id}`}>
                        <Image
                          src={gameImage}
                          alt={item.game.title}
                          width={120}
                          height={68}
                          className="object-cover rounded hover:opacity-80 transition-opacity cursor-pointer"
                          onError={(e) => {
                            e.currentTarget.src = '/fallback-image.jpg';
                          }}
                        />
                      </Link>
                    ) : (
                      <div className="w-[120px] h-[68px] bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs text-center">Không có ảnh</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Game Info */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/games/${item.game_id}`} 
                      className="hover:underline block"
                    >
                      <h4 className="font-medium text-white truncate mb-1">
                        {item.game.title}
                      </h4>
                    </Link>
                    
                    <div className="space-y-1">
                      {item.game.discount_price ? (
                        <>
                          <p className="text-sm text-gray-400 line-through">
                            Giá gốc: {formatCurrency(parseFloat(item.game.price))}
                          </p>
                          <p className="text-sm font-medium text-green-400">
                            Giá bán: {formatCurrency(parseFloat(item.game.discount_price))}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-medium">
                          Giá: {formatCurrency(parseFloat(item.game.price))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-white/20 pt-4">
          <h3 className="text-xl font-semibold mb-4">Chi tiết thanh toán</h3>
          
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tổng giá sản phẩm:</span>
              <span className="font-medium">{formatCurrency(totalPrice)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between items-center text-green-400">
                <span>Giảm giá:</span>
                <span className="font-medium">-{formatCurrency(discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Phương thức thanh toán:</span>
              <span>Chuyển khoản ngân hàng</span>
            </div>
            
            <div className="border-t border-white/20 pt-3 flex justify-between items-center text-lg">
              <span className="font-bold">Tổng cộng:</span>
              <span className="font-bold text-green-400">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Ghi chú:</h4>
              <p className="text-sm text-gray-400 bg-white/5 rounded-lg p-3">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6 pt-4 border-t border-white/20">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}