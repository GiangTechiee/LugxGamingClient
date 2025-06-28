import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/api";
import { Review, CreateReviewDto, UpdateReviewDto } from "@/types/review";

export class ReviewService {
  async createReview(data: CreateReviewDto): Promise<IResponse<Review>> {
    return apiClient.post<Review, CreateReviewDto>('reviews', data);
  }

  async getAllReviews(
    game_id?: number,
    user_id?: number,
    rating?: number,
  ): Promise<IResponse<Review[]>> {
    const queryParams = new URLSearchParams();
    if (game_id) queryParams.append('game_id', game_id.toString());
    if (user_id) queryParams.append('user_id', user_id.toString());
    if (rating) queryParams.append('rating', rating.toString());

    const endpoint = `reviews${queryParams.toString() ? `?${queryParams}` : ''}`;
    return apiClient.get<Review[]>(endpoint);
  }

  async getReviewById(id: number): Promise<IResponse<Review>> {
    return apiClient.get<Review>(`reviews/${id}`);
  }

  async updateReview(id: number, data: UpdateReviewDto): Promise<IResponse<Review>> {
    return apiClient.patch<Review, UpdateReviewDto>(`reviews/${id}`, data);
  }

  async deleteReview(id: number): Promise<IResponse<null>> {
    return apiClient.delete<null>(`reviews/${id}`);
  }

  async getReviewsByGame(game_id: number, rating?: number): Promise<IResponse<Review[]>> {
    const queryParams = new URLSearchParams();
    if (rating) queryParams.append('rating', rating.toString());

    const endpoint = `reviews/game/${game_id}${queryParams.toString() ? `?${queryParams}` : ''}`;
    return apiClient.get<Review[]>(endpoint);
  }

  async getReviewsByUser(user_id: number, rating?: number): Promise<IResponse<Review[]>> {
    const queryParams = new URLSearchParams();
    if (rating) queryParams.append('rating', rating.toString());

    const endpoint = `reviews/user/${user_id}${queryParams.toString() ? `?${queryParams}` : ''}`;
    return apiClient.get<Review[]>(endpoint);
  }
}

export const reviewService = new ReviewService();