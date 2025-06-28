'use client';

import { CreateGameData } from '@/types/game';

interface DescriptionFormProps {
  formData: CreateGameData;
  setFormData: (data: CreateGameData) => void;
}

export const DescriptionForm = ({ formData, setFormData }: DescriptionFormProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
      <textarea
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={6}
        className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical scrollbar-hide"
        placeholder="Mô tả chi tiết về game..."
      />
    </div>
  );
};