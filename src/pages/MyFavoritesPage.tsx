import { Box, Grid, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import { FavoriteCard } from '@/components/cards';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavoritesPage } from '@/hooks/useFavorites';

export default function MyFavoritesPage() {
  const navigate = useNavigate();
  const { favorites, loading, pagination, setPage, toggleFavorite } = useFavoritesPage();

  if (loading) return <LoadingState message="Loading favorites..." />;

  return (
    <Box>
      <PageHeader title="Favorites" />

      {favorites.length === 0 && (
        <EmptyState
          title="No favorites yet"
          description="Listings you favorite will appear here."
          icon={<FavoriteBorderIcon sx={{ fontSize: 48 }} />}
        />
      )}

      {favorites.length > 0 && (
        <>
          <Grid container spacing={3}>
            {favorites.map((listing) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={listing.id}>
                <FavoriteCard
                  id={listing.id}
                  title={listing.title}
                  pricePerDay={listing.pricePerDay}
                  photos={listing.photos}
                  hand={listing.hand}
                  gender={listing.gender}
                  rating={4.5}
                  city={listing.city ?? undefined}
                  state={listing.state ?? undefined}
                  isFavorited={true}
                  onToggleFavorite={toggleFavorite}
                  onClick={(id) => navigate(`/listings/${id}`)}
                />
              </Grid>
            ))}
          </Grid>

          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={(_, p) => setPage(p)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}