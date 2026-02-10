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
import { Card } from './Card';
import { CardHeader } from './CardHeader';
import { CardContent } from './CardContent';
import { CardAction } from './CardAction';
import type { ListingCardProps } from './types';

// Placeholder image para cuando no hay fotos
const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=300&fit=crop';

export const ListingCard: React.FC<ListingCardProps> = ({
  id,
  title,
  pricePerDay,
  photos,
  hand,
  isPublished,
  onEdit,
  onPause,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(id);
    handleMenuClose();
  };

  const handlePause = () => {
    onPause?.(id);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(id);
    handleMenuClose();
  };

  const formatHand = (hand: string) => {
    return hand === 'left_handed' ? 'Left-handed' : 'Right-handed';
  };

  return (
    <Card>
      <CardHeader>
        {/* Image with carousel indicators */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="240"
            image={photos[0] || PLACEHOLDER_IMAGE}
            alt={title}
            sx={{
              objectFit: 'cover',
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
                    backgroundColor: index === 0 ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Action menu (3 dots) */}
          <CardAction>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </CardAction>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handlePause}>Pause</MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </CardHeader>

      <CardContent>
        {/* Title */}
        <Typography
          variant="h3"
        >
          {title}
        </Typography>

        {/* Hand tag */}
        <Box sx={{ mb: 2 }}>
          {/* <Tag
            label={formatHand(hand)}
            variant={isPublished ? 'success' : 'default'}
          /> */}
          <Chip  label={formatHand(hand)}
            variant='outlined'  color={isPublished ? 'success' : 'default'} />
        </Box>

        {/* Price */}
        <Typography
         variant='subtitle1'
        >
          $ {pricePerDay.toFixed(2)} USD/day
        </Typography>
      </CardContent>
    </Card>
  );
};