import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listingDetailsSchema, type ListingDetailsFormData } from '@/schemas/listingDetailsSchema';
import { useCreateListingStore } from '@/stores/createListingStore';
import { useImageUpload } from '@/hooks/useImageUpload';

// ─── Toggle button group ──────────────────────────────────────────────────────

interface ToggleGroupProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ options, value, onChange, error }) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    {options.map((opt) => {
      const selected = value === opt.value;
      return (
        <Button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          variant={selected ? 'contained' : 'outlined'}
          color={selected ? 'primary' : 'secondary'}
          size="small"
          sx={{
            borderRadius: '6px',
            px: 2,
            py: 0.5,
            fontSize: '14px',
            fontWeight: 500,
            minWidth: 'unset',
            ...(error && !selected && {
              border: '1px solid',
              borderColor: 'error.main',
            }),
          }}
          disableRipple
        >
          {opt.label}
        </Button>
      );
    })}
  </Box>
);

// ─── Photo upload thumbnail ───────────────────────────────────────────────────

const PhotoThumb: React.FC<{ src: string; onRemove: () => void }> = ({ src, onRemove }) => (
  <Box sx={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
    <Box
      component="img"
      src={src}
      sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
    />
    <IconButton
      onClick={onRemove}
      size="small"
      sx={{
        position: 'absolute',
        top: -8,
        right: -8,
        width: 20,
        height: 20,
        bgcolor: 'error.main',
        color: '#fff',
        p: 0,
        '&:hover': { bgcolor: 'error.dark' },
      }}
    >
      <CloseIcon sx={{ fontSize: 14 }} />
    </IconButton>
  </Box>
);

// ─── Main step ────────────────────────────────────────────────────────────────

interface Props {
  onNext: (data: Partial<ListingDetailsFormData>) => void;
  onPhotosChange?: (urls: string[]) => void;
  initialPhotos?: string[];
}

const ListingDetailsStep: React.FC<Props> = ({ onNext, onPhotosChange, initialPhotos = [] }) => {
  const { listingDetails } = useCreateListingStore();
  const [photoUrls, setPhotoUrls] = useState<string[]>(initialPhotos);
  const [useAccountAddress, setUseAccountAddress] = useState(false);
  const { fileInputRef, uploading: uploadingPhotos, handleClick: handlePhotoClick, handleChange: handlePhotoChange, multiple } =
    useImageUpload({
      multiple: true,
      onUpload: async (urls) => {
        const merged = [...photoUrls, ...urls].slice(0, MAX_PHOTOS);
        updatePhotos(merged);
      },
    });
  const MAX_PHOTOS = 5;

  const updatePhotos = (urls: string[]) => {
    setPhotoUrls(urls);
    onPhotosChange?.(urls);
  };

  useEffect(() => {
    setPhotoUrls(initialPhotos);
  }, [initialPhotos]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingDetailsFormData>({
    resolver: zodResolver(listingDetailsSchema),
    defaultValues: {
      title: listingDetails.title,
      description: listingDetails.description,
      pricePerDay: listingDetails.pricePerDay,
      gender: (listingDetails.gender as 'male' | 'female') || undefined,
      hand: (listingDetails.hand as 'left_handed' | 'right_handed') || undefined,
      street: listingDetails.street,
      zipCode: listingDetails.zipCode,
      state: listingDetails.state,
      city: listingDetails.city,
    },
  });

  const onSubmit = (data: ListingDetailsFormData) => {
    onNext(data);
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3, fontWeight: 500 }}>
        Listing Details
      </Typography>

      <form id="listing-details-form" onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 3, md: 5 },
            alignItems: 'start',
          }}
        >
          {/* ── Left column ──────────────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            {/* Photos */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>

              <Typography variant="h6" sx={{ mb: 1 }}>Photos</Typography>
              {photoUrls.map((src, i) => (
                <PhotoThumb
                  key={i}
                  src={src}
                  onRemove={() => updatePhotos(photoUrls.filter((_, idx) => idx !== i))}
                />
              ))}
              {photoUrls.length < MAX_PHOTOS && (
                <Box
                  onClick={uploadingPhotos ? undefined : handlePhotoClick}
                  sx={{
                    width: 72,
                    height: 72,
                    border: '1.5px dashed',
                    borderColor: uploadingPhotos ? 'grey.300' : 'grey.400',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: uploadingPhotos ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                    '&:hover': uploadingPhotos ? {} : { borderColor: 'primary.main', bgcolor: 'rgba(106,157,80,0.04)' },
                  }}
                >
                  {uploadingPhotos
                    ? <CircularProgress size={20} />
                    : <AddIcon sx={{ color: 'grey.400', fontSize: 24 }} />
                  }
                </Box>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
            </Box>

            {/* Title */}
            <Box>
              <Typography variant="h6" sx={{ mb: 0.5 }}>Listing Title</Typography>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth error={!!errors.title} helperText={errors.title?.message} />
                )}
              />
            </Box>

            {/* Price */}
            <Box>
              <Typography variant="h6" sx={{ mb: 0.5 }}>Price per day</Typography>
              <Controller
                name="pricePerDay"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="USD 0.00"
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    error={!!errors.pricePerDay}
                    helperText={errors.pricePerDay?.message}
                  />
                )}
              />
            </Box>

            {/* Gender */}
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>Gender</Typography>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <ToggleGroup
                    options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={!!errors.gender}
                  />
                )}
              />
              {errors.gender && (
                <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
                  {errors.gender.message}
                </Typography>
              )}
            </Box>

            {/* Hand */}
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>Hand</Typography>
              <Controller
                name="hand"
                control={control}
                render={({ field }) => (
                  <ToggleGroup
                    options={[
                      { value: 'left_handed', label: 'Left-handed' },
                      { value: 'right_handed', label: 'Right-handed' },
                    ]}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={!!errors.hand}
                  />
                )}
              />
              {errors.hand && (
                <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
                  {errors.hand.message}
                </Typography>
              )}
            </Box>

            {/* Description */}
            <Box>
              <Typography variant="h6" sx={{ mb: 0.5 }}>Description</Typography>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={5}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Box>
          </Box>

          {/* ── Right column ─────────────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 0.25, fontSize: '14px', fontWeight: 600, color: 'text.primary' }}>
                Location
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, fontSize: '13px' }}>
                Only your city and state will be visible to other users.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>Street</Typography>
                  <Controller
                    name="street"
                    control={control}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>Zip Code</Typography>
                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>State</Typography>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>City</Typography>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useAccountAddress}
                      onChange={(e) => setUseAccountAddress(e.target.checked)}
                      disableRipple
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                      Use the address registered in my account.
                    </Typography>
                  }
                  sx={{ alignItems: 'center', ml: 0, mt: 0.5 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </form>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          form="listing-details-form"
          variant="contained"
          color="primary"
          sx={{ width: 300, py: 1.5 }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default ListingDetailsStep;