'use client';

import { useState, useEffect } from 'react';
import { Game } from '@/types/game';
import GameCard from './GameCard';
import GameModal from './GameModal/GameModal';
import LoadMoreButton from '../../game-list/LoadMoreButton';
import { gameService } from '@/services/gameService';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';

const GamePage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const take = 12; // Số lượng game mỗi lần tải

  const fetchGames = async (take: number, skip: number, append = false) => {
    try {
      const response = await gameService.getGames(take, skip);
      const newGames = response.data;

      // Nếu append, thêm game mới vào danh sách hiện tại
      setGames((prev) => (append ? [...prev, ...newGames] : newGames));

      // Kiểm tra xem còn game để tải không
      setHasMore(newGames.length === take);
    } catch {
      toast.error('Lỗi khi tải danh sách game');
      setHasMore(false);
    }
  };

  // Tải game lần đầu khi component mount
  useEffect(() => {
    fetchGames(take, 0);
  }, []);

  // Xử lý nút "Xem thêm"
  const handleLoadMore = () => {
    const newSkip = skip + take;
    setSkip(newSkip);
    fetchGames(take, newSkip, true);
  };

  const handleAddGame = () => {
    setSelectedGame(null);
    setIsModalOpen(true);
  };

  const handleEditGame = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleDeleteGame = async (gameId: number) => {
    if (!confirm('Bạn có chắc muốn xóa game này?')) return;

    const loadingToast = toast.loading('Đang xóa game...');
    try {
      await gameService.deleteGame(gameId);
      setGames(games.filter((game) => game.game_id !== gameId));
      toast.dismiss(loadingToast);
      toast.success('Xóa game thành công');
    } catch {
      toast.dismiss(loadingToast);
      toast.error('Lỗi khi xóa game');
    }
  };

  const handleSaveGame = async () => {
    await fetchGames(take, 0); // Tải lại danh sách từ đầu
    setSkip(0); // Reset skip
    setHasMore(true); // Reset hasMore
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Quản lý game</h1>
        <button
          onClick={handleAddGame}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Thêm game
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {games.map((game) => (
          <GameCard
            key={game.game_id}
            game={game}
            onEdit={handleEditGame}
            onDelete={handleDeleteGame}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <LoadMoreButton onClick={handleLoadMore} />
        </div>
      )}

      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        game={selectedGame}
        onSave={handleSaveGame}
      />
    </div>
  );
};

export default GamePage;