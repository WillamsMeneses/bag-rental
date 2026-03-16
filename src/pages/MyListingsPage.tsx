import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
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
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';

export const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const {
    listings,
    isLoading,
    isTabLoading,
    handleEditListing,
    handlePauseListing,
    handleDeleteListing,
    fetchMyListingsByTab,
  } = useMyListings();

  const handleCreateNew = () => {
    navigate('/create-listing');
  };

  const TAB_STATUS: ListingStatus[] = [
    ListingStatus.ACTIVE,   // tab 0 - Active Listings
    ListingStatus.RENTED,   // tab 1 - Rented Now  ← estaba PAUSED
    ListingStatus.PAUSED,   // tab 2 - Paused Listings
  ];
  const TAB_LABELS: Record<ListingStatus, string> = {
    [ListingStatus.ACTIVE]: 'active listings',
    [ListingStatus.RENTED]: 'rented listings',
    [ListingStatus.PAUSED]: 'paused listings',
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    fetchMyListingsByTab(1, TAB_STATUS[newValue]); // ← usa el nuevo
  };

  if (isLoading) {
    return <LoadingState message="Loading your listings..." />;
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

      {/* Listings Grid */}
      {isTabLoading ? (
        <LoadingState message={`Loading ${TAB_LABELS[TAB_STATUS[activeTab]]}...`} minHeight="50vh" />
      ) : listings.length === 0 ? (
        activeTab === 0 ? (
          <EmptyState
            title="No listings yet"
            description="Create your first listing to start renting your golf clubs"
            action={{ label: 'Create Listing', onClick: handleCreateNew, icon: <AddIcon /> }}
          />
        ) : (
          <EmptyState
            title={`No ${TAB_LABELS[TAB_STATUS[activeTab]]}`}
          />
        )
      ) : (
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