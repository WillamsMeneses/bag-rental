import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import type { Dayjs } from 'dayjs';
import { GenericDrawer } from '@/components/ui/GenericDrawer';
import { ListingMiniCard } from '@/components/ui/ListingMiniCard';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  listing: { title: string; pricePerDay: number; hand: string; photos: string[] };
  startDate: Dayjs;
  endDate: Dayjs;
  totalDays: number;
  totalPrice: number;
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.25, borderBottom: '0.5px solid', borderColor: 'grey.100' }}>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
  </Box>
);

export const RentalConfirmDrawer: React.FC<Props> = ({
  open, onClose, onConfirm, isSubmitting, listing, startDate, endDate, totalDays, totalPrice,
}) => {
  return (
    <GenericDrawer
      open={open}
      onClose={onClose}
      title="Confirm Your Rental"
      actions={
        <Button variant="contained" color="primary" fullWidth onClick={onConfirm} disabled={isSubmitting} sx={{ py: 1.5 }}>
          {isSubmitting ? 'Processing...' : 'Send rental request'}
        </Button>
      }
    >
      <ListingMiniCard {...listing} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>Product details</Typography>
      <Box sx={{ border: '0.5px solid', borderColor: 'grey.200', borderRadius: '8px', px: 2, py: 0.5 }}>
        <DetailRow label="Number of days" value={String(totalDays)} />
        <DetailRow label="From" value={startDate.format('MMMM D of YYYY')} />
        <DetailRow label="To" value={endDate.format('MMMM D of YYYY')} />
        <DetailRow label="Price per day" value={`$ ${Number(listing.pricePerDay).toFixed(2)}`} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.25 }}>
          <Typography variant="body2" fontWeight={700}>Total price</Typography>
          <Typography variant="body2" fontWeight={700}>$ {totalPrice.toFixed(2)}</Typography>
        </Box>
      </Box>
    </GenericDrawer>
  );
};