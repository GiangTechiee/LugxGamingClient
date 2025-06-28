'use client';

import { Platform } from '@/types/platform';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { platformService } from '@/services/platformService';
import PlatformModal from './PlatformModal';
import toast from 'react-hot-toast';

interface PlatformCardProps {
  platform: Platform;
  onUpdate: () => void;
  onDelete: () => void;
}

const PlatformCard = ({ platform, onUpdate, onDelete }: PlatformCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm('Bạn có chắc muốn xóa nền tảng này?')) {
      try {
        await platformService.delete(platform.platform_id);
        onDelete();
        toast.success('Đã xóa nền tảng thành công.');
      } catch {
        toast.error('Xóa nền tảng thất bại.');
      }
    }
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">ID:</span>
          <span className="text-white font-medium">#{platform.platform_id}</span>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{platform.name}</h3>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Mô tả:</span>
          <span className={`text-sm font-medium ${
            platform.description ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {platform.description ? 'Có' : 'Không có'}
          </span>
        </div>
        
        {platform.game_platforms && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Số game:</span>
            <span className="text-white font-medium">{platform.game_platforms.length}</span>
          </div>
        )}
      </div>
      
      <hr className="border-gray-600 my-4" />
      
      <div className="flex justify-center space-x-3">
        <button
          onClick={() => setModalOpen(true)}
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
      
      <PlatformModal
        platformId={platform.platform_id}
        isOpen={isModalOpen}
        setIsOpen={setModalOpen}
        onSuccess={onUpdate}
      />
    </div>
  );
};

export default PlatformCard;