export interface GameImage {
  image_url: string;
}

export interface Game {
  game_id: number;
  title: string;
  price: string; // Prisma.Decimal được chuyển thành string trong JSON
  discount_price?: string | null; // Prisma.Decimal | null
  thumbnail?: string; // Giữ lại để backward compatibility
  game_images?: GameImage[]; // Thêm field mới từ API
}

export interface OrderItem {
  order_item_id: number; // Thêm field này từ API
  order_id: number;
  game_id: number;
  game: Game;
}

export interface User {
  username: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
}

export interface Order {
  order_id: number;
  user_id: number;
  total_amount: string; // Prisma.Decimal
  discounted_amount?: string | null; // Prisma.Decimal | null
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string | null;
  created_at: string; // DateTime từ Prisma thành ISO string
  updated_at: string;
  order_items: OrderItem[];
  user: User;
}

export interface CreateOrderDto {
  notes?: string;
  selected_game_ids: number[];
  promotion_code?: string;
}

export interface UpdateOrderDto {
  notes?: string;
  status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}