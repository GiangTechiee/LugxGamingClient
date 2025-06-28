export interface Platform {
  platform_id: number;
  name: string;
  description?: string;
  game_platforms?: Array<{
    game: { title: string };
  }>;
}

export interface CreatePlatform {
  name: string;
  description?: string;
}

export interface UpdatePlatform {
  name?: string;
  description?: string;
}