import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import HoverLink from './HoverLink';
import { ProfileDrawer } from '../sections/profile/ProfileDrawer';
import { useProfileDrawer } from '@/hooks/useProfileDrawer';
import UserMenuButton from '../sections/home/UserMenuButton';
import { useAuthStore } from '@/stores/authStore';
import { useAuthModal } from '@/hooks/useAuthModal';

function HomeNavbar() {
  const { open, openDrawer, closeDrawer } = useProfileDrawer();
  const { isAuthenticated } = useAuthStore();

  const { openModal } = useAuthModal();

  const handleUserMenuClick = () => {
    if (isAuthenticated) {
      openDrawer();
    } else {
      openModal(); // 👈
    }
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: 'green' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box>
          {/* Acá va tu logo */}
        </Box>

        {/* Menu Items */}
        <Box sx={{ display: 'flex', gap: 4 }}>

          <HoverLink to="/how-it-works" underlineColor="#89C96A">
            <Typography variant="body1" color="white">
              HOW IT WORKS
            </Typography>
          </HoverLink>
          <HoverLink to="/how-it-works" underlineColor="#89C96A">
            <Typography variant="body1" color="white">
              ABOUT US
            </Typography>
          </HoverLink>
          <HoverLink to="/how-it-works" underlineColor="#89C96A">
            <Typography variant="body1" color="white">
              FAQS
            </Typography>
          </HoverLink>
        </Box>

        {/* Profile Button */}
        <Box>
          <UserMenuButton
            onClick={handleUserMenuClick}  // 👈
          />
          <ProfileDrawer
            open={open}
            onClose={closeDrawer}
            username="JohnDoe"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default HomeNavbar;