import React from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Pagination,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FavoriteCard } from '@/components/cards';
import { useAllListings } from '@/hooks/useAllListings';
import AuthModal from '@/components/sections/auth/AuthModal';
import { useStripeOnboarding } from '@/hooks/useStripeOnboarding';
import { useAuthStore } from '@/stores/authStore';
import { useFavoritesPage } from '@/hooks/useFavorites';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { allListings, isLoadingAll, pagination, updateFavorite } = useAllListings();
  const { toggleFavorite } = useFavoritesPage();
  const { isAuthenticated } = useAuthStore();
  const { isConnected, isLoading, isCheckingStatus, handleConnectStripe } = useStripeOnboarding();

  const handleCardClick = (id: string) => {
    navigate(`/listings/${id}`);
  };

  const handleToggleFavorite = (id: string) => {
    const listing = allListings.find((l) => l.id === id);
    if (!listing) return;
    const newValue = !listing.isFavorite;
    updateFavorite(id, newValue);
    toggleFavorite(id).catch(() => {
      // Revert on failure
      updateFavorite(id, !newValue);
    });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    pagination.setPage(page);
  };

  if (isLoadingAll && allListings.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ my: '20px' }}>
        <AuthModal />

        {isAuthenticated && !isCheckingStatus && (
          <Button
            variant={isConnected ? 'outlined' : 'contained'}
            color={isConnected ? 'success' : 'primary'}
            onClick={isConnected ? undefined : handleConnectStripe}
            disabled={isLoading || isConnected}
            sx={{ py: 1, px: 2 }}
          >
            {isLoading
              ? 'Redirecting to Stripe...'
              : isConnected
                ? '✓ Stripe Connected'
                : 'Connect with Stripe'}
          </Button>
        )}
      </Box>

      <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 4 }}>
        Browse Listings
      </Typography>

      {allListings.length === 0 && !isLoadingAll && (
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

      {allListings.length > 0 && (
        <>
          <Grid container spacing={3}>
            {allListings.map((listing) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={listing.id}>
                <FavoriteCard
                  id={listing.id}
                  title={listing.title}
                  pricePerDay={listing.pricePerDay}
                  photos={listing.photos}
                  hand={listing.hand}
                  gender={listing.gender}
                  rating={4.5}
                  city={listing.city || undefined}
                  state={listing.state || undefined}
                  isFavorited={listing.isFavorite || false}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={handleCardClick}
                />
              </Grid>
            ))}
          </Grid>

          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};