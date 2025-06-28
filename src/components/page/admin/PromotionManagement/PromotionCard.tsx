"use client";

import { Promotion } from "@/types/promotion";
import { toast } from "react-hot-toast";
import { promotionService } from "@/services/promotionService";
import { Pencil, Trash2 } from "lucide-react";
import { FaRegCalendarAlt } from "react-icons/fa";

interface PromotionCardProps {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: number) => void;
}

const PromotionCard = ({ promotion, onEdit, onDelete }: PromotionCardProps) => {
  // Xử lý xóa mã giảm giá
  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
      try {
        await promotionService.deletePromotion(promotion.promotion_id!);
        toast.success("Xóa mã giảm giá thành công!");
        onDelete(promotion.promotion_id!);
      } catch {
        toast.error("Xóa mã giảm giá thất bại!");
      }
    }
  };

  // Format ngày tháng
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Chưa thiết lập";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Format giá trị tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <div className="flex-1 space-y-3">
        {/* Thời gian bắt đầu và kết thúc */}
        <div className="flex items-center space-x-2 text-sm text-white">
          <FaRegCalendarAlt className="text-gray-400" />
          <span className="text-gray-400">
            {formatDate(promotion.start_date)} -{" "}
            {formatDate(promotion.end_date)}
          </span>
        </div>

        {/* Mã giảm giá */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {promotion.code}
          </h3>
        </div>

        {/* Mô tả */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Mô tả:</span>
          <span
            className={`text-sm font-medium ${
              promotion.description ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {promotion.description ? "Có" : "Không có"}
          </span>
        </div>

        {/* Loại giảm giá */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Loại:</span>
          <span className="text-white font-medium text-sm">
            {promotion.discount_type === "PERCENTAGE" ? "Phần trăm" : "Cố định"}
          </span>
        </div>

        {/* Giá trị giảm */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Giá trị:</span>
          <span className="text-white font-medium text-sm">
            {promotion.discount_type === "PERCENTAGE"
              ? `${promotion.discount_value}%`
              : formatCurrency(promotion.discount_value)}
          </span>
        </div>

        {/* Đơn hàng tối thiểu */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Tối thiểu:</span>
          <span className="text-white font-medium text-sm">
            {promotion.minimum_order
              ? formatCurrency(promotion.minimum_order)
              : "Không yêu cầu"}
          </span>
        </div>

        {/* Trạng thái */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Trạng thái:</span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                promotion.is_active ? "bg-green-400" : "bg-red-400"
              }`}
            ></div>
            <span className="text-white font-medium text-sm">
              {promotion.is_active ? "Kích hoạt" : "Không kích hoạt"}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-gray-600 my-4" />

      <div className="flex justify-center space-x-3">
        <button
          onClick={() => onEdit(promotion)}
          className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
          title="Sửa"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="w-10 h-10 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
          title="Xóa"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default PromotionCard;
