import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, Trash2, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { wishlistService } from '@/services/wishlistService';
import { Wishlist } from '@/types/wishlist';
import { UserResponse } from '@/types/user';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

export default function WishlistModal({ isOpen, onClose, user }: WishlistModalProps) {
  const [wishlistItems, setWishlistItems] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchWishlistItems();
    }
  }, [isOpen, user]);

  const fetchWishlistItems = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await wishlistService.getWishlistByUser(user.user_id);
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (gameId: number) => {
    if (!user) return;

    try {
      await wishlistService.deleteWishlistByUserAndGame(user.user_id, gameId);
      setWishlistItems(prev => prev.filter(item => item.game_id !== gameId));
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Không thể xóa khỏi danh sách yêu thích');
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numPrice);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/20" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white flex items-center gap-2"
                  >
                    <Heart className="h-5 w-5 text-red-500" />
                    Danh sách yêu thích
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Danh sách yêu thích trống</p>
                    <p className="text-gray-500 text-sm mt-2">Hãy thêm những game yêu thích của bạn!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.wishlist_id}
                        className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        {/* Game Image */}
                        <Link href={`/games/${item.game_id}`} className="flex-shrink-0">
                          <div className="relative w-full sm:w-32 h-20 sm:h-18 rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
                            <Image
                              src={item.game?.game_images?.[0]?.image_url || '/placeholder-game.jpg'}
                              alt={item.game?.title || 'Game image'}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 128px"
                            />
                          </div>
                        </Link>

                        {/* Game Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <Link href={`/games/${item.game_id}`}>
                                <h3 
                                  className="text-white font-medium text-sm sm:text-base truncate hover:text-blue-400 transition-colors cursor-pointer"
                                  title={item.game?.title}
                                >
                                  {item.game?.title}
                                </h3>
                              </Link>
                              
                              {/* Price */}
                              <div className="flex items-center gap-2 mt-1">
                                {item.game?.discount_price ? (
                                  <>
                                    <span className="text-red-400 font-semibold text-sm sm:text-base">
                                      {formatPrice(item.game.discount_price)}
                                    </span>
                                    <span className="text-gray-400 line-through text-xs sm:text-sm">
                                      {formatPrice(item.game.price)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-green-400 font-semibold text-sm sm:text-base">
                                    {formatPrice(item.game?.price || 0)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveFromWishlist(item.game_id)}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 transition-colors flex-shrink-0 self-start sm:self-center"
                              title="Xóa khỏi danh sách yêu thích"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}