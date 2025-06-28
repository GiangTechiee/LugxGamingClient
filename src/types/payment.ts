export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface CreatePaymentDto {
  order_id: number;
  payment_method: PaymentMethod;
  amount: string;
  transaction_id?: string;
  status: PaymentStatus;
  payment_date?: string;
  failure_reason?: string;
}

export interface UpdatePaymentDto {
  order_id?: number;
  payment_method?: PaymentMethod;
  amount?: string; // Sửa từ number thành string
  transaction_id?: string;
  status?: PaymentStatus;
  payment_date?: string;
  failure_reason?: string;
}

export interface Payment {
  payment_id: number;
  order_id: number;
  transaction_id?: string;
  amount: string; // Sửa từ number thành string
  status: PaymentStatus;
  payment_date?: string;
  failure_reason?: string;
  created_at?: string; // Thêm created_at
  order?: {
    order_id: number;
    user_id: number;
    total_amount: string; // Sửa từ number thành string
    discounted_amount?: string | null; // Sửa từ number thành string
    status: string;
    notes?: string | null; // Thêm notes
    created_at?: string; // Thêm created_at
    updated_at?: string; // Thêm updated_at
    order_items?: OrderItem[]; // Thêm order_items
  };
}

export interface Game {
  game_id: number;
  title: string;
  price: string;
  discount_price?: string | null;
  thumbnail?: string;
}

export interface OrderItem {
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
  total_amount: string;
  discounted_amount?: string | null;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string | null;
  created_at: string;
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