import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import type { BagListing } from '@/types/listing.types';

const HAND_LABEL: Record<string, string> = {
  left_handed: 'Left-handed',
  right_handed: 'Right-handed',
};

interface Props {
  listing: BagListing;
  isEdit?: boolean;
}

export const ListingSuccessPage: React.FC<Props> = ({ listing, isEdit = false }) => {
  const navigate = useNavigate();

  const firstPhoto = listing.photos?.[0] ?? null;

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
            <Box
              sx={{
                width: '100%',
                border: '0.5px solid',
                borderColor: 'grey.200',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                mt: 1,
              }}
            >
              {/* Photo */}
              <Box
                sx={{
                  width: 100,
                  height: 88,
                  flexShrink: 0,
                  bgcolor: 'grey.100',
                  overflow: 'hidden',
                }}
              >
                {firstPhoto ? (
                  <Box
                    component="img"
                    src={firstPhoto}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                )}
              </Box>

              {/* Info */}
              <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {listing.title}
                </Typography>

                <Box
                  sx={{
                    display: 'inline-flex',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: '4px',
                    px: 0.75,
                    py: 0.25,
                    width: 'fit-content',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', fontWeight: 500, fontSize: '11px' }}
                  >
                    {HAND_LABEL[listing.hand] ?? listing.hand}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  $ {Number(listing.pricePerDay).toFixed(0)} USD/day
                </Typography>
              </Box>
            </Box>

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