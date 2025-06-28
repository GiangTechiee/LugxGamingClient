export interface Game {
  game_id: number;
  title: string;
  price: number;
  discount_price: number;
  platforms: string[];
  thumbnail: string;
}

// Additional interfaces for Game Detail Page
export interface GameImage {
  image_id: number;
  game_id: number;
  image_url: string;
  alt_text: string | null;
  order_index: number;
  created_at: string;
}

export interface Genre {
  genre_id: number;
  name: string;
  description: string | null;
}

export interface GameGenre {
  game_id: number;
  genre_id: number;
  genre: Genre;
}

export interface Platform {
  platform_id: number;
  name: string;
  description: string | null;
}

export interface GamePlatform {
  game_id: number;
  platform_id: number;
  platform: Platform;
}

export interface User {
  username: string;
}

export interface Review {
  rating: number;
  comment: string;
  created_at: string;
  user: User;
}

// Extended Game interface for detail page
export interface GameDetail {
  game_id: number;
  title: string;
  description: string;
  price: string;
  discount_price: string | null;
  developer: string;
  publisher: string;
  release_date: string;
  is_hot: boolean;
  created_at: string;
  updated_at: string;
  game_genres: GameGenre[];
  game_platforms: GamePlatform[];
  game_images: GameImage[];
  reviews: Review[];
}

export interface CreateGameData {
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  developer: string;
  publisher: string;
  release_date?: string;
  is_hot?: boolean;
  genre_ids?: number[];
  platform_ids?: number[];
  image_urls?: { url: string; alt_text?: string }[];
}

export interface UpdateGameData {
  title?: string;
  description?: string;
  price?: number;
  discount_price?: number | null;
  developer?: string;
  publisher?: string;
  release_date?: string;
  is_hot?: boolean;
  genre_ids?: number[];
  platform_ids?: number[];
  image_urls?: { url: string; alt_text?: string }[];
}