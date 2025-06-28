'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CreatePromotionDto, UpdatePromotionDto, Promotion, DiscountType } from '@/types/promotion';
import { toast } from 'react-hot-toast';
import { promotionService } from '@/services/promotionService';
import { X } from 'lucide-react';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion?: Promotion;
  onSuccess: () => void;
}

const PromotionModal = ({ isOpen, onClose, promotion, onSuccess }: PromotionModalProps) => {
  // State để quản lý dữ liệu form
  const [formData, setFormData] = useState<CreatePromotionDto>({
    code: '',
    description: '',
    discount_type: DiscountType.PERCENTAGE,
    discount_value: 0,
    minimum_order: 0,
    start_date: '',
    end_date: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Đảm bảo component đã mount (cho SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Khởi tạo dữ liệu form khi chỉnh sửa
  useEffect(() => {
    if (promotion) {
      setFormData({
        code: promotion.code,
        description: promotion.description || '',
        discount_type: promotion.discount_type,
        discount_value: promotion.discount_value,
        minimum_order: promotion.minimum_order || 0,
        start_date: promotion.start_date || '',
        end_date: promotion.end_date || '',
        is_active: promotion.is_active || false,
      });
    } else {
      setFormData({
        code: '',
        description: '',
        discount_type: DiscountType.PERCENTAGE,
        discount_value: 0,
        minimum_order: 0,
        start_date: '',
        end_date: '',
        is_active: true,
      });
    }
  }, [promotion, isOpen]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (promotion) {
        // Cập nhật mã giảm giá
        await promotionService.updatePromotion(promotion.promotion_id!, formData as UpdatePromotionDto);
        toast.success('Cập nhật mã giảm giá thành công!');
      } else {
        // Tạo mới mã giảm giá
        if (!formData.code.trim()) {
          toast.error('Mã giảm giá không được để trống');
          return;
        }
        await promotionService.createPromotion(formData);
        toast.success('Tạo mã giảm giá thành công!');
      }
      onSuccess();
      onClose();
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md my-8 flex flex-col max-h-[calc(100vh-4rem)]">
        {/* Phần đầu (Header) */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">
            {promotion ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
            aria-label="Đóng modal"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Phần giữa (Nội dung, có thể cuộn) */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Mã giảm giá</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Loại giảm giá</label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              >
                <option value={DiscountType.PERCENTAGE}>Phần trăm</option>
                <option value={DiscountType.FIXED}>Số tiền cố định</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Giá trị giảm</label>
              <input
                type="number"
                name="discount_value"
                value={formData.discount_value}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Đơn hàng tối thiểu</label>
              <input
                type="number"
                name="minimum_order"
                value={formData.minimum_order}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Ngày kết thúc</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              />
            </div>

            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                />
                <span className="ml-2 text-white">Kích hoạt</span>
              </label>
            </div>
          </form>
        </div>

        {/* Phần cuối (Footer) */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-lg transition-colors ${
              loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : promotion ? 'Cập nhật' : 'Tạo'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PromotionModal;