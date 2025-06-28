"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Game } from "@/types/game";
import { gameService } from "@/services/gameService";
import {
  PageConfig,
  pageConfigs,
} from "../../../../constants/GameListPage/pageConfig";
import GameCard from "./GameCard/GameCard";
import LoadMoreButton from "./LoadMoreButton";
import Sidebar from "./Sidebar/Sidebar";

interface GameListPageProps {
  pageKey?: string; // Optional override for page config
}

const GameListPage = ({ pageKey }: GameListPageProps) => {
  const pathname = usePathname();
  const configKey = pageKey || pathname;
  const config: PageConfig = pageConfigs[configKey] || pageConfigs["/games"];

  const [games, setGames] = useState<Game[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const take = 12;

  const fetchGames = useCallback(
    async (newSkip: number) => {
      setLoading(true);
      try {
        let response;

        // Dynamic service method call based on config
        switch (config.fetchFunction) {
          case "getLatestGames":
            response = await gameService.getLatestGames(take, newSkip);
            break;
          case "getHotGames":
            response = await gameService.getHotGames(take, newSkip);
            break;
          case "getGamesByPlatform":
            if (config.platformName) {
              // Assuming you have this method in gameService
              response = await gameService.getGamesByPlatform(
                config.platformName,
                take,
                newSkip
              );
            } else {
              response = await gameService.getGames(take, newSkip);
            }
            break;
          case "getGamesByGenre":
            if (config.genreId) {
              // Assuming you have this method in gameService
              response = await gameService.getGamesByGenre(
                config.genreId,
                take,
                newSkip
              );
            } else {
              response = await gameService.getGames(take, newSkip);
            }
            break;
          case "getGames":
          default:
            response = await gameService.getGames(take, newSkip);
            break;
        }

        if (newSkip === 0) {
          setGames(response.data);
        } else {
          setGames((prev) => [...prev, ...response.data]);
        }
        setSkip(newSkip + take);
      } catch (error) {
        console.error(`Error fetching games (${config.fetchFunction}):`, error);
      } finally {
        setLoading(false);
      }
    },
    [config.fetchFunction, config.platformName, config.genreId]
  );

  useEffect(() => {
    // Reset state when config changes
    setGames([]);
    setSkip(0);
    fetchGames(0);
  }, [configKey, fetchGames]);

  return (
    <div className="flex min-h-screen bg-black pt-20">
      <Sidebar />
      <motion.main
        className="flex-1 md:ml-64 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {config.title}
            </h1>
            {config.subtitle && (
              <p className="text-gray-400">{config.subtitle}</p>
            )}
          </div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {games.map((game) => (
              <GameCard key={game.game_id} game={game} />
            ))}
          </motion.div>

          {loading && (
            <div className="flex justify-center mt-8">
              <div className="text-white">Đang tải...</div>
            </div>
          )}

          {!loading && games.length > 0 && (
            <div className="mt-8 flex justify-center">
              <LoadMoreButton onClick={() => fetchGames(skip)} />
            </div>
          )}

          {!loading && games.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              {config.emptyMessage || "Không có game nào được tìm thấy"}
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default GameListPage;
