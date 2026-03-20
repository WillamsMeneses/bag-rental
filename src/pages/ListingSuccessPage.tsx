import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import type { BagListing } from '@/types/listing.types';
import { ListingMiniCard } from '@/components/ui/ListingMiniCard';

interface Props {
  listing: BagListing;
  isEdit?: boolean;
}

export const ListingSuccessPage: React.FC<Props> = ({ listing, isEdit = false }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Box sx={{ pt: 6, pb: 8, display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              width: '100%',
              border: '0.5px solid',
              borderColor: 'grey.200',
              borderRadius: '12px',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Logo */}
            <Typography
              sx={{
                fontFamily: '"Rubik", sans-serif',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'primary.main',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              BAG CHATTER
            </Typography>

            {/* Check icon */}
            <CheckCircleIcon
              sx={{
                fontSize: 72,
                color: 'primary.main',
                mb: 1,
              }}
            />

            {/* Messages */}
            <Typography
              variant="h4"
              sx={{ textAlign: 'center', color: 'text.primary', fontWeight: 500 }}
            >
              {isEdit
                ? 'Your listing has been\nsuccessfully updated!'
                : 'Your golf clubs have been\nsuccessfully listed!'}
            </Typography>

            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              {isEdit
                ? 'Your changes are now live on Bag Chatter.'
                : 'Thank you for choosing bag chatter.'}
            </Typography>

            {/* Listing card preview */}
            <ListingMiniCard
              title={listing.title}
              pricePerDay={Number(listing.pricePerDay)}
              hand={listing.hand}
              photos={listing.photos ?? []}
            />

            {/* Go to my listings */}
            <Button
              onClick={() => navigate('/my-listings')}
              disableRipple
              sx={{
                mt: 1,
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { background: 'transparent', textDecoration: 'underline' },
                background: 'transparent',
                boxShadow: 'none',
                fontSize: '15px',
              }}
            >
              Go to "My Listings"
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ListingSuccessPage;