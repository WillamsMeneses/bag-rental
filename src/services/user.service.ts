import { api } from './api';
import type { UserProfile, UpdateProfileDto } from '@/types/user.types';

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<BackendResponse<UserProfile>>('/users/me');
    return response.data.data;
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const response = await api.patch<BackendResponse<UserProfile>>('/users/me', dto);
    return response.data.data;
  },
};