import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GenericDialog } from '@/components/ui/GenericDialog';

interface RentalSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  onKeepLooking: () => void;
}

export const RentalSuccessDialog: React.FC<RentalSuccessDialogProps> = ({
  open,
  onClose,
  onKeepLooking,
}) => {
  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      showCloseButton
      maxWidth="xs"
      actions={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onKeepLooking}
            sx={{ py: 1.5 }}
          >
            Keep looking for golf clubs!
          </Button>
          <Button
            variant="text"
            color="secondary"
            fullWidth
            onClick={onClose}
            sx={{ py: 1, fontWeight: 600 }}
          >
            Go to "My Rentals"
          </Button>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 3 }}>
        {/* Logo */}
        <Typography sx={{ fontFamily: '"Rubik", sans-serif', fontSize: '22px', fontWeight: 700, letterSpacing: '0.15em', mb: 3, color: 'text.primary' }}>
          BAG CHATTER
        </Typography>

        {/* Check icon */}
        <CheckCircleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />

        {/* Title */}
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5 }}>
          Your rental request has been successfully submitted
        </Typography>

        {/* Description */}
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
          Your request is currently awaiting the owner's approval. Once approved, the chat feature will be activated, allowing you to coordinate the pick-up location for the equipment.
        </Typography>
      </Box>
    </GenericDialog>
  );
};