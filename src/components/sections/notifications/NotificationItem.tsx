import { Box, Typography, Button, Avatar } from '@mui/material';
import type { NotificationApiResponse } from '@/types/notification.types';
import { formatNotificationDate } from '@/utils/dateFormat';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: NotificationApiResponse;
  onMarkAsRead: (id: string) => Promise<void>;
}

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const isUnread = !notification.isRead;
  const navigate = useNavigate();

  // Clickeable solo si hay rental y startDate es futuro
  const isActive =
    !!notification.rental?.startDate &&
    new Date() < new Date(notification.rental.startDate);

  const handleClick = async () => {
    if (!isActive) return;
    if (isUnread) await onMarkAsRead(notification.id);
    navigate(`/rental-requests/${notification.rentalId}`);
  };

  const borderColor = isUnread ? 'primary.main' : 'grey.400';

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        gap: 1.5,
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'grey.300',
        position: 'relative',
        cursor: isActive ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        ...(isActive && {
          '&:hover': { backgroundColor: 'grey.50' },
        }),
        // Borde izquierdo: verde si unread, gris si read — solo si isActive
        '&::before': isActive
          ? {
              content: '""',
              position: 'absolute',
              left: -24,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: borderColor,
              borderRadius: '0 2px 2px 0',
            }
          : {},
      }}
    >
      <Avatar
        src={
          (notification.metadata?.renterAvatarUrl as string | undefined) ?? undefined
        }
        sx={{ width: 44, height: 44, flexShrink: 0 }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
          {notification.message}
        </Typography>

        {/* Botón solo para unread activas */}
        {isUnread && isActive && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // evita doble trigger con el box
                handleClick();
              }}
              sx={{ px: 2, py: 0.5, fontSize: '13px' }}
            >
              View request
            </Button>
          </Box>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'right' }}
        >
          {formatNotificationDate(notification.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
};