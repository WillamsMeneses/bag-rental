// src/services/notification.service.ts
import { api } from './api';
import type { NotificationApiResponse, PaginatedNotifications } from '@/types/notification.types';

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export const notificationService = {
  getNotifications: async (
    page = 1,
    limit = 20,
    isRead?: boolean,
  ): Promise<PaginatedNotifications> => {
    const params: Record<string, unknown> = { page, limit };
    if (isRead !== undefined) params.isRead = isRead;
    const response = await api.get<BackendResponse<PaginatedNotifications>>(
      '/notifications',
      { params },
    );
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<BackendResponse<{ count: number }>>(
      '/notifications/unread-count',
    );
    return response.data.data.count;
  },

  markAsRead: async (id: string): Promise<NotificationApiResponse> => {
    const response = await api.patch<BackendResponse<NotificationApiResponse>>(
      `/notifications/${id}/read`,
    );
    return response.data.data;
  },

  markAllAsRead: async (): Promise<{ updated: number }> => {
    const response = await api.patch<BackendResponse<{ updated: number }>>(
      '/notifications/mark-all-read',
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<Record<string, unknown>> => {
    const response = await api.get<BackendResponse<Record<string, unknown>>>(
      `/notifications/${id}`,
    );
    return response.data.data;
  },
};