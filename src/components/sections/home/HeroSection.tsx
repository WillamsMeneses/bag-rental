import React from 'react';
import { Box } from '@mui/material';
import heroBackground from '@/assets/svg/background-hero-section.svg';
import { SearchBar } from './SearchBar';

export const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: 440,
        mx: { xs: -2, sm: -3, md: -4 },
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 128,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <SearchBar heroHeight={120} />
      </Box>
    </Box>
  );
};