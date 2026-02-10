import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FavoriteCard } from '@/components/cards';
import { useFavorites } from '@/hooks/useFavorites';
import { useAllListings } from '@/hooks/useAllListings';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { allListings, isLoadingAll } = useAllListings();
  const { toggleFavorite, isFavorited } = useFavorites();

  const handleCardClick = (id: string) => {
    navigate(`/listings/${id}`);
  };

  const handleToggleFavorite = async (id: string) => {
    await toggleFavorite(id);
  };

  if (isLoadingAll) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 4 }}>
        Browse Listings
      </Typography>

      {/* Empty State */}
      {allListings.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <Typography variant="h6" color="text.secondary">
            No listings available
          </Typography>
        </Box>
      )}

      {/* Listings Grid */}
      {allListings.length > 0 && (
        <Grid container spacing={3}>
          {allListings.map((listing) => (
            <Grid size={{ xs: 12, md: 4, sm: 6, lg: 3 }} key={listing.id}>
              <FavoriteCard
                id={listing.id}
                title={listing.title}
                pricePerDay={listing.pricePerDay}
                photos={listing.photos}
                hand={listing.hand}
                gender={listing.gender}
                rating={4.5} // Placeholder hasta que tengas reviews
                city={listing.city || undefined}
                state={listing.state || undefined}
                isFavorited={isFavorited(listing.id)}
                onToggleFavorite={handleToggleFavorite}
                onClick={handleCardClick}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};