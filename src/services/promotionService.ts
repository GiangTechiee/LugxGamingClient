import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/api";
import { Promotion, CreatePromotionDto, UpdatePromotionDto, CheckPromotionResponse } from "@/types/promotion";

export class PromotionService {
  async createPromotion(data: CreatePromotionDto): Promise<IResponse<Promotion>> {
    return apiClient.post<Promotion, CreatePromotionDto>('promotions', data);
  }

  async getAllPromotions(): Promise<IResponse<Promotion[]>> {
    return apiClient.get<Promotion[]>('promotions');
  }

  async getPromotionById(id: number): Promise<IResponse<Promotion>> {
    return apiClient.get<Promotion>(`promotions/${id}`);
  }

  async updatePromotion(id: number, data: UpdatePromotionDto): Promise<IResponse<Promotion>> {
    return apiClient.patch<Promotion, UpdatePromotionDto>(`promotions/${id}`, data);
  }

  async deletePromotion(id: number): Promise<IResponse<null>> {
    return apiClient.delete<null>(`promotions/${id}`);
  }

  async checkPromotionCode(code: string): Promise<IResponse<CheckPromotionResponse>> {
    return apiClient.get<CheckPromotionResponse>(`promotions/check/${code}`);
  }
}

export const promotionService = new PromotionService();