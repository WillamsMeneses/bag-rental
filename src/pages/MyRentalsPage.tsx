import { Box, Grid, Typography} from '@mui/material';
import PageHeader from '@/components/ui/PageHeader';
import { useMyRentals } from '@/hooks/useMyRentals';
import { RentalStatus, type RentalApiResponse } from '@/types/rental.types';
import { RentalCard } from '@/components/cards/RentalCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';

const toCardStatus = (status: RentalApiResponse['status']): 'pending' | 'active' | 'completed' => {
  if (status === RentalStatus.CONFIRMED || status === RentalStatus.ACTIVE) return 'active';
  if (status === RentalStatus.COMPLETED) return 'completed';
  return 'pending';
};

export default function MyRentalsPage() {
  const { groups, loading, error } = useMyRentals();

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
                  status={toCardStatus(rental.status)}
                  onReportProblem={(id) => console.log('report', id)}
                  rating={1}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}