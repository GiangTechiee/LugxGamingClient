import { apiClient } from '@/lib/api-client';
import { IResponse } from '@/types/api';
import { CartItem } from '@/types/cart';

export interface CreateCartItemDto {
  game_id: number;
}

export interface UpdateCartItemDto {
  game_id?: number;
}

export interface Cart {
  cart_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  cart_items: CartItem[];
  user: {
    username: string;
  };
}

class CartService {
  async getCart(): Promise<IResponse<Cart>> {
    return apiClient.get<Cart>('cart');
  }

  async getCartItems(): Promise<IResponse<CartItem[]>> {
    return apiClient.get<CartItem[]>('cart/items');
  }

  async addToCart(data: CreateCartItemDto): Promise<IResponse<CartItem>> {
    return apiClient.post<CartItem, CreateCartItemDto>('cart/items', data);
  }

  async updateCartItem(cartItemId: number, data: UpdateCartItemDto): Promise<IResponse<CartItem>> {
    return apiClient.patch<CartItem, UpdateCartItemDto>(`cart/items/${cartItemId}`, data);
  }

  async removeFromCart(cartItemId: number): Promise<IResponse<void>> {
    return apiClient.delete<void>(`cart/items/${cartItemId}`);
  }

  async clearCart(): Promise<IResponse<void>> {
    return apiClient.delete<void>('cart');
  }

  // Admin only
  async getCartByUserId(userId: number): Promise<IResponse<Cart>> {
    return apiClient.get<Cart>(`cart/${userId}`);
  }
}

export const cartService = new CartService();