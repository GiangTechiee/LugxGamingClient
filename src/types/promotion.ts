export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED_AMOUNT',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum PromotionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  NOT_STARTED = 'NOT_STARTED',
  EXPIRED = 'EXPIRED',
}

export interface Promotion {
  promotion_id?: number;
  code: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  minimum_order?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePromotionDto {
  code: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  minimum_order?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface UpdatePromotionDto {
  code?: string;
  description?: string;
  discount_type?: DiscountType;
  discount_value?: number;
  minimum_order?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface CheckPromotionResponse {
  promotion: Promotion;
  status: PromotionStatus;
  message: string;
}