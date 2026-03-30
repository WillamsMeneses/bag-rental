import React from 'react';
import {
  Box,
  Typography,
  Grid,
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
import { SearchBar } from '@/components/sections/home/SearchBar';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { allListings, isLoadingAll, pagination, updateFavorite } = useAllListings();
  const { toggleFavorite } = useFavoritesPage();
  const { isAuthenticated } = useAuthStore();
  const { isConnected, isLoading, isCheckingStatus, handleConnectStripe } = useStripeOnboarding();

  const isFirstLoad = isLoadingAll && allListings.length === 0;
  const isRefetching = isLoadingAll && allListings.length > 0;

  const handleCardClick = (id: string) => navigate(`/listings/${id}`);

  const handleToggleFavorite = (id: string) => {
    const listing = allListings.find((l) => l.id === id);
    if (!listing) return;
    const newValue = !listing.isFavorite;
    updateFavorite(id, newValue);
    toggleFavorite(id).catch(() => updateFavorite(id, !newValue));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    pagination.setPage(page);
  };

  if (isFirstLoad) {
    return <LoadingState />;
  }

  return (
    <Box>
      <Box sx={{ my: '20px' }}>
        <AuthModal />

        <Box sx={{ position: 'relative' }}>
          <Box sx={{ height: 200 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: -4, width: '100%' }}>
            <SearchBar heroHeight={420} />
          </Box>
        </Box>

        {isAuthenticated && !isCheckingStatus && (
          <Button
            variant={isConnected ? 'outlined' : 'contained'}
            color={isConnected ? 'success' : 'primary'}
            onClick={isConnected ? undefined : handleConnectStripe}
            disabled={isLoading || isConnected}
            sx={{ py: 1, px: 2 }}
          >
            {isLoading ? 'Redirecting to Stripe...' : isConnected ? '✓ Stripe Connected' : 'Connect with Stripe'}
          </Button>
        )}
      </Box>

      <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 4 }}>
        Browse Listings
      </Typography>

      {/* ── Loading overlay al refetch (search/paginación) ── */}
      {isRefetching ? (
        <LoadingState minHeight="40vh" />
      ) : allListings.length === 0 ? (
        <EmptyState
          title="No listings available"
          description="Try adjusting your search filters"
          minHeight="40vh"
        />
      ) : (
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