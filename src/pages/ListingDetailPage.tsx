import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useListingDetail } from '@/hooks/useListingDetail';
import { useRental } from '@/hooks/useRental';
import type { Club } from '@/types/listing.types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HAND_LABEL: Record<string, string> = {
  left_handed: 'Left-handed',
  right_handed: 'Right-handed',
};

const GENDER_LABEL: Record<string, string> = {
  male: 'For Men',
  female: 'For Women',
};

const FLEX_LABEL: Record<string, string> = {
  ladies: 'Ladies',
  senior: 'Senior',
  regular: 'Regular',
  stiff: 'Stiff',
  x_stiff: 'X Stiff',
  xx_stiff: 'XX Stiff',
};

const getClubAdditionalDetails = (club: Club): string => {
  const parts: string[] = [];
  if (club.flex) parts.push(FLEX_LABEL[club.flex] ?? club.flex);
  if (club.loft) parts.push(`Loft ${club.loft}°`);
  if (club.woodDetail) parts.push(`${club.woodDetail.woodType} wood`);
  if (club.hybridDetail) parts.push(`#${club.hybridDetail.hybridNumber}`);
  if (club.ironDetail) parts.push(`${club.ironDetail.ironNumber} iron`);
  if (club.wedgeDetail) parts.push(`${club.wedgeDetail.wedgeType} wedge`);
  if (club.putterDetail?.putterTypes?.length) parts.push(club.putterDetail.putterTypes.join(', '));
  if (club.shaftType) parts.push(club.shaftType);
  return parts.join('  ');
};

const formatCategory = (category: string): string => {
  const map: Record<string, string> = {
    driver: 'Driver',
    wood: 'Wood',
    hybrid_rescue: 'Hybrid',
    iron: 'Iron',
    wedge: 'Wedge',
    putter: 'Putter',
  };
  return map[category] ?? category;
};

// ─── Photo Carousel ───────────────────────────────────────────────────────────

const PLACEHOLDER = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&h=600&fit=crop';

const PhotoCarousel: React.FC<{ photos: string[]; title: string }> = ({ photos, title }) => {
  const [current, setCurrent] = useState(0);
  const images = photos.length > 0 ? photos : [PLACEHOLDER];

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <Box>
      {/* Main image */}
      <Box sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', bgcolor: 'grey.200' }}>
        <Box
          component="img"
          src={images[current]}
          alt={title}
          sx={{ width: '100%', height: { xs: 260, md: 420 }, objectFit: 'cover', display: 'block' }}
        />

        {/* Category badge */}
        <Box sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(0,0,0,0.55)', borderRadius: '6px', px: 1.5, py: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <IconButton onClick={prev} size="small" sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'white' } }}>
              <ArrowBackIosIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <IconButton onClick={next} size="small" sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'white' } }}>
              <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.5 }}>
            {images.map((_, i) => (
              <Box
                key={i}
                onClick={() => setCurrent(i)}
                sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i === current ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, overflowX: 'auto', pb: 0.5 }}>
          {images.map((src, i) => (
            <Box
              key={i}
              component="img"
              src={src}
              alt={`${title} ${i + 1}`}
              onClick={() => setCurrent(i)}
              sx={{
                width: 72,
                height: 56,
                objectFit: 'cover',
                borderRadius: '6px',
                flexShrink: 0,
                cursor: 'pointer',
                border: i === current ? '2px solid' : '2px solid transparent',
                borderColor: i === current ? 'primary.main' : 'transparent',
                transition: 'border-color 0.2s',
                opacity: i === current ? 1 : 0.7,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// ─── Rental Panel ─────────────────────────────────────────────────────────────

const RentalPanel: React.FC<{ pricePerDay: number }> = ({ pricePerDay }) => {
  const { startDate, endDate, totalDays, totalPrice, handleDateChange } = useRental(pricePerDay);

  return (
    <Box sx={{ border: '0.5px solid', borderColor: 'grey.300', borderRadius: '12px', p: 3 }}>
      <Typography variant="h3" sx={{ mb: 0.5 }}>Select dates</Typography>

      {startDate && endDate && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {totalDays} {totalDays === 1 ? 'day' : 'days'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {startDate.format('MMM D of YYYY')} – {endDate.format('MMM D of YYYY')}
          </Typography>
        </Box>
      )}

      <Box sx={{
        mb: 3,
        '& .react-calendar': {
          width: '100%',
          border: 'none',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        },
        '& .react-calendar__navigation': {
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '8px',
        },
        '& .react-calendar__navigation button': {
          fontSize: '15px',
          fontWeight: 600,
          color: '#404040',
          minWidth: '36px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          '&:hover': { background: 'none' },
          '&:disabled': { background: 'none', opacity: 0.4 },
        },
        // Hide double arrows
        '& .react-calendar__navigation__prev2-button, & .react-calendar__navigation__next2-button': {
          display: 'none',
        },
        '& .react-calendar__month-view__weekdays': {
          textAlign: 'center',
          fontSize: '13px',
          color: '#737373',
          fontWeight: 600,
          marginBottom: '4px',
          '& abbr': { textDecoration: 'none' },
        },
        '& .react-calendar__tile': {
          padding: '10px 0',
          fontSize: '14px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: '#404040',
          position: 'relative',
          zIndex: 1,
          '&:hover': {
            background: 'rgba(137, 201, 106, 0.2)',
            borderRadius: '0',
          },
          '&:disabled': { color: '#ccc', cursor: 'default' },
        },
        // Today
        '& .react-calendar__tile--now': {
          background: 'none',
          '& abbr': {
            border: '1.5px solid #89C96A',
            borderRadius: '50%',
            padding: '3px 7px',
          },
        },
        // Range strip
        '& .react-calendar__tile--range': {
          background: '#E8F5E0',
          borderRadius: '0',
          borderTop: '1px solid #89C96A',
          borderBottom: '1px solid #89C96A',
          '&:hover': {
            background: '#dff0d4',
            borderRadius: '0',
          },
        },
        // Start of range
        '& .react-calendar__tile--rangeStart': {
          background: '#E8F5E0 !important',
          borderRadius: '50px 0 0 50px !important',
          borderTop: '1px solid #89C96A !important',
          borderBottom: '1px solid #89C96A !important',
          borderLeft: '1px solid #89C96A !important',
          '& abbr': { fontWeight: 700 },
        },
        // End of range
        '& .react-calendar__tile--rangeEnd': {
          background: '#E8F5E0 !important',
          borderRadius: '0 50px 50px 0 !important',
          borderTop: '1px solid #89C96A !important',
          borderBottom: '1px solid #89C96A !important',
          borderRight: '1px solid #89C96A !important',
          '& abbr': { fontWeight: 700 },
        },
        // Single day selected
        '& .react-calendar__tile--rangeBothEnds': {
          background: '#E8F5E0 !important',
          borderRadius: '50px !important',
          border: '1px solid #89C96A !important',
        },
        // Neighboring month
        '& .react-calendar__month-view__days__day--neighboringMonth': {
          color: '#ccc',
        },
        // Weekends
        '& .react-calendar__month-view__days__day--weekend': {
          color: '#ef4444',
        },
      }}>
        <Calendar
          selectRange
          value={startDate && endDate ? [startDate.toDate(), endDate.toDate()] : null}
          onChange={(value) => {
            if (Array.isArray(value) && value[0] && value[1]) {
              handleDateChange(dayjs(value[0]), dayjs(value[1]));
            }
          }}
          minDate={new Date()}
          locale="en-US"
        />
      </Box>

      {totalDays > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2">
              ${pricePerDay} × {totalDays} {totalDays === 1 ? 'day' : 'days'}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Total $ {totalPrice.toFixed(2)} USD
            </Typography>
          </Box>
        </>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={totalDays === 0}
        sx={{ py: 1.5 }}
      >
        {totalDays > 0 ? 'Rent now' : 'Select dates'}
      </Button>
    </Box>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

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
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Listing not found.
        </Typography>
      </Box>
    );
  }

  const location = [listing.city, listing.state].filter(Boolean).join(', ');

  return (
    <Box sx={{ pb: 8 }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
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

          {/* Price — shown below carousel on mobile */}
          <Typography variant="h2" sx={{ mt: 2, display: { xs: 'block', md: 'none' } }}>
            $ {listing.pricePerDay.toFixed(2)} USD/day
          </Typography>

          {/* Owner info */}
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

          {/* Description */}
          {listing.description && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h3" sx={{ mb: 1 }}>Description</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {listing.description}
              </Typography>
            </Box>
          )}

          {/* Clubs details table */}
          {listing.clubs.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>Clubs details</Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: '0.5px solid', borderColor: 'grey.300', borderRadius: '8px' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '13px' }}>Club Type</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '13px' }}>Brand</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '13px' }}>Model</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '13px' }}>Additional Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listing.clubs.map((club) => (
                      <TableRow key={club.id} sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={{ fontSize: '13px' }}>{formatCategory(club.category)}</TableCell>
                        <TableCell sx={{ fontSize: '13px' }}>{club.brand}</TableCell>
                        <TableCell sx={{ fontSize: '13px' }}>{club.model}</TableCell>
                        <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>{getClubAdditionalDetails(club)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Mobile rental panel */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 4 }}>
            <RentalPanel pricePerDay={listing.pricePerDay} />
          </Box>
        </Grid>

        {/* ── Right column — desktop only ───────────────────────────────── */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              $ {listing.pricePerDay.toFixed(2)} USD/day
            </Typography>
            <RentalPanel pricePerDay={listing.pricePerDay} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListingDetailPage;