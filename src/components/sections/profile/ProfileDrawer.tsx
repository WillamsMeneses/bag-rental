import { useState } from 'react';
import {
  Box, Avatar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, Badge,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { GenericDrawer } from '@/components/ui/GenericDrawer';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationsDrawer } from '../notifications/NotificationsDrawer';

const GREEN = '#4a7c3f';

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  username?: string;
}

export const ProfileDrawer = ({ open, onClose, username = 'Username' }: ProfileDrawerProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Única instancia — se comparte con NotificationsDrawer via props
  const notificationsData = useNotifications();
  const { unreadCount } = notificationsData;

  const handleNavigate = (route: string) => {
    navigate(route);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleOpenNotifications = () => {
    setNotificationsOpen(true);
    notificationsData.refresh();
  };

  const headerTitle = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ width: 64, height: 64, bgcolor: '#8db87a' }} />
      <Box>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Hi, #{username}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: GREEN, cursor: 'pointer' }}
          onClick={() => handleNavigate('/my-profile')}
        >
          My profile →
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <GenericDrawer
        open={open}
        onClose={onClose}
        title={headerTitle}
        width={360}
        headerSx={{ backgroundColor: '#f2f2f2' }}
      >
        <Box sx={{ mt: 1, mx: -2 }}>
          <List disablePadding>
            <ListItemButton
              onClick={handleOpenNotifications}
              sx={{
                py: 2, px: 2, borderRadius: 2,
                border: '1px solid #e8e8e8', mb: 1.5,
                '&:hover': { backgroundColor: '#f9f9f9' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: GREEN }}>
                <Badge
                  badgeContent={unreadCount > 0 ? unreadCount : null}
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#e53935', color: 'white',
                      fontSize: 11, minWidth: 18, height: 18,
                    },
                  }}
                >
                  <NotificationsNoneIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary="Notifications"
                slotProps={{ primary: { style: { color: GREEN, fontWeight: 500 } } }}
              />
              <Typography sx={{ color: GREEN, fontSize: 18, lineHeight: 1 }}>→</Typography>
            </ListItemButton>

            {[
              { label: 'Inbox', icon: <ChatBubbleOutlineIcon />, route: '/inbox', badge: 2 },
              { label: 'Favorites', icon: <FavoriteBorderIcon />, route: '/my-favorites' },
              { label: 'My Listings', icon: <LabelOutlinedIcon />, route: '/my-listings' },
              { label: 'My Rentals', icon: <ShoppingBagOutlinedIcon />, route: '/my-rentals' },
            ].map((item) => (
              <Box key={item.route}>
                <ListItemButton
                  onClick={() => handleNavigate(item.route)}
                  sx={{
                    py: 2, px: 2, borderRadius: 2,
                    border: '1px solid #e8e8e8', mb: 1.5,
                    '&:hover': { backgroundColor: '#f9f9f9' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: GREEN }}>
                    {item.badge ? (
                      <Badge
                        badgeContent={item.badge}
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#e53935', color: 'white',
                            fontSize: 11, minWidth: 18, height: 18,
                          },
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{ primary: { style: { color: GREEN, fontWeight: 500 } } }}
                  />
                  <Typography sx={{ color: GREEN, fontSize: 18, lineHeight: 1 }}>→</Typography>
                </ListItemButton>
              </Box>
            ))}
          </List>

          <ListItemButton
            onClick={handleLogout}
            sx={{
              py: 2, px: 2, borderRadius: 2, mt: 0.5,
              border: '1px solid #e8e8e8',
              '&:hover': { backgroundColor: '#f9f9f9' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: GREEN }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Log Out"
              slotProps={{ primary: { style: { color: GREEN, fontWeight: 500 } } }}
            />
          </ListItemButton>
        </Box>
      </GenericDrawer>

      {/* Pasa la instancia compartida como props */}
      <NotificationsDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notificationsData={notificationsData}
      />
    </>
  );
};