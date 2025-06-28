export interface CartGame {
  title: string;
  price: string;
  discount_price: string | null;
  thumbnail?: string;
  game_images?: Array<{
    image_url: string;
  }>;
}

export interface CartItem {
  cart_item_id: number;
  cart_id: number;
  game_id: number;
  game: CartGame;
}