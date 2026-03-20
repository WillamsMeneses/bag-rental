import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { rentalService } from '@/services/rental.service';

export const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const rentalId = searchParams.get('rentalId');
    const sessionId = searchParams.get('session_id');
    const returnUrl = sessionStorage.getItem('payment_return_url') || '/';

    if (!rentalId || !sessionId) { navigate('/'); return; }

    let attempts = 0;
    const maxAttempts = 10;

    const checkStatus = async () => {
      try {
        const rental = await rentalService.getRentalById(rentalId);
        if (rental.status === 'confirmed') {
          sessionStorage.removeItem('payment_return_url');
          navigate(returnUrl, { state: { paymentResult: 'success' } });
        } else if (rental.status === 'expired') {
          sessionStorage.removeItem('payment_return_url');
          navigate(returnUrl, { state: { paymentResult: 'failed' } });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 1000);
        } else {
          sessionStorage.removeItem('payment_return_url');
          navigate(returnUrl, { state: { paymentResult: 'processing' } });
        }
      } catch {
        sessionStorage.removeItem('payment_return_url');
        navigate(returnUrl, { state: { paymentResult: 'failed' } });
      }
    };

    checkStatus();
  }, [searchParams, navigate]);

  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
};