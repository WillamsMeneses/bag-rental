import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useToastStore } from '@/stores/toastStore';
import { useStripeOnboarding } from '@/hooks/useStripeOnboarding';

export const StripeRefreshPage: React.FC = () => {
  const { error } = useToastStore();
  const { handleConnectStripe } = useStripeOnboarding();

  useEffect(() => {
    error('Session expired — restarting Stripe setup...');
    handleConnectStripe();
  }, []);

  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <CircularProgress color="primary" />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Restarting Stripe setup...
      </Typography>
    </Box>
  );
};