import { useEffect, useState, useCallback } from 'react';
import type { NotificationApiResponse } from '@/types/notification.types';
import { notificationService } from '@/services/notification.service';

interface UseNotificationsReturn {
  notifications: NotificationApiResponse[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<NotificationApiResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [paginated, count] = await Promise.all([
          notificationService.getNotifications(1, 20),
          notificationService.getUnreadCount(),
        ]);
        setNotifications(paginated.data);
        setUnreadCount(count);
      } catch {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tick]);

  const markAsRead = useCallback(async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, loading, error, markAsRead, markAllAsRead, refresh };
};