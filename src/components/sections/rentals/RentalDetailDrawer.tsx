import {
  Box,
  Alert,
  Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { GenericDrawer } from '@/components/ui/GenericDrawer';
import { ListingMiniCard } from '@/components/ui/ListingMiniCard';
import type { RentalApiResponse } from '@/types/rental.types';
import { RentalStatus } from '@/types/rental.types';
import { formatRentalDate } from '@/utils/date.utils';
import { DetailRow } from '@/components/ui/DetailRow';

interface RentalDetailDrawerProps {
  rental: RentalApiResponse | null;
  onClose: () => void;
  onRentAgain?: (rental: RentalApiResponse) => void;
}

const STATUS_ALERT: Partial<Record<string, { message: string; severity: 'warning' | 'success' | 'info' | 'error' }>> = {
  [RentalStatus.PENDING_PAYMENT]: { message: 'Your rental request is pending owner approval.', severity: 'warning' },
  [RentalStatus.CONFIRMED]: { message: 'Your rental has been confirmed.', severity: 'success' },
  [RentalStatus.ACTIVE]: { message: 'Your rental is currently active.', severity: 'info' },
  [RentalStatus.CANCELLED_BY_RENTER]: { message: 'You cancelled this rental.', severity: 'error' },
  [RentalStatus.CANCELLED_BY_OWNER]: { message: 'The owner cancelled this rental.', severity: 'error' },
  [RentalStatus.EXPIRED]: { message: 'This rental request expired.', severity: 'error' },
};

export const RentalDetailDrawer = ({ rental, onClose, onRentAgain }: RentalDetailDrawerProps) => {
  if (!rental) return null;

  const { listing } = rental;
  const alert = STATUS_ALERT[rental.status];
  const isCompleted = rental.status === RentalStatus.COMPLETED;
  const location = listing.city && listing.state ? `${listing.city}, ${listing.state}` : '—';

  return (
    <GenericDrawer
      open={!!rental}
      onClose={onClose}
      title="Rental Information"
      width={400}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {alert && (
          <Alert severity={alert.severity} icon={<WarningAmberIcon />}>
            {alert.message}
          </Alert>
        )}

        <ListingMiniCard
          title={listing.title}
          pricePerDay={Number(listing.pricePerDay)}
          hand={listing.hand}
          photos={listing.photos}
        />

        {isCompleted && onRentAgain && (
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={() => onRentAgain(rental)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Rent again
          </Button>
        )}

        <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, px: 2 }}>
          <DetailRow label="Transaction ID" value={rental.paymentIntentId ?? '—'} />
          <DetailRow label="Owner" value={rental.owner.email} />
          <DetailRow label="Location" value={location} />
          <DetailRow label="Number of days" value={rental.totalDays} />
          <DetailRow label="From" value={formatRentalDate(rental.startDate)} />
          <DetailRow label="To" value={formatRentalDate(rental.endDate)} />
          <DetailRow label="Price per day" value={`$ ${Number(rental.pricePerDay).toFixed(2)}`} />
          <DetailRow label="Total" value={`$ ${Number(rental.totalAmount).toFixed(2)}`} />
        </Box>
      </Box>
    </GenericDrawer>
  );
};