'use client';

import { useState, useEffect } from 'react';
import { Genre, CreateGenreData, UpdateGenreData } from '@/types/genre';
import { genreService } from '@/services/genreService';
import { toast } from 'react-hot-toast';

interface GenreModalProps {
  isOpen: boolean;
  onClose: () => void;
  genre: Genre | null;
  onSave: () => void;
}

export default function GenreModal({ isOpen, onClose, genre, onSave }: GenreModalProps) {
  // Tách biệt state cho create và update
  const [createFormData, setCreateFormData] = useState<CreateGenreData>({
    name: '',
    description: '',
  });
  const [updateFormData, setUpdateFormData] = useState<UpdateGenreData>({
    name: '',
    description: '',
  });

  // Đồng bộ dữ liệu khi genre thay đổi
  useEffect(() => {
    if (genre) {
      setUpdateFormData({
        name: genre.name,
        description: genre.description || '',
      });
    } else {
      setCreateFormData({
        name: '',
        description: '',
      });
    }
  }, [genre]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isUpdate: boolean
  ) => {
    const { name, value } = e.target;
    if (isUpdate) {
      setUpdateFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setCreateFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (genre) {
        // Cập nhật thể loại
        await genreService.updateGenre(genre.genre_id, updateFormData);
        toast.success('Cập nhật thể loại thành công');
      } else {
        // Tạo thể loại mới
        if (!createFormData.name.trim()) {
          toast.error('Tên thể loại không được để trống');
          return;
        }
        await genreService.createGenre(createFormData);
        toast.success('Tạo thể loại thành công');
      }
      onSave();
    } catch {
      toast.error('Lỗi khi lưu thể loại');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4 sm:px-0">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-11/12 sm:w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-white">
          {genre ? 'Sửa thể loại' : 'Thêm thể loại'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Tên thể loại
            </label>
            <input
              id="name"
              name="name"
              value={genre ? updateFormData.name : createFormData.name}
              onChange={(e) => handleChange(e, !!genre)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={genre ? updateFormData.description : createFormData.description}
              onChange={(e) => handleChange(e, !!genre)}
              className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}