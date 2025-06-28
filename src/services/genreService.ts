import { apiClient } from '@/lib/api-client';
import { IResponse } from '../types/api';
import { Genre, CreateGenreData, UpdateGenreData } from '@/types/genre';

export class GenreService {
  async getAllGenres(): Promise<IResponse<Genre[]>> {
    return await apiClient.get<Genre[]>('genres');
  }

  async getGenreById(id: number): Promise<IResponse<Genre>> {
    return await apiClient.get<Genre>(`genres/${id}`);
  }

  async createGenre(data: CreateGenreData): Promise<IResponse<Genre>> {
    return await apiClient.post<Genre, CreateGenreData>('genres', data);
  }

  async updateGenre(id: number, data: UpdateGenreData): Promise<IResponse<Genre>> {
    return await apiClient.patch<Genre, UpdateGenreData>(`genres/${id}`, data);
  }

  async deleteGenre(id: number): Promise<IResponse<null>> {
    return await apiClient.delete<null>(`genres/${id}`);
  }
}

export const genreService = new GenreService();