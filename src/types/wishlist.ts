export interface Wishlist {
  wishlist_id: number;
  user_id: number;
  game_id: number;
  added_at: string;
  user?: {
    username: string;
  };
  game?: {
    game_id: number; 
    title: string;
    price: string; 
    discount_price: number | null;
    game_images?: Array<{
      image_url: string;
    }>;
  };
}

export interface CreateWishlistData {
  user_id: number;
  game_id: number;
}

export interface UpdateWishlistData {
  user_id?: number;
  game_id?: number;
}