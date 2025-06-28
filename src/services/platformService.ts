import { apiClient } from '../lib/api-client';
import { IResponse } from '../types/api';
import { Platform, CreatePlatform, UpdatePlatform } from '../types/platform';

export class PlatformService {
  async create(platformData: CreatePlatform): Promise<IResponse<Platform>> {
    return await apiClient.post<Platform, CreatePlatform>('platforms', platformData);
  }

  async findAll(): Promise<IResponse<Platform[]>> {
    return await apiClient.get<Platform[]>('platforms');
  }

  async findOne(id: number): Promise<IResponse<Platform>> {
    return await apiClient.get<Platform>(`platforms/${id}`);
  }

  async update(id: number, platformData: UpdatePlatform): Promise<IResponse<Platform>> {
    return await apiClient.patch<Platform, UpdatePlatform>(`platforms/${id}`, platformData);
  }

  async delete(id: number): Promise<IResponse<void>> {
    return await apiClient.delete<void>(`platforms/${id}`);
  }
}

export const platformService = new PlatformService();