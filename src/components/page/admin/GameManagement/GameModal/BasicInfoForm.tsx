'use client';

import { CreateGameData } from '@/types/game';

interface BasicInfoFormProps {
  formData: CreateGameData;
  setFormData: (data: CreateGameData) => void;
}

export const BasicInfoForm = ({ formData, setFormData }: BasicInfoFormProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tên game *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Giá (nghìn đồng) *</label>
          <input
            type="number"
            value={formData.price === 0 ? '' : formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="0"
            step="0.1"
            placeholder="Nhập giá (nghìn đồng)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Giá giảm (nghìn đồng)</label>
          <input
            type="number"
            value={formData.discount_price === 0 || formData.discount_price === undefined ? '' : formData.discount_price}
            onChange={(e) =>
              setFormData({
                ...formData,
                discount_price: e.target.value === '' ? undefined : parseFloat(e.target.value),
              })
            }
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.1"
            placeholder="Nhập giá giảm (nghìn đồng)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nhà phát triển</label>
          <input
            type="text"
            value={formData.developer}
            onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nhà phát hành</label>
          <input
            type="text"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Ngày phát hành</label>
          <input
            type="date"
            value={formData.release_date}
            onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_hot"
            checked={formData.is_hot}
            onChange={(e) => setFormData({ ...formData, is_hot: e.target.checked })}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_hot" className="ml-2 text-sm text-gray-300">Game hot</label>
        </div>
      </div>
    </>
  );
};