"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { gameService } from "@/services/gameService";
import { GameDetail } from "@/types/game";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import GameImageGallery from "@/components/page/game-detail/GameImageGallery";
import GameInfo from "@/components/page/game-detail/GameInfo";
import GameTabs from "@/components/page/game-detail/GameTab/GameTabs";

interface GameDetailPageProps {
  gameId: number;
}

const GameDetailPage = ({ gameId }: GameDetailPageProps) => {
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        setLoading(true);
        const response = await gameService.getGameById(gameId);
        setGame(response.data);
      } catch (err) {
        console.error("Error fetching game detail:", err);
        setError("Không thể tải thông tin game");
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetail();
  }, [gameId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Lỗi</h2>
          <p className="text-gray-400">{error || "Game không tồn tại"}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-black pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Main Content - Two Columns */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            <GameImageGallery images={game.game_images} />
          </div>

          {/* Right Column - Game Info */}
          <div className="space-y-6">
            <GameInfo game={game} />
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <GameTabs game={game} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameDetailPage;