export interface Review {
  review_id: number;
  user_id: number;
  game_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user: {
    username: string;
  };
  game: {
    title: string;
  };
}

export interface CreateReviewDto {
  user_id: number;
  game_id: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}