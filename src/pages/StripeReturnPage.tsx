import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '@/stores/toastStore';

export const StripeReturnPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToastStore();

  useEffect(() => {
    success('Stripe account connected successfully!');
    navigate('/');
  }, []);

  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <CircularProgress color="primary" />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Completing Stripe setup...
      </Typography>
    </Box>
  );
};