'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Game, GameDetail, CreateGameData, UpdateGameData } from '@/types/game';
import { gameService } from '@/services/gameService';
import { BasicInfoForm } from './BasicInfoForm';
import { GenresAndPlatformsForm } from './GenresAndPlatformsForm';
import { DescriptionForm } from './DescriptionForm';
import { ImagesForm } from './ImagesForm';
import { GENRES, PLATFORMS } from '../../../../../../constants/Admin/Game/constants';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onSave: () => Promise<void>;
}

const GameModal = ({ isOpen, onClose, game, onSave }: GameModalProps) => {
  const [formData, setFormData] = useState<CreateGameData>({
    title: '',
    price: 0,
    discount_price: undefined,
    developer: '',
    publisher: '',
    release_date: '',
    is_hot: false,
    description: '',
    genre_ids: [],
    platform_ids: [],
    image_urls: [],
  });
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [images, setImages] = useState<{ url: string; alt_text?: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameDetail = async () => {
      if (isOpen && game?.game_id) {
        setIsLoading(true);
        try {
          const response = await gameService.getGameById(game.game_id);
          const data: GameDetail = response.data;

          const updatedFormData: CreateGameData = {
            title: data.title || '',
            price: data.price ? parseFloat(data.price) / 1000 : 0,
            discount_price: data.discount_price ? parseFloat(data.discount_price) / 1000 : undefined,
            developer: data.developer || '',
            publisher: data.publisher || '',
            release_date: data.release_date
              ? new Date(data.release_date).toISOString().split('T')[0]
              : '',
            is_hot: data.is_hot ?? false,
            description: data.description || '',
            genre_ids: data.game_genres?.map((g) => g.genre_id) || [],
            platform_ids: data.game_platforms?.map((p) => p.platform_id) || [],
            image_urls: data.game_images?.map((img) => ({
              url: img.image_url,
              alt_text: img.alt_text || undefined,
            })) || [],
          };

          setFormData(updatedFormData);
          setSelectedGenres(data.game_genres?.map((g) => g.genre_id) || []);
          setSelectedPlatforms(data.game_platforms?.map((p) => p.platform_id) || []);
          setImages(
            data.game_images?.map((img) => ({
              url: img.image_url,
              alt_text: img.alt_text || undefined,
            })) || []
          );
        } catch (error) {
          console.error('Error fetching game detail:', error);
          toast.error('Lỗi khi tải thông tin game');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Reset state for creating new game
        setFormData({
          title: '',
          price: 0,
          discount_price: undefined,
          developer: '',
          publisher: '',
          release_date: '',
          is_hot: false,
          description: '',
          genre_ids: [],
          platform_ids: [],
          image_urls: [],
        });
        setSelectedGenres([]);
        setSelectedPlatforms([]);
        setImages([]);
      }
    };

    fetchGameDetail();
  }, [isOpen, game]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Payload cho tạo game mới (CreateGameData)
    const createPayload: CreateGameData = {
      title: formData.title,
      price: formData.price * 1000,
      discount_price: formData.discount_price ? formData.discount_price * 1000 : undefined,
      developer: formData.developer || '',
      publisher: formData.publisher || '',
      release_date: formData.release_date || '',
      is_hot: formData.is_hot,
      description: formData.description || '',
      genre_ids: selectedGenres,
      platform_ids: selectedPlatforms,
      image_urls: images,
    };

    // Payload cho cập nhật game (UpdateGameData)
    const updatePayload: UpdateGameData = {
      title: formData.title,
      price: formData.price * 1000,
      discount_price: formData.discount_price ? formData.discount_price * 1000 : null,
      developer: formData.developer || undefined,
      publisher: formData.publisher || undefined,
      release_date: formData.release_date || undefined,
      is_hot: formData.is_hot,
      description: formData.description || undefined,
      genre_ids: selectedGenres,
      platform_ids: selectedPlatforms,
      image_urls: images,
    };

    console.log('Payload sent to API:', game ? updatePayload : createPayload);

    const loadingToast = toast.loading(game ? 'Đang cập nhật game...' : 'Đang tạo game...');
    try {
      setIsSubmitting(true);
      if (game) {
        await gameService.updateGame(game.game_id, updatePayload);
        toast.success('Cập nhật game thành công');
      } else {
        await gameService.createGame(createPayload);
        toast.success('Tạo game thành công');
      }
      await onSave();
      onClose();
    } catch (error) {
      console.error('Error saving game:', error);
      toast.error(game ? 'Lỗi khi cập nhật game' : 'Lỗi khi tạo game');
    } finally {
      toast.dismiss(loadingToast);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl my-8 flex flex-col max-h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-center p-6 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">{game ? 'Sửa game' : 'Thêm game'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200" disabled={isLoading}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {isLoading ? (
            <div className="text-center text-gray-300">Đang tải thông tin game...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicInfoForm formData={formData} setFormData={setFormData} />
              <GenresAndPlatformsForm
                selectedGenres={selectedGenres}
                selectedPlatforms={selectedPlatforms}
                onGenreChange={setSelectedGenres}
                onPlatformChange={setSelectedPlatforms}
                genres={GENRES}
                platforms={PLATFORMS}
              />
              <DescriptionForm formData={formData} setFormData={setFormData} />
              <ImagesForm images={images} setImages={setImages} onImageClick={setEnlargedImage} />
            </form>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-700 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            disabled={isSubmitting || isLoading}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isSubmitting || isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>

      {enlargedImage && (
        <div
          className="fixed inset-0 z-[10000] bg-black bg-opacity-75 flex items-center justify-center"
          onClick={() => setEnlargedImage(null)}
        >
          <Image
            src={enlargedImage}
            alt="Enlarged game image"
            fill
            style={{ objectFit: 'contain' }}
            className="max-w-[90%] max-h-[90%]"
          />
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default GameModal;