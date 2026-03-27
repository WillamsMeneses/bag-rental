import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CardMedia,
  Stack,
  Chip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarIcon from '@mui/icons-material/Star';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Card } from './Card';
import { CardHeader } from './CardHeader';
import { CardContent } from './CardContent';
import { CardAction } from './CardAction';
import { CardBadge } from './CardBadge';
import type { RentalCardProps } from './types';
import { RENTAL_CARD_STATUS_CONFIG } from '@/types/rental.types';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=300&fit=crop';

const formatHand = (hand: string) =>
  hand === 'left_handed' ? 'Left-handed' : 'Right-handed';

export const RentalCard: React.FC<RentalCardProps> = ({
  id,
  title,
  pricePerDay,
  photos,
  hand,
  status,
  rating,
  city,
  state,
  onReportProblem,
  onClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleReportProblem = () => {
    onReportProblem?.(id);
    handleMenuClose();
  };

  const location = city && state ? `${city}, ${state}` : null;

  return (
    <Card onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
      <CardHeader>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="240"
            image={photos[0] || PLACEHOLDER_IMAGE}
            alt={title}
            sx={{ objectFit: 'cover' }}
          />

          {/* Carousel indicators */}
          {photos.length > 1 && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {photos.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index === 0 ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Status badge — top left */}
          <CardBadge>
            <Box sx={{ backdropFilter: 'blur(4px)', borderRadius: 2, display: 'inline-flex' }}>
              <Chip
                label={RENTAL_CARD_STATUS_CONFIG[status].label}
                color={RENTAL_CARD_STATUS_CONFIG[status].color}
                variant="outlined"
                size="small"
              />
            </Box>
          </CardBadge>

          {/* 3-dot menu — top right */}
          <CardAction>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                backgroundColor: 'rgba(0,0,0,0.35)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.55)' },
              }}
              size="small"
            >
              <MoreVertIcon sx={{ color: '#fff' }} />
            </IconButton>
          </CardAction>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleReportProblem} sx={{ color: 'success.main' }}>
              Report problem
            </MenuItem>
          </Menu>
        </Box>
      </CardHeader>

      <CardContent>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {title}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Chip label={formatHand(hand)} variant="outlined" color="success" />
        </Box>

        {location && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {location}
            </Typography>
          </Stack>
        )}

        {rating !== undefined && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 2 }}>
            <StarIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
            <Typography variant="body2" color="text.secondary">
              {rating.toFixed(1)}
            </Typography>
          </Stack>
        )}

        <Typography variant="subtitle1">
          $ {Number(pricePerDay).toFixed(2)} USD/day
        </Typography>
      </CardContent>
    </Card>
  );
};