'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

interface ImagePreview {
  url: string;
  alt_text?: string;
}

interface ImagesFormProps {
  images: ImagePreview[];
  setImages: (images: ImagePreview[]) => void;
  onImageClick: (url: string) => void;
}

export const ImagesForm = ({ images, setImages, onImageClick }: ImagesFormProps) => {
  const [newImage, setNewImage] = useState<ImagePreview>({ url: '', alt_text: '' });

  const handleAddImage = () => {
    if (newImage.url) {
      setImages([...images, { url: newImage.url, alt_text: newImage.alt_text || undefined }]);
      setNewImage({ url: '', alt_text: '' });
    }
  };

  const handleImageChange = (field: 'url' | 'alt_text', value: string) => {
    setNewImage({ ...newImage, [field]: value });
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">Hình ảnh</label>
      <div className="space-y-4">
        {/* Trường nhập URL và alt_text */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newImage.url}
              onChange={(e) => handleImageChange('url', e.target.value)}
              placeholder="URL hình ảnh"
              className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="text"
              value={newImage.alt_text || ''}
              onChange={(e) => handleImageChange('alt_text', e.target.value)}
              placeholder="Văn bản thay thế"
              className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAddImage}
            disabled={!newImage.url}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !newImage.url ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            Thêm
          </button>
        </div>

        {/* Danh sách ảnh hiện có */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative bg-gray-700 rounded-lg p-4 shadow-md flex flex-col gap-2"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={image.url || '/placeholder-image.jpg'}
                    alt={image.alt_text || 'Game image'}
                    width={160}
                    height={90}
                    className="object-cover rounded cursor-pointer w-full"
                    style={{ aspectRatio: '16/9' }}
                    onClick={() => image.url && onImageClick(image.url)}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 line-clamp-2">{image.url}</p>
                  <hr className="border-gray-500 my-1" />
                  <p className="text-sm text-white">{image.alt_text || 'Không có văn bản thay thế'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-400 text-white rounded-full p-2 transition-colors"
                  aria-label="Xóa hình ảnh"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};