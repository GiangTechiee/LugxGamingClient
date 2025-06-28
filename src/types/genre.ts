export interface Genre {
  genre_id: number;
  name: string;
  description?: string;
  game_genres?: Array<{
    game_id: number;
    game: {
      title: string;
    };
  }>;
}

export interface CreateGenreData {
  name: string;
  description?: string;
}

export interface UpdateGenreData {
  name?: string;
  description?: string;
}