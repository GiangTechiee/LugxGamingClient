'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/order';
import OrderCard from './OrderCard';
import OrderModal from './OrderModal';

export default function PurchaseHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthAndFetchOrders = async () => {
      // Kiểm tra access token
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      try {
        const response = await orderService.getAllOrders();
        // Sắp xếp orders theo thời gian tạo mới nhất
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center pt-20">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center pt-20">
        <div className="text-white text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Yêu cầu đăng nhập</h2>
            <p className="text-gray-400">Vui lòng đăng nhập để xem lịch sử mua hàng của bạn.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto px-4 pt-20 pb-8 md:pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Lịch sử mua hàng</h1>
          <p className="text-gray-400">
            Tổng cộng {orders.length} đơn hàng
          </p>
        </div>

        {/* Orders Grid */}
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                onClick={() => setSelectedOrder(order)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">Chưa có đơn hàng nào</h2>
              <p className="text-gray-400">Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm ngay!</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}