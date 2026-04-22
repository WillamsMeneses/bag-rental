import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Rating,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import { useRentalRequestDetail } from '@/hooks/useRentalRequestDetail';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { DetailRow } from '@/components/ui/DetailRow';
import PageHeader from '@/components/ui/PageHeader';
import dayjs from 'dayjs';
import { ClubsTable } from '@/components/sections/listing/ClubsTable';

export default function RentalRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { rentalRequest, loading, error, isDenying, denyRental } = useRentalRequestDetail(id);

  const handleDeny = async () => {
    await denyRental();
  };

  const handleAccept = async () => {
    console.log('Accept:', id);
    // TODO: PATCH /rentals/:id/accept
  };

  if (loading) return <LoadingState message="Loading rental request..." />;
  if (error) return <EmptyState title="Error" description={error} />;
  if (!rentalRequest) return null;

  const { listing, renter } = rentalRequest;

  const avatarLetter = renter.firstName?.[0] ?? renter.email[0].toUpperCase();

  return (
    <Box>
      <PageHeader title="Rental Request" />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 4,
          alignItems: 'start',
        }}
      >
        {/* ── Left Column: Product (scrolls con la página) ── */}
        <Box>
          {/* Imagen principal */}
          <Box
            sx={{
              width: '100%',
              aspectRatio: '4/3',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'grey.100',
              mb: 2,
              position: 'relative',
            }}
          >
            {listing.photos[0] ? (
              <Box
                component="img"
                src={listing.photos[0]}
                alt={listing.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">No image</Typography>
              </Box>
            )}

            {/* Dots del carrusel */}
            {listing.photos.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.75,
                }}
              >
                {listing.photos.map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: i === 0 ? 'white' : 'rgba(255,255,255,0.5)',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Título + badge */}
          <Typography variant="h3" sx={{ mb: 1 }}>
            {listing.title}
          </Typography>

          <Chip
            label={listing.hand === 'left_handed' ? 'Left-handed' : 'Right-handed'}
            size="small"
            variant="outlined"
            color="success"
            sx={{ mb: 2, borderRadius: 1 }}
          />

          {/* Descripción */}
          <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {listing.description || 'No description provided.'}
          </Typography>

          {/* Club Details — usa el componente existente */}
          {listing.clubs && listing.clubs.length > 0 && (
            <ClubsTable clubs={listing.clubs} />
          )}
        </Box>

        {/* ── Center Column: Renter's Information (sticky) ── */}
        <Box sx={{ position: 'sticky', top: 24 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Renter's Information
          </Typography>

          {/* Avatar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              src={renter.avatarUrl ?? undefined}
              sx={{ width: 80, height: 80, fontSize: 32 }}
            >
              {avatarLetter}
            </Avatar>
          </Box>

          <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, px: 2 }}>
            <DetailRow label="Name" value={renter.firstName || '—'} />
            <DetailRow label="Last Name" value={renter.lastName || '—'} />
            <DetailRow label="Email" value={renter.email} />
            <DetailRow label="Location" value={renter.location || '—'} />
            <DetailRow
              label="Rate"
              value={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={4.5} readOnly size="small" precision={0.5} />
                  <Typography variant="body2" fontWeight={600}>
                    4.5 (120)
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Box>

        {/* ── Right Column: Request Details (sticky) ── */}
        <Box sx={{ position: 'sticky', top: 24 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Request Details
          </Typography>

          <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, px: 2, mb: 3 }}>
            <DetailRow
              label="From"
              value={dayjs(rentalRequest.startDate).format('MM/DD/YYYY')}
            />
            <DetailRow
              label="To"
              value={dayjs(rentalRequest.endDate).format('MM/DD/YYYY')}
            />
            <DetailRow
              label="Number of days"
              value={rentalRequest.totalDays}
            />
            <DetailRow
              label="Total price"
              value={`$ ${rentalRequest.totalAmount.toFixed(2)} USD`}
            />
            <DetailRow
              label="Commission fee"
              value={
                <Typography variant="body2" fontWeight={600} color="error.main">
                  -$ {rentalRequest.commissionFee.toFixed(2)} USD ({rentalRequest.commissionFeePercent}%)
                </Typography>
              }
            />
            <DetailRow
              label="Total you receive"
              value={`$ ${rentalRequest.totalYouReceive.toFixed(2)} USD`}
            />
          </Box>

          {(rentalRequest.canDeny || rentalRequest.canAccept) && (
            <Stack direction="row" spacing={2}>
              {rentalRequest.canDeny && (
                <Button
                  variant="text"
                  color="success"
                  fullWidth
                  onClick={handleDeny}
                  disabled={isDenying}
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {isDenying ? 'Denying...' : 'Deny'}
                </Button>
              )}
              {rentalRequest.canAccept && (
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={handleAccept}
                  sx={{ py: 1.5 }}
                >
                  Accept
                </Button>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}