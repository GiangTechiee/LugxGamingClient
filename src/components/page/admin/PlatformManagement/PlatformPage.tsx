'use client';

import { useState, useEffect } from 'react';
import { platformService } from '@/services/platformService';
import { Platform } from '@/types/platform';
import PlatformCard from './PlatformCard';
import PlatformModal from './PlatformModal';
import toast, { Toaster } from 'react-hot-toast';
import { Plus } from 'lucide-react';

const PlatformPage = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      const response = await platformService.findAll();
      setPlatforms(response.data || []);
    } catch {
      toast.error('Không thể tải danh sách nền tảng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleSuccess = () => {
    fetchPlatforms();
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto sm:p-6">
        <Toaster position="top-right" />
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Quản lý nền tảng</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Thêm nền tảng
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.platform_id}
                platform={platform}
                onUpdate={fetchPlatforms}
                onDelete={fetchPlatforms}
              />
            ))}
          </div>
        )}

        <PlatformModal
          isOpen={isModalOpen}
          setIsOpen={setModalOpen}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default PlatformPage;