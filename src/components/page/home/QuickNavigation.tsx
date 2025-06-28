'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/QuickNavigation.module.css';
import { gameService } from '@/services/gameService';

export default function QuickNavigation() {
  const router = useRouter();

  const handleRandomGameClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Ngăn điều hướng mặc định của Link
    try {
      const response = await gameService.getRandomGameId();
      const gameId = response.data;
      router.push(`/games/${gameId}`);
    } catch (error) {
      console.error('Lỗi khi lấy game_id ngẫu nhiên:', error);
      // Fallback: điều hướng đến trang /games nếu lỗi
      router.push('/games');
    }
  };

  return (
    <div className={`${styles.container} w-64 bg-white/20 backdrop-blur-md text-white p-6 rounded-3xl shadow-lg`}>
      <h2 className="text-2xl font-semibold mb-4">Điều hướng nhanh</h2>
      <ul className="space-y-2">
        <li>
          <Link
            href="/games" // Href mặc định để đảm bảo SEO
            onClick={handleRandomGameClick}
            className={`${styles.navLink} block px-4 py-2 rounded-full bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-200`}
          >
            Random Game
          </Link>
        </li>
        <li>
          <Link
            href="/games/new"
            className={`${styles.navLink} block px-4 py-2 rounded-full bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-200`}
          >
            Game mới cập nhật
          </Link>
        </li>
        <li>
          <Link
            href="/games/hot"
            className={`${styles.navLink} block px-4 py-2 rounded-full bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-200`}
          >
            Game Hot
          </Link>
        </li>
        <li>
          <Link
            href="/purchase-history"
            className={`${styles.navLink} block px-4 py-2 rounded-full bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-200`}
          >
            Lịch sử mua hàng
          </Link>
        </li>
        <li>
          <Link
            href="/tip"
            className={`${styles.navLink} block px-4 py-2 rounded-full bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-200`}
          >
            Thủ thuật
          </Link>
        </li>
      </ul>
    </div>
  );
}