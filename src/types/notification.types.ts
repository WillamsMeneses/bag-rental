// src/types/notification.types.ts

export const NotificationType = {
  RENTAL_CONFIRMED: 'rental_confirmed',
  RENTAL_CANCELLED_BY_RENTER: 'rental_cancelled_by_renter',
  RENTAL_CANCELLED_BY_OWNER: 'rental_cancelled_by_owner',
  RENTAL_STARTED: 'rental_started',
  RENTAL_COMPLETED: 'rental_completed',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface NotificationApiResponse {
  id: string;
  userId: string;
  rentalId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  metadata: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  rental?: {
    id: string;
    status: string;
    startDate: string;
    endDate: string;
  } | null;
}

export interface PaginatedNotifications {
  data: NotificationApiResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}