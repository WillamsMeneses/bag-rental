import { AppBar, Toolbar, Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import HoverLink from './HoverLink';
import { ProfileDrawer } from '../sections/profile/ProfileDrawer';
import { useProfileDrawer } from '@/hooks/useProfileDrawer';
import UserMenuButton from '../sections/home/UserMenuButton';
import { useAuthStore } from '@/stores/authStore';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useScrollSticky } from '@/hooks/useScrollSticky';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'HOW IT WORKS', to: '/how-it-works' },
  { label: 'ABOUT US', to: '/about-us' },
  { label: 'FAQS', to: '/faqs' },
];

function HomeNavbar() {
  const { open, openDrawer, closeDrawer } = useProfileDrawer();
  const { isAuthenticated } = useAuthStore();
  const isSticky = useScrollSticky(80);
  const { openModal } = useAuthModal();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleUserMenuClick = () => {
    if (isAuthenticated) openDrawer();
    else openModal();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        backgroundColor: isSticky ? 'rgba(255,255,255,0.15)' : 'transparent',
        backdropFilter: isSticky ? 'blur(16px)' : 'none',
        boxShadow: isSticky ? '0 1px 8px rgba(0,0,0,0.08)' : 'none',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        {/* Logo + hamburger */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isSticky && (
            <>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ color: '#6A9D50' }}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      borderRadius: '12px',
                      mt: 1,
                      minWidth: 180,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
              >
                {NAV_ITEMS.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => { navigate(item.to); setAnchorEl(null); }}
                    sx={{ color: '#6A9D50', fontWeight: 500, py: 1.5, px: 2.5 }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
          {/* tu logo acá */}
        </Box>

        {/* Menu Items normales */}
        {!isSticky && (
          <Box sx={{ display: 'flex', gap: 4 }}>
            {NAV_ITEMS.map((item) => (
              <HoverLink key={item.label} to={item.to} underlineColor="#89C96A">
                <Typography variant="body1" color="white">{item.label}</Typography>
              </HoverLink>
            ))}
          </Box>
        )}

        {/* Profile Button */}
        <Box>
          <UserMenuButton onClick={handleUserMenuClick} />
          <ProfileDrawer open={open} onClose={closeDrawer} username="JohnDoe" />
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default HomeNavbar;