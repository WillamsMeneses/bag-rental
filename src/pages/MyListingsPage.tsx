import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { ListingCard } from '@/components/cards';
import { useMyListings } from '@/hooks/useMyListings';

export const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    listings,
    isLoading,
    handleEditListing,
    handlePauseListing,
    handleDeleteListing,
  } = useMyListings();

  const handleCreateNew = () => {
    navigate('/listings/create');
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          My Listings
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Publish
        </Button>
      </Stack>

      {/* Tabs (Active/Rented/Paused) */}
      <Stack
        direction="row"
        spacing={3}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 4,
        }}
      >
        <Button
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'primary.main',
            borderBottom: 2,
            borderColor: 'primary.main',
            borderRadius: 0,
            pb: 1,
          }}
        >
          Active Listings
        </Button>
        <Button
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            color: 'text.secondary',
            borderRadius: 0,
            pb: 1,
          }}
        >
          Rented Now
        </Button>
        <Button
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            color: 'text.secondary',
            borderRadius: 0,
            pb: 1,
          }}
        >
          Paused Listings
        </Button>
      </Stack>

      {/* Empty State */}
      {listings.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No listings yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first listing to start renting your golf clubs
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 4,
            }}
          >
            Create Listing
          </Button>
        </Box>
      )}

      {/* Listings Grid */}
      {listings.length > 0 && (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid size={{ xs: 12, md: 4, sm: 6, lg: 3 }} key={listing.id}>
              <ListingCard
                id={listing.id}
                title={listing.title}
                pricePerDay={listing.pricePerDay}
                photos={listing.photos}
                hand={listing.hand}
                isPublished={listing.isPublished}
                onEdit={handleEditListing}
                onPause={handlePauseListing}
                onDelete={handleDeleteListing}
              />
            </Grid>
          ))}
        </Grid>
        
      )}
    </Container>
  );
};