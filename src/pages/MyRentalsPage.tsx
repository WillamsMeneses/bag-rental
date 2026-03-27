import { Box, Grid, Typography } from '@mui/material';
import PageHeader from '@/components/ui/PageHeader';
import { useMyRentals } from '@/hooks/useMyRentals';
import { RENTAL_CARD_STATUS } from '@/types/rental.types';
import { RentalCard } from '@/components/cards/RentalCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useRentalDetail } from '@/hooks/useRentalDetail';
import { RentalDetailDrawer } from '@/components/sections/rentals/RentalDetailDrawer';

export default function MyRentalsPage() {
  const { groups, loading, error } = useMyRentals();
  const { selectedRental, openDetail, closeDetail } = useRentalDetail();
  

  if (loading) return <LoadingState message="Loading rentals..." />;
  if (error) return <EmptyState title="Something went wrong" description={error} />;

  return (
    <Box sx={{}}>
      <PageHeader title="My Rentals" />

      {groups.length === 0 && (
        <Typography color="text.secondary">No rentals yet.</Typography>
      )}

      {groups.map((group) => (
        <Box key={group.label} sx={{ mb: 5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {group.label}
          </Typography>

          <Grid container spacing={2}>
            {group.rentals.map((rental) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={rental.id}>
                <RentalCard
                  id={rental.id}
                  title={rental.listing.title}
                  pricePerDay={Number(rental.listing.pricePerDay)}
                  photos={rental.listing.photos}
                  hand={rental.listing.hand}
                  city={rental.listing.city ?? undefined}
                  state={rental.listing.state ?? undefined}
                  status={RENTAL_CARD_STATUS[rental.status]}
                  onReportProblem={(id) => console.log('report', id)}
                  rating={1}
                  onClick={() => openDetail(rental)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      <RentalDetailDrawer
        rental={selectedRental}
        onClose={closeDetail}
        onRentAgain={(r) => console.log('rent again', r.id)}
      />
    </Box>
  );
}