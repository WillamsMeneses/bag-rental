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

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=300&fit=crop';

const STATUS_STYLES: Record<string, { label: string; color: string; borderColor: string }> = {
  pending: { label: 'Pending', color: '#f59e0b', borderColor: '#f59e0b' },
  active: { label: 'Active', color: '#22c55e', borderColor: '#22c55e' },
  completed: { label: 'Completed', color: '#6b7280', borderColor: '#6b7280' },
};

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

  const statusStyle = STATUS_STYLES[status];
  const location = city && state ? `${city}, ${state}` : null;

  return (
    <Card>
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
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                border: `1.5px solid ${statusStyle.borderColor}`,
                backgroundColor: 'rgba(255,255,255,0.92)',
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ color: statusStyle.color }}
              >
                {statusStyle.label}
              </Typography>
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