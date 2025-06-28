'use client';

import Image from 'next/image';
import { CheckoutItem } from '@/store/useCheckoutStore';

interface OrderGameCardProps {
  item: CheckoutItem;
}

export default function OrderGameCard({ item }: OrderGameCardProps) {
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

  // Chọn giá để hiển thị: ưu tiên discount_price nếu có
  const displayPrice = hasDiscount ? game.discount_price! : game.price;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Game thumbnail - 16:9 aspect ratio */}
      <div className="flex-shrink-0">
        <div className="relative w-24 h-[54px] sm:w-32 sm:h-[72px] rounded-md overflow-hidden bg-gray-100">
          <Image
            src={thumbnail}
            alt={game.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 96px, 128px"
          />
        </div>
      </div>

      {/* Game info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-2">
          {game.title}
        </h3>
        
        {/* Price - chỉ hiển thị một giá */}
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(displayPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}