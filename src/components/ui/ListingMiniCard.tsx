import { Box, Typography, Chip } from '@mui/material';

const HAND_LABEL: Record<string, string> = {
  left_handed: 'Left-handed',
  right_handed: 'Right-handed',
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&h=600&fit=crop';

interface ListingMiniCardProps {
  title: string;
  pricePerDay: number;
  hand: string;
  photos: string[];
}

export const ListingMiniCard: React.FC<ListingMiniCardProps> = ({
  title, pricePerDay, hand, photos,
}) => {
  const photo = photos.length > 0 ? photos[0] : PLACEHOLDER;

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, border: '0.5px solid', borderColor: 'grey.200', borderRadius: '8px' }}>
      <Box
        component="img"
        src={photo}
        alt={title}
        sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
      />
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Chip
          label={HAND_LABEL[hand] ?? hand}
          variant="outlined"
          color="success"
          size="small"
          sx={{ mb: 0.5 }}
        />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          $ {Number(pricePerDay).toFixed(2)} USD/day
        </Typography>
      </Box>
    </Box>
  );
};