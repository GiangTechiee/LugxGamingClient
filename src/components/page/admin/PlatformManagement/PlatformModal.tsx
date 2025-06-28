'use client';

import { useState, useEffect } from 'react';
import { CreatePlatform, UpdatePlatform } from '@/types/platform';
import { platformService } from '@/services/platformService';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface PlatformModalProps {
  platformId?: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

const PlatformModal = ({ platformId, isOpen, setIsOpen, onSuccess }: PlatformModalProps) => {
  const [formData, setFormData] = useState<CreatePlatform>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (platformId) {
      const fetchPlatform = async () => {
        try {
          const response = await platformService.findOne(platformId);
          setFormData({
            name: response.data.name,
            description: response.data.description || '',
          });
        } catch {
          toast.error('Không thể tải thông tin nền tảng.');
        }
      };
      fetchPlatform();
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [platformId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (platformId) {
        const updateData: UpdatePlatform = {
          name: formData.name || undefined,
          description: formData.description || undefined,
        };
        await platformService.update(platformId, updateData);
        toast.success('Cập nhật nền tảng thành công.');
      } else {
        if (!formData.name.trim()) {
          toast.error('Tên nền tảng không được để trống');
          return;
        }
        await platformService.create(formData);
        toast.success('Tạo nền tảng thành công.');
      }
      onSuccess();
      setIsOpen(false);
    } catch {
      toast.error(platformId ? 'Cập nhật nền tảng thất bại.' : 'Tạo nền tảng thất bại.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4 sm:px-0">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-11/12 sm:w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {platformId ? 'Sửa nền tảng' : 'Thêm nền tảng'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:bg-gray-700 rounded-full"
            aria-label="Đóng modal"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Tên nền tảng
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {platformId ? 'Cập nhật' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlatformModal;