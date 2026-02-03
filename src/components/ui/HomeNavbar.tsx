import { AppBar, Toolbar, Box, IconButton, Avatar, Typography } from '@mui/material';
import HoverLink from './HoverLink';

function HomeNavbar() {
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
          <IconButton sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: '#f5f5f5' } }}>
            <Avatar sx={{ width: 32, height: 32 }} />
            {/* <KeyboardArrowDownIcon sx={{ ml: 1 }} /> */}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default HomeNavbar;