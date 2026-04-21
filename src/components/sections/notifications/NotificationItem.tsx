import { Box, Typography, Button, Avatar } from '@mui/material';
import type { NotificationApiResponse } from '@/types/notification.types';
import { formatNotificationDate } from '@/utils/dateFormat';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: NotificationApiResponse;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const isUnread = !notification.isRead;
  const navigate = useNavigate();

  const handleViewRequest = () => {
    navigate(`/rental-requests/${notification.rentalId}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'grey.300',
        position: 'relative',
        // Green left border for unread
        '&::before': isUnread
          ? {
            content: '""',
            position: 'absolute',
            left: -24, // extends outside padding
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: 'primary.main',
            borderRadius: '0 2px 2px 0',
          }
          : {},
      }}
    >
      {/* Avatar */}
      <Avatar
        src={
          (notification.metadata?.renterAvatarUrl as string | undefined) ?? undefined
        }
        sx={{ width: 44, height: 44, flexShrink: 0 }}
      />

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
          {notification.message}
        </Typography>

        {/* View request button — only for unread */}
        {isUnread && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleViewRequest}
              sx={{ px: 2, py: 0.5, fontSize: '13px' }}
            >
              View request
            </Button>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right' }}>
          {formatNotificationDate(notification.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
};