import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/api";
import { Order, CreateOrderDto, UpdateOrderDto } from "@/types/order";

export class OrderService {
  async createOrder(dto: CreateOrderDto): Promise<IResponse<Order>> {
    return apiClient.post<Order, CreateOrderDto>('order', dto);
  }

  async getAllOrders(): Promise<IResponse<Order[]>> {
    return apiClient.get<Order[]>('order');
  }

  async getOrderById(orderId: number): Promise<IResponse<Order>> {
    return apiClient.get<Order>(`order/${orderId}`);
  }

  async updateOrder(orderId: number, dto: UpdateOrderDto): Promise<IResponse<Order>> {
    return apiClient.patch<Order, UpdateOrderDto>(`order/${orderId}`, dto);
  }

  async deleteOrder(orderId: number): Promise<IResponse<void>> {
    return apiClient.delete<void>(`order/${orderId}`);
  }

  async getOrdersByUserId(userId: number): Promise<IResponse<Order[]>> {
    return apiClient.get<Order[]>(`order/user/${userId}`);
  }
}

export const orderService = new OrderService();