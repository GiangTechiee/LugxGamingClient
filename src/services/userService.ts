import { apiClient } from '@/lib/api-client';
import { IResponse } from '../types/api';
import { UserResponse, CreateUser, UpdateUser, UpdateUserByAdmin } from '../types/user';

export class UserService {
  async create(userData: CreateUser): Promise<IResponse<UserResponse>> {
    return await apiClient.post<UserResponse, CreateUser>('users', userData);
  }

  async findAll(): Promise<IResponse<UserResponse[]>> {
    return await apiClient.get<UserResponse[]>('users');
  }

  async findOne(id: number): Promise<IResponse<UserResponse>> {
    return await apiClient.get<UserResponse>(`users/${id}`);
  }

  async updateByCustomer(id: number, userData: UpdateUser): Promise<IResponse<UserResponse>> {
    return await apiClient.patch<UserResponse, UpdateUser>(`users/customer/${id}`, userData);
  }

  async updateByAdmin(id: number, userData: UpdateUserByAdmin): Promise<IResponse<UserResponse>> {
    return await apiClient.patch<UserResponse, UpdateUserByAdmin>(`users/admin/${id}`, userData);
  }

  async delete(id: number): Promise<IResponse<void>> {
    return await apiClient.delete<void>(`users/${id}`);
  }
}

export const userService = new UserService();