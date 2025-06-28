import { apiClient } from '@/lib/api-client';
import { IResponse } from '../types/api'; 
import { Payment, CreatePaymentDto, UpdatePaymentDto } from '@/types/payment';

export class PaymentService {
  async createPayment(createPaymentDto: CreatePaymentDto): Promise<IResponse<Payment>> {
    return apiClient.post<Payment, CreatePaymentDto>('payments', createPaymentDto);
  }

  async getAllPayments(): Promise<IResponse<Payment[]>> {
    return apiClient.get<Payment[]>('payments');
  }

  async getMyPayments(): Promise<IResponse<Payment[]>> {
    return apiClient.get<Payment[]>('my-payments');
  }

  async getPaymentById(id: number): Promise<IResponse<Payment>> {
    return apiClient.get<Payment>(`payments/${id}`);
  }

  async updatePayment(id: number, updatePaymentDto: UpdatePaymentDto): Promise<IResponse<Payment>> {
    return apiClient.patch<Payment, UpdatePaymentDto>(`payments/${id}`, updatePaymentDto);
  }

  async deletePayment(id: number): Promise<IResponse<null>> {
    return apiClient.delete<null>(`payments/${id}`);
  }
}

export const paymentService = new PaymentService();