"use client";

import { Star, Flame, ShoppingCart, CreditCard, CheckIcon } from "lucide-react";
import { GameDetail } from "@/types/game";
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface GameInfoProps {
  game: GameDetail;
}

const GameInfo = ({ game }: GameInfoProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Tính toán rating trung bình
  const averageRating =
    game.reviews && game.reviews.length > 0
      ? game.reviews.reduce((sum, review) => sum + review.rating, 0) /
        game.reviews.length
      : 0;

  // Format giá tiền
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseInt(price));
  };

  // Logic thêm vào giỏ hàng (giống GameCard)
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    if (isAdding || justAdded) return;

    const loadingToast = toast.loading('Đang thêm vào giỏ hàng...', {
      position: 'bottom-center',
    });

    try {
      setIsAdding(true);
      await addToCart(game.game_id);
      
      toast.dismiss(loadingToast);
      toast.success(`Đã thêm "${game.title}" vào giỏ hàng!`, {
        duration: 3000,
        position: 'bottom-center',
        icon: '🛒',
      });
      
      setJustAdded(true);
      window.dispatchEvent(new CustomEvent('cart-updated'));
      
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
      
    } catch (error: any) {
      toast.dismiss(loadingToast);
      
      // Xử lý lỗi từ backend
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng';
      
      toast.error(errorMessage, {
        duration: 3000,
        position: 'bottom-center',
        icon: '❌',
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="w-5 h-5 text-gray-600 absolute" />
            <div className="overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-600" />);
      }
    }
    return stars;
  };

  // Trạng thái nút thêm vào giỏ
  const getAddToCartButtonState = () => {
    if (isAdding) {
      return {
        className: 'w-full bg-gray-600 cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2',
        text: 'Đang thêm...',
        icon: <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      };
    }
    
    if (justAdded) {
      return {
        className: 'w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2',
        text: 'Đã thêm vào giỏ hàng',
        icon: <CheckIcon className="w-5 h-5" />
      };
    }
    
    return {
      className: 'w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2',
      text: 'Thêm vào giỏ',
      icon: <ShoppingCart className="w-5 h-5" />
    };
  };

  const addToCartButtonState = getAddToCartButtonState();

  return (
    <div className="space-y-6">
      {/* Game Title */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">{game.title}</h1>

        {/* Rating */}
        {averageRating > 0 && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              {renderStars(averageRating)}
            </div>
            <span className="text-gray-400 text-sm">
              ({averageRating.toFixed(1)}) • {game.reviews?.length || 0} đánh
              giá
            </span>
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="space-y-2">
        {game.discount_price ? (
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 line-through text-lg">
              {formatPrice(game.price)}
            </span>
            <span className="text-green-400 text-2xl font-bold">
              {formatPrice(game.discount_price)}
            </span>
          </div>
        ) : (
          <span className="text-white text-2xl font-bold">
            {formatPrice(game.price)}
          </span>
        )}

        {/* Hot Game Badge */}
        {game.is_hot && (
          <div className="flex items-center space-x-2 text-orange-400">
            <Flame className="w-5 h-5" />
            <span className="font-semibold">Game Hot</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Mua ngay</span>
        </button>

        <button
          onClick={handleAddToCart}
          disabled={isAdding || justAdded}
          className={addToCartButtonState.className}
        >
          {addToCartButtonState.icon}
          <span>{addToCartButtonState.text}</span>
        </button>
      </div>
    </div>
  );
};

export default GameInfo;