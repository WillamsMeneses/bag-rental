import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { ListingCard } from '@/components/cards';
import { useMyListings } from '@/hooks/useMyListings';
import PageHeader from '@/components/ui/PageHeader';
import { ListingStatus } from '@/types/listing.types';

export const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const {
    listings,
    isLoading,
    handleEditListing,
    handlePauseListing,
    handleDeleteListing,
    fetchMyListings
  } = useMyListings();

  const handleCreateNew = () => {
    navigate('/listings/create');
  };

  const TAB_STATUS: ListingStatus[] = [
    ListingStatus.ACTIVE,   // tab 0 - Active Listings
    ListingStatus.RENTED,   // tab 1 - Rented Now  ← estaba PAUSED
    ListingStatus.PAUSED,   // tab 2 - Paused Listings
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    fetchMyListings(1, TAB_STATUS[newValue]);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="My Listings"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateNew}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
            Publish
          </Button>
        }
      />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        // onChange={(_, newValue) => setActiveTab(newValue)}
        onChange={handleTabChange}
        sx={{
          mb: 4,
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
          },
          '& .MuiTab-root': {
            p: 0,
            mr: 4,
            minWidth: 'unset',
            '&.Mui-selected': {
              color: 'text.primary',
            },
          },
        }}
      >
        <Tab label={<Typography variant="subtitle1">Active Listings</Typography>} disableRipple />
        <Tab label={<Typography variant="subtitle1">Rented Now</Typography>} disableRipple />
        <Tab label={<Typography variant="subtitle1">Paused Listings</Typography>} disableRipple />
      </Tabs>

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
            sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
          >
            Create Listing
          </Button>
        </Box>
      )}

      {/* Listings Grid */}
      {listings.length > 0 && (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={listing.id}>
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
    </Box>
  );
};