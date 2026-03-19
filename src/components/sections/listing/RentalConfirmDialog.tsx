import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { GenericDialog } from '@/components/ui/GenericDialog';
import type { Dayjs } from 'dayjs';

interface RentalConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  listing: {
    title: string;
    pricePerDay: number;
    hand: string;
    photos: string[];
  };
  startDate: Dayjs;
  endDate: Dayjs;
  totalDays: number;
  totalPrice: number;
}

const HAND_LABEL: Record<string, string> = {
  left_handed: 'Left-handed',
  right_handed: 'Right-handed',
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&h=600&fit=crop';

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.25, borderBottom: '0.5px solid', borderColor: 'grey.100' }}>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{value}</Typography>
  </Box>
);

export const RentalConfirmDialog: React.FC<RentalConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isSubmitting,
  listing,
  startDate,
  endDate,
  totalDays,
  totalPrice,
}) => {
  const photo = listing.photos.length > 0 ? listing.photos[0] : PLACEHOLDER;

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      showCloseButton
      maxWidth="xs"
      title={
        <Box sx={{ px: 3, pt: 3, pb: 0 }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>Confirm Your Rental</Typography>
        </Box>
      }
      actions={
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onConfirm}
          disabled={isSubmitting}
          sx={{ py: 1.5 }}
        >
          {isSubmitting ? 'Processing...' : 'Send rental request'}
        </Button>
      }
    >
      {/* Listing card */}
      <Box sx={{ display: 'flex', gap: 2, p: 2, border: '0.5px solid', borderColor: 'grey.200', borderRadius: '8px', mb: 3 }}>
        <Box
          component="img"
          src={photo}
          alt={listing.title}
          sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
        />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, textTransform: 'uppercase' }}>
            {listing.title}
          </Typography>
          <Chip
            label={HAND_LABEL[listing.hand] ?? listing.hand}
            variant="outlined"
            color="success"
            size="small"
            sx={{ mb: 0.5 }}
          />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            $ {listing.pricePerDay.toFixed(2)} USD/day
          </Typography>
        </Box>
      </Box>

      {/* Product details */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Product details</Typography>
      <Box sx={{ border: '0.5px solid', borderColor: 'grey.200', borderRadius: '8px', px: 2, py: 0.5 }}>
        <DetailRow label="Number of days" value={String(totalDays)} />
        <DetailRow label="From" value={startDate.format('MMMM D of YYYY')} />
        <DetailRow label="To" value={endDate.format('MMMM D of YYYY')} />
        <DetailRow label="Price per day" value={`$ ${listing.pricePerDay.toFixed(2)}`} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.25 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Total price</Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>$ {totalPrice.toFixed(2)}</Typography>
        </Box>
      </Box>
    </GenericDialog>
  );
};