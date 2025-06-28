'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Promotion } from '@/types/promotion';
import { promotionService } from '@/services/promotionService';
import PromotionModal from './PromotionModal';
import PromotionCard from './PromotionCard';
import { Plus } from 'lucide-react';

const PromotionPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách mã giảm giá
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await promotionService.getAllPromotions();
      setPromotions(response.data || []);
    } catch {
      toast.error('Không thể tải danh sách mã giảm giá!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Mở modal để thêm mới
  const handleAddPromotion = () => {
    setSelectedPromotion(undefined);
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa
  const handleEditPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  };

  // Xóa mã giảm giá
  const handleDeletePromotion = (id: number) => {
    setPromotions((prev) => prev.filter((promo) => promo.promotion_id !== id));
  };

  // Xử lý sau khi tạo/cập nhật thành công
  const handleSuccess = () => {
    fetchPromotions();
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto sm:p-6">
        <Toaster position="top-right" />
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Quản lý mã giảm giá</h1>
          <button
            onClick={handleAddPromotion}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Thêm mã giảm giá
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white">Đang tải...</div>
        ) : promotions.length === 0 ? (
          <div className="text-center text-gray-400">Chưa có mã giảm giá nào.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {promotions.map((promotion) => (
              <PromotionCard
                key={promotion.promotion_id}
                promotion={promotion}
                onEdit={handleEditPromotion}
                onDelete={handleDeletePromotion}
              />
            ))}
          </div>
        )}

        <PromotionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          promotion={selectedPromotion}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default PromotionPage;