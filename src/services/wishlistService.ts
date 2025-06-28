import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/api";
import { Wishlist, CreateWishlistData, UpdateWishlistData } from "@/types/wishlist";

export class WishlistService {
  async createWishlist(data: CreateWishlistData): Promise<IResponse<Wishlist>> {
    return await apiClient.post<Wishlist, CreateWishlistData>('wishlist', data);
  }

  async getAllWishlists(user_id?: number): Promise<IResponse<Wishlist[]>> {
    const endpoint = user_id ? `wishlist?user_id=${user_id}` : 'wishlist';
    return await apiClient.get<Wishlist[]>(endpoint);
  }

  async getWishlistById(id: number): Promise<IResponse<Wishlist>> {
    return await apiClient.get<Wishlist>(`wishlist/${id}`);
  }

  async updateWishlist(id: number, data: UpdateWishlistData): Promise<IResponse<Wishlist>> {
    return await apiClient.patch<Wishlist, UpdateWishlistData>(`wishlist/${id}`, data);
  }

  async deleteWishlist(id: number): Promise<IResponse<unknown>> {
    return await apiClient.delete<unknown>(`wishlist/${id}`);
  }

  async getWishlistByUser(user_id: number): Promise<IResponse<Wishlist[]>> {
    return await apiClient.get<Wishlist[]>(`wishlist/user/${user_id}`);
  }

  async deleteWishlistByUserAndGame(user_id: number, game_id: number): Promise<IResponse<unknown>> {
    return await apiClient.delete<unknown>(`wishlist/user/${user_id}/game/${game_id}`);
  }
}

export const wishlistService = new WishlistService();