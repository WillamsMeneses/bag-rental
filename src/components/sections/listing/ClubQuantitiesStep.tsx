import React from 'react';
import { Box, Typography, IconButton, Button, Divider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import type { ClubQuantities } from '@/stores/createListingStore';

interface Props {
  quantities: ClubQuantities;
  onQuantityChange: (key: keyof ClubQuantities, value: number) => void;
  onContinue: () => void;
}

const CATEGORIES: { key: keyof ClubQuantities; label: string }[] = [
  { key: 'driver', label: 'Driver' },
  { key: 'wood', label: 'Wood' },
  { key: 'hybrid_rescue', label: 'Hybrid/Rescue' },
  { key: 'iron', label: 'Iron' },
  { key: 'wedge', label: 'Wedge' },
  { key: 'putter', label: 'Putter' },
];

const ClubQuantitiesStep: React.FC<Props> = ({ quantities, onQuantityChange, onContinue }) => {
  const handleDecrement = (key: keyof ClubQuantities) => {
    const current = quantities[key];
    if (current > 0) onQuantityChange(key, current - 1);
  };

  const handleIncrement = (key: keyof ClubQuantities) => {
    onQuantityChange(key, quantities[key] + 1);
  };

  const total = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 500, lineHeight: '32px' }}>
        Choose the category and quantity of clubs you would like to list.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {CATEGORIES.map(({ key, label }, index) => (
          <React.Fragment key={key}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: quantities[key] > 0 ? 'text.primary' : 'text.secondary',
                  fontWeight: quantities[key] > 0 ? 600 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton
                  onClick={() => handleDecrement(key)}
                  disabled={quantities[key] === 0}
                  size="small"
                  sx={{
                    p: 0,
                    color: quantities[key] === 0 ? 'grey.300' : 'grey.500',
                    '&:hover': { background: 'transparent', color: 'grey.700' },
                  }}
                  disableRipple
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 28 }} />
                </IconButton>

                <Typography
                  variant="body1"
                  sx={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: quantities[key] > 0 ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {quantities[key]}
                </Typography>

                <IconButton
                  onClick={() => handleIncrement(key)}
                  size="small"
                  sx={{
                    p: 0,
                    color: 'grey.500',
                    '&:hover': { background: 'transparent', color: 'primary.main' },
                  }}
                  disableRipple
                >
                  <AddCircleOutlineIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </Box>
            </Box>
            {index < CATEGORIES.length - 1 && <Divider sx={{ borderColor: 'grey.100' }} />}
          </React.Fragment>
        ))}
      </Box>

      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onContinue}
          disabled={total === 0}
          sx={{ width: 300, py: 1.5 }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default ClubQuantitiesStep;