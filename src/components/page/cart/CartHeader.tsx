'use client';

import { Trash2 } from 'lucide-react';

interface CartHeaderProps {
  totalItems: number;
  selectAll: boolean;
  onToggleSelectAll: () => void;
  onClearCart: () => void;
}

export default function CartHeader({ 
  totalItems, 
  selectAll, 
  onToggleSelectAll, 
  onClearCart 
}: CartHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-700 bg-gray-900">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-300">
          {totalItems} sản phẩm
        </span>
        <button
          onClick={onClearCart}
          className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          disabled={totalItems === 0}
        >
          <Trash2 className="w-4 h-4" />
          Xóa hết
        </button>
      </div>
      
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={onToggleSelectAll}
          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
          disabled={totalItems === 0}
        />
        <span className="text-sm font-medium text-gray-300">
          Chọn tất cả
        </span>
      </label>
    </div>
  );
}