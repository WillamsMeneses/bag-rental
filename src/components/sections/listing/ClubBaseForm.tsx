import React from 'react';
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  Checkbox,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

const FLEX_OPTIONS = [
  { value: 'ladies', label: 'Ladies' },
  { value: 'senior', label: 'Senior' },
  { value: 'regular', label: 'Regular' },
  { value: 'stiff', label: 'Stiff' },
  { value: 'x_stiff', label: 'X Stiff' },
  { value: 'xx_stiff', label: 'XX Stiff' },
];

interface ClubBaseFormProps {
  showShaftType?: boolean;
}

/**
 * Shared base fields for any club category.
 * Must be used inside a react-hook-form FormProvider.
 * Fields: brand, model, flex, loft, (optional) shaftType
 */
const ClubBaseForm: React.FC<ClubBaseFormProps> = ({ showShaftType = false }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Brand */}
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Brand*</Typography>
        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="e.g. Cobra"
              error={!!errors.brand}
              helperText={errors.brand?.message as string}
            />
          )}
        />
      </Box>

      {/* Model */}
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Model*</Typography>
        <Controller
          name="model"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="e.g. King F9"
              error={!!errors.model}
              helperText={errors.model?.message as string}
            />
          )}
        />
      </Box>

      {/* Flex */}
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Flex</Typography>
        <Controller
          name="flex"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.flex}>
              <Select
                {...field}
                displayEmpty
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderWidth: '0.5px', borderColor: 'grey.400' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderWidth: '0.5px', borderColor: 'grey.400' },
                  borderRadius: '4px',
                }}
              >
                <MenuItem value="" disabled>
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>Select flex</Typography>
                </MenuItem>
                {FLEX_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
              {errors.flex && <FormHelperText>{errors.flex.message as string}</FormHelperText>}
            </FormControl>
          )}
        />
      </Box>

      {/* Loft */}
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Loft</Typography>
        <Controller
          name="loft"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              placeholder="e.g. 10.5"
              inputProps={{ min: 0, step: 0.5 }}
              error={!!errors.loft}
              helperText={errors.loft?.message as string}
            />
          )}
        />
      </Box>

      {/* Shaft type (optional, shown for wood/hybrid/iron/wedge) */}
      {showShaftType && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Shaft</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {['steel', 'graphite'].map((shaft) => (
              <Controller
                key={shaft}
                name="shaftType"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 0.75,
                      borderBottom: '0.5px solid',
                      borderColor: 'grey.200',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.primary', textTransform: 'capitalize' }}>
                      {shaft.charAt(0).toUpperCase() + shaft.slice(1)}
                    </Typography>
                    <Checkbox
                      checked={field.value === shaft}
                      onChange={() => field.onChange(field.value === shaft ? '' : shaft)}
                      disableRipple
                    />
                  </Box>
                )}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ClubBaseForm;