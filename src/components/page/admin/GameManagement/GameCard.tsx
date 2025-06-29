'use client';

import { Game } from '@/types/game';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { SiPlaystation, SiApple, SiAndroid } from 'react-icons/si';
import { AiFillAppstore } from 'react-icons/ai';
import { FaXbox } from 'react-icons/fa';
import { BsNintendoSwitch } from 'react-icons/bs';

interface GameCardProps {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (gameId: number) => void;
}

const GameCard = ({ game, onEdit, onDelete }: GameCardProps) => {
  const getPlatformIcon = (platform: unknown) => {
    if (typeof platform !== 'string' || !platform) {
      return <AiFillAppstore className="w-4 h-4" />;
    }

    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('pc') || lowerPlatform.includes('windows')) {
      return <AiFillAppstore className="w-4 h-4" />;
    }
    if (lowerPlatform.includes('playstation') || lowerPlatform.includes('ps')) {
      return <SiPlaystation className="w-4 h-4" />;
    }
    if (lowerPlatform.includes('xbox')) {
      return <FaXbox className="w-4 h-4" />;
    }
    if (lowerPlatform.includes('nintendo') || lowerPlatform.includes('switch') || lowerPlatform.includes('ns')) {
      return <BsNintendoSwitch className="w-4 h-4" />;
    }
    if (lowerPlatform.includes('ios') || lowerPlatform.includes('iphone')) {
      return <SiApple className="w-4 h-4" />;
    }
    if (lowerPlatform.includes('android')) {
      return <SiAndroid className="w-4 h-4" />;
    }
    return <AiFillAppstore className="w-4 h-4" />;
  };

  const formatPrice = (price: number) => {
    return (price / 1000).toLocaleString('vi-VN') + ' VNĐ';
  };

  // Hình ảnh mặc định nếu thumbnail không hợp lệ
  const defaultImage = '/images/vercel.svg';

  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden flex flex-col h-full w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="relative w-full flex-shrink-0 aspect-video">
        {game.thumbnail && game.thumbnail !== '' ? (
          <Image
            src={game.thumbnail}
            alt={game.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            priority
          />
        ) : (
          <Image
            src={defaultImage}
            alt="Hình ảnh mặc định"
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            priority
          />
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        {/* ID và Title */}
        <div className="mb-2 flex-shrink-0">
          <div className="text-xs text-gray-400 mb-1">ID: {game.game_id}</div>
          <h3
            className="text-white font-semibold text-sm h-10 overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.25rem',
            }}
          >
            {game.title}
          </h3>
        </div>

        <div className="flex justify-end mb-2 flex-shrink-0">
          <div className="flex gap-1">
            {game.platforms && game.platforms.length > 0 ? (
              game.platforms.map((platform, index) => {
                const icon = getPlatformIcon(platform);
                return icon ? (
                  <div key={index} className="text-gray-400">
                    {icon}
                  </div>
                ) : null;
              })
            ) : (
              <div className="text-gray-500 text-xs">Không có nền tảng</div>
            )}
          </div>
        </div>

        <hr className="border-gray-600 mb-2 flex-shrink-0" />

        <div className="flex items-center justify-between mt-auto">
          <div className="flex-1">
            {game.discount_price ? (
              <div className="space-y-1">
                <div className="text-green-400 font-semibold text-sm">
                  {formatPrice(game.discount_price)}
                </div>
                <div className="text-gray-400 text-xs line-through">
                  {formatPrice(game.price)}
                </div>
              </div>
            ) : (
              <div className="text-white font-semibold text-sm">
                {formatPrice(game.price)}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <motion.button
              onClick={() => onEdit(game)}
              className="w-7 h-7 rounded-full bg-yellow-600 hover:bg-yellow-700 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Sửa game"
            >
              <Pencil className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              onClick={() => onDelete(game.game_id)}
              className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Xóa game"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;