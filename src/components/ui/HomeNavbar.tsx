import { AppBar, Toolbar, Box, IconButton, Avatar, Typography } from '@mui/material';
import HoverLink from './HoverLink';
import { ProfileDrawer } from '../sections/profile/ProfileDrawer';
import { useProfileDrawer } from '@/hooks/useProfileDrawer';

function HomeNavbar() {
  const { open, openDrawer, closeDrawer } = useProfileDrawer();
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
          <IconButton
            onClick={openDrawer}
            sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: '#f5f5f5' } }}
          >
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>

          <ProfileDrawer
            open={open}
            onClose={closeDrawer}
            username="JohnDoe" // reemplazá con el dato real del user
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default HomeNavbar;