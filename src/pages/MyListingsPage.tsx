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

export const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
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
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{
          mb: 4,
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
          },
          '& .MuiTabs-root': {
            boxShadow: 'none',
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            color: 'text.secondary',
            fontSize: '1rem',
            p: 0,
            mr: 4,
            minWidth: 'unset',
            '&.Mui-selected': {
              color: 'text.primary',
              fontWeight: 600,
            },
          },
          '& .MuiTabs-flexContainer': {
            gap: 0,
          },
        }}
        TabIndicatorProps={{
          style: { bottom: 0 }
        }}
      >
        <Tab label="Active Listings" disableRipple />
        <Tab label="Rented Now" disableRipple />
        <Tab label="Paused Listings" disableRipple />
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