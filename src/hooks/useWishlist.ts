import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { wishlistService } from '@/services/wishlistService';
import { CreateWishlistData, Wishlist } from '@/types/wishlist';

export const useWishlist = (game_id: number) => {
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(true);

  // Kiểm tra trạng thái game trong wishlist khi component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsCheckingWishlist(false);
        return;
      }

      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          setIsCheckingWishlist(false);
          return;
        }

        const user = JSON.parse(userData);
        const user_id = user.user_id;
        if (!user_id) {
          setIsCheckingWishlist(false);
          return;
        }

        const response = await wishlistService.getWishlistByUser(user_id);
        const wishlists = response.data;
        const isGameInWishlist = wishlists.some((wishlist: Wishlist) => wishlist.game_id === game_id);
        setIsInWishlist(isGameInWishlist);
      } catch {
        console.error('Lỗi khi kiểm tra wishlist');
      } finally {
        setIsCheckingWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [game_id]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để quản lý wishlist', {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    if (isAddingToWishlist) return;

    const userData = localStorage.getItem('user');
    if (!userData) {
      toast.error('Không tìm thấy thông tin user', {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    const user = JSON.parse(userData);
    const user_id = user.user_id;
    if (!user_id) {
      toast.error('Không tìm thấy user_id trong thông tin user', {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    const loadingToast = toast.loading(isInWishlist ? 'Đang xóa khỏi wishlist...' : 'Đang thêm vào wishlist...', {
      position: 'bottom-center',
    });

    try {
      setIsAddingToWishlist(true);

      if (isInWishlist) {
        // Xóa khỏi wishlist
        await wishlistService.deleteWishlistByUserAndGame(user_id, game_id);
        setIsInWishlist(false);
        toast.dismiss(loadingToast);
        toast.success('Đã xóa khỏi wishlist!', {
          duration: 3000,
          position: 'bottom-center',
        });
      } else {
        // Thêm vào wishlist
        const wishlistData: CreateWishlistData = { user_id, game_id };
        await wishlistService.createWishlist(wishlistData);
        setIsInWishlist(true);
        toast.dismiss(loadingToast);
        toast.success('Đã thêm vào wishlist!', {
          duration: 3000,
          position: 'bottom-center',
        });
      }

      window.dispatchEvent(new CustomEvent('wishlist-updated'));
    } catch {
      toast.dismiss(loadingToast);
      const errorMessage = 'Có lỗi xảy ra khi quản lý wishlist';
      toast.error(errorMessage, {
        duration: 3000,
        position: 'bottom-center',
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return { toggleWishlist, isAddingToWishlist, isInWishlist, isCheckingWishlist };
};