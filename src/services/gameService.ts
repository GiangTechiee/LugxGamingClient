import { apiClient } from '../lib/api-client';
import { IResponse } from '../types/api';
import { Game, GameDetail, CreateGameData, UpdateGameData } from '../types/game';

export const gameService = {
  async getGames(take: number, skip: number): Promise<IResponse<Game[]>> {
    return apiClient.get(`games?take=${take}&skip=${skip}`);
  },

  async getLatestGames(take: number, skip: number): Promise<IResponse<Game[]>> {
    return apiClient.get(`games/latest?take=${take}&skip=${skip}`);
  },

  async getHotGames(take: number, skip: number): Promise<IResponse<Game[]>> {
    return apiClient.get(`games/hot?take=${take}&skip=${skip}`);
  },

  async getGamesByPlatform(platformName: string, take: number, skip: number): Promise<IResponse<Game[]>> {
    return apiClient.get(`games/platform/${platformName}?take=${take}&skip=${skip}`);
  },

  async getGamesByGenre(genreId: number, take: number, skip: number): Promise<IResponse<Game[]>> {
    return apiClient.get(`games/genre/${genreId}?take=${take}&skip=${skip}`);
  },

  async getRandomGameId(): Promise<IResponse<number>> {
    return apiClient.get('games/random');
  },

  async getGameById(gameId: number): Promise<IResponse<GameDetail>> {
    return apiClient.get(`games/${gameId}`);
  },

  async createGame(data: CreateGameData): Promise<IResponse<GameDetail>> {
    return apiClient.post('games', data);
  },

  async updateGame(gameId: number, data: UpdateGameData): Promise<IResponse<GameDetail>> {
    return apiClient.patch(`games/${gameId}`, data);
  },

  async deleteGame(gameId: number): Promise<IResponse<void>> {
    return apiClient.delete(`games/${gameId}`);
  },
};