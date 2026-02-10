import React from 'react';
import {
  Box,
  Typography,
  Rating,
  Stack,
  IconButton,
  CardMedia,
  Chip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Card } from './Card';
import { CardHeader } from './CardHeader';
import { CardContent } from './CardContent';
import { CardAction } from './CardAction';
import type { FavoriteCardProps } from './types';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=300&fit=crop';

export const FavoriteCard: React.FC<FavoriteCardProps> = ({
  id,
  title,
  pricePerDay,
  photos,
  hand,
  gender,
  rating,
  city,
  state,
  isFavorited,
  onToggleFavorite,
  onClick,
}) => {
  const formatHand = (hand: string) => {
    return hand === 'left_handed' ? 'Left-handed' : 'Right-handed';
  };

  const formatGender = (gender: string) => {
    return gender === 'male' ? 'For Men' : 'For Women';
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  const location = city && state ? `${city}, ${state}` : null;

  return (
    <Card onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
      <CardHeader>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="240"
            image={photos[0] || PLACEHOLDER_IMAGE}
            alt={title}
            sx={{
              objectFit: 'cover',
              backgroundColor: '#2d2d2d',
            }}
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
                    backgroundColor:
                      index === 0 ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Favorite button (top-left) */}
          <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
            <IconButton
              onClick={handleFavoriteToggle}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
              size="small"
            >
              {isFavorited ? (
                <FavoriteIcon sx={{ color: 'error.main' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Box>

          {/* Tags (top-right) */}
          <CardAction>
            <Stack direction="row" spacing={1}>
              <Chip
                label={formatHand(hand)}
                color="success"
                variant="outlined"
                size="small"
              />
              <Chip
                label={formatGender(gender)}
                color="success"
                variant="outlined"
                size="small"
              />
            </Stack>
          </CardAction>
        </Box>
      </CardHeader>

      <CardContent>
        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            fontSize: '1.25rem',
            mb: 1,
          }}
        >
          {title}
        </Typography>

        {/* Location */}
        {location && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ mb: 1 }}
          >
            <LocationOnOutlinedIcon
              sx={{ fontSize: 18, color: 'text.secondary' }}
            />
            <Typography variant="body2" color="text.secondary">
              {location}
            </Typography>
          </Stack>
        )}

        {/* Rating */}
        {rating && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ mb: 2 }}
          >
            <Rating value={rating} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              {rating.toFixed(1)}
            </Typography>
          </Stack>
        )}

        {/* Price */}
        <Typography
          variant="h5"
          component="p"
          sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
            color: 'text.primary',
          }}
        >
          $ {pricePerDay.toFixed(2)} USD/day
        </Typography>
      </CardContent>
    </Card>
  );
};