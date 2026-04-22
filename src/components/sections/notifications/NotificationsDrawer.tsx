import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { GenericDrawer } from '@/components/ui/GenericDrawer';
import { NotificationItem } from './NotificationItem';
import type { useNotifications } from '@/hooks/useNotifications';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
  notificationsData: ReturnType<typeof useNotifications>;
}

export const NotificationsDrawer = ({
  open,
  onClose,
  notificationsData,
}: NotificationsDrawerProps) => {
  const { notifications, unreadCount, loading, error, markAllAsRead, markAsRead } = notificationsData;

  return (
    <GenericDrawer
      open={open}
      onClose={onClose}
      title="Notifications"
      width={400}
      closeMode='close'
    >
      {unreadCount > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button
            variant="text"
            size="small"
            onClick={markAllAsRead}
            sx={{ color: 'primary.main', fontSize: '13px', fontWeight: 500 }}
          >
            Mark all as read
          </Button>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} color="primary" />
        </Box>
      )}

      {!loading && error && (
        <Typography variant="body2" color="error" textAlign="center" sx={{ py: 4 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 6 }}>
          No notifications yet.
        </Typography>
      )}

      {!loading && !error && (
        <Box>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </Box>
      )}
    </GenericDrawer>
  );
};