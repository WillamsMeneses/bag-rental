import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { GenericDrawer } from '@/components/ui/GenericDrawer';

interface Props {
  open: boolean;
  onClose: () => void;
  status: 'success' | 'failed' | 'processing';
  onKeepLooking: () => void;
  onViewRentals: () => void;
  onRetry?: () => void;
}

export const PaymentResultDrawer: React.FC<Props> = ({
  open, onClose, status, onKeepLooking, onViewRentals, onRetry,
}) => {
  return (
    <GenericDrawer open={open} onClose={onClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 4 }}>
        <Typography sx={{ fontFamily: '"Rubik", sans-serif', fontSize: '22px', fontWeight: 700, letterSpacing: '0.15em', mb: 4, color: 'text.primary' }}>
          BAG CHATTER
        </Typography>

        {status === 'success' && (
          <>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
            <Typography variant="h3" fontWeight={700} mb={1.5}>
              Your rental request has been successfully submitted
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              Your request is currently awaiting the owner's approval. Once approved, the chat feature will be activated, allowing you to coordinate the pick-up location for the equipment.
            </Typography>
          </>
        )}

        {status === 'processing' && (
          <>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'warning.main', mb: 3 }} />
            <Typography variant="h3" fontWeight={700} mb={1.5}>
              Payment processing...
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              We'll confirm your rental shortly.
            </Typography>
          </>
        )}

        {status === 'failed' && (
          <>
            <CancelIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
            <Typography variant="h3" fontWeight={700} mb={1.5}>
              Unable to process your rental request
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              Please check the entered data and try again later. If the issue persists, contact our customer service for assistance.
            </Typography>
          </>
        )}
      </Box>

      {/* Actions al fondo via el drawer */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
        {status === 'success' && (
          <>
            <Button variant="contained" color="primary" fullWidth onClick={onKeepLooking} sx={{ py: 1.5 }}>
              Keep looking for golf clubs!
            </Button>
            <Button variant="text" color="secondary" fullWidth onClick={onViewRentals} sx={{ fontWeight: 600 }}>
              Go to "My Rentals"
            </Button>
          </>
        )}
        {status === 'processing' && (
          <Button variant="contained" fullWidth onClick={onViewRentals} sx={{ py: 1.5 }}>
            View my rentals
          </Button>
        )}
        {status === 'failed' && (
          <>
            {onRetry && (
              <Button variant="contained" fullWidth onClick={onRetry} sx={{ py: 1.5 }}>
                Try again
              </Button>
            )}
            <Button variant="text" color="secondary" fullWidth onClick={onViewRentals} sx={{ fontWeight: 600 }}>
              Customer service
            </Button>
          </>
        )}
      </Box>
    </GenericDrawer>
  );
};