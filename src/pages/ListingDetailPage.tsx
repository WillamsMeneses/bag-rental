import React from 'react';
import { Box, Typography, Grid, Chip, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useListingDetail } from '@/hooks/useListingDetail';
import { PhotoCarousel } from '@/components/sections/listing/PhotoCarousel';
import { ClubsTable } from '@/components/sections/listing/ClubsTable';
import { RentalPanel } from '@/components/sections/listing/RentalPanel';

const HAND_LABEL: Record<string, string> = { left_handed: 'Left-handed', right_handed: 'Right-handed' };
const GENDER_LABEL: Record<string, string> = { male: 'For Men', female: 'For Women' };

export const ListingDetailPage: React.FC = () => {
  const { listing, isLoading, error } = useListingDetail();

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !listing) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Listing not found.</Typography>
      </Box>
    );
  }

  const location = [listing.city, listing.state].filter(Boolean).join(', ');

  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ mb: 1 }}>
          {listing.title} ({listing.clubs.length} clubs)
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={HAND_LABEL[listing.hand] ?? listing.hand} variant="outlined" color="success" size="small" />
          <Chip label={GENDER_LABEL[listing.gender] ?? listing.gender} variant="outlined" color="success" size="small" />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* ── Left column ──────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <PhotoCarousel photos={listing.photos} title={listing.title} />

          <Typography variant="h2" sx={{ mt: 2, display: { xs: 'block', md: 'none' } }}>
            $ {listing.pricePerDay.toFixed(2)} USD/day
          </Typography>

          <Box sx={{ mt: 3, p: 2, border: '0.5px solid', borderColor: 'grey.300', borderRadius: '8px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '0.5px solid', borderColor: 'grey.100' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Owner</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Mark McAllister</Typography>
              </Box>
            </Box>
            {location && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '0.5px solid', borderColor: 'grey.100' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Location</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{location}</Typography>
                </Box>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Rate</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>4.5 (120)</Typography>
              </Box>
            </Box>
          </Box>

          {listing.description && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h3" sx={{ mb: 1 }}>Description</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {listing.description}
              </Typography>
            </Box>
          )}

          <ClubsTable clubs={listing.clubs} />
        </Grid>

        {/* ── Right column — UNA SOLA instancia del RentalPanel ─────────── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 80 }, mt: { xs: 4, md: 0 } }}>
            <Typography variant="h2" sx={{ mb: 3, display: { xs: 'none', md: 'block' } }}>
              $ {listing.pricePerDay.toFixed(2)} USD/day
            </Typography>
            <RentalPanel
              pricePerDay={listing.pricePerDay}
              listingId={listing.id}
              listing={{
                title: listing.title,
                pricePerDay: listing.pricePerDay,
                hand: listing.hand,
                photos: listing.photos,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListingDetailPage;