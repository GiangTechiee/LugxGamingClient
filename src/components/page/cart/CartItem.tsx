'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onToggleSelect: () => void;
  onRemove: () => void;
  onNavigate?: () => void;
}

export default function CartItem({ 
  item, 
  isSelected, 
  onToggleSelect, 
  onRemove,
  onNavigate 
}: CartItemProps) {
  const { game } = item;
  const hasDiscount = game.discount_price && game.discount_price !== game.price;
  
  // Lấy thumbnail từ game_images hoặc fallback
  const thumbnail = game.game_images && game.game_images.length > 0 
    ? game.game_images[0].image_url 
    : game.thumbnail || '/images/placeholder-game.jpg';

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(price));
  };

  return (
    <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-3 hover:bg-gray-750 transition-colors">
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors z-10"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-3 items-center">
        {/* Checkbox */}
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
        </div>

        {/* Game content - Wrapped with Link */}
        <Link 
          href={`/games/${item.game_id}`}
          className="flex gap-3 flex-1 min-w-0 pr-6 hover:opacity-80 transition-opacity"
          onClick={onNavigate}
        >
          {/* Game thumbnail */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-18 rounded-md overflow-hidden bg-gray-700">
              <Image
                src={thumbnail}
                alt={game.title}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          </div>

          {/* Game info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white line-clamp-2 overflow-hidden text-ellipsis mb-1 hover:text-blue-400 transition-colors">
              {game.title}
            </h3>
            
            {/* Price */}
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-sm font-semibold text-red-400">
                    {formatPrice(game.discount_price!)}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(game.price)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-gray-200">
                  {formatPrice(game.price)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}