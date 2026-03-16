import React, { useState } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  HybridClubForm,
  IronClubForm,
  WedgeClubForm,
  PutterClubForm,
} from '@/stores/createListingStore';
import {
  Typography as MuiTypography,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { SelectableEntry } from './EntrySelector';
import { hybridClubSchema, ironClubSchema, putterClubSchema, wedgeClubSchema, type HybridClubFormData, type IronClubFormData, type PutterClubFormData, type WedgeClubFormData } from '@/schemas/listingDetailsSchema';
import ClubBaseForm from './ClubBaseForm';
import EntrySelector from './EntrySelector';

// ─── HYBRID ───────────────────────────────────────────────────────────────────

const HYBRID_OPTIONS = [
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
];

interface HybridProps {
  quantity: number;
  initial: HybridClubForm | null;
  onSave: (data: HybridClubForm) => void;
}

export const HybridDetailsStep: React.FC<HybridProps> = ({ quantity, initial, onSave }) => {
  const [entries, setEntries] = useState<SelectableEntry[]>(
    initial?.hybridEntries.map((e) => ({ type: e.hybridNumber, quantity: e.quantity })) ?? []
  );

  const methods = useForm<HybridClubFormData>({
    resolver: zodResolver(hybridClubSchema),
    defaultValues: {
      brand: initial?.brand ?? '',
      model: initial?.model ?? '',
      flex: (initial?.flex as HybridClubFormData['flex']) || undefined,
      loft: initial?.loft ?? '',
      shaftType: (initial?.shaftType as HybridClubFormData['shaftType']) || undefined,
    },
  });

  const totalSelected = entries.reduce((sum, e) => sum + e.quantity, 0);
  const remaining = quantity - totalSelected;

  const handleSubmit = methods.handleSubmit((data) => {
    if (entries.length === 0) return;
    onSave({
      brand: data.brand,
      model: data.model,
      flex: data.flex,
      loft: data.loft,
      shaftType: data.shaftType || '',
      hybridEntries: entries.map((e) => ({ hybridNumber: e.type, quantity: e.quantity })),
    });
  });

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 500 }}>
        Provide additional information for the hybrid / rescue clubs
      </Typography>

      <Box sx={{ border: '0.5px solid', borderColor: 'grey.200', borderRadius: '8px', p: 2, mb: 3 }}>
        <FormProvider {...methods}>
          <form id="hybrid-base-form" onSubmit={handleSubmit}>
            <ClubBaseForm showShaftType={true} />
          </form>
        </FormProvider>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <EntrySelector
        options={HYBRID_OPTIONS}
        entries={entries}
        onChange={setEntries}
        remaining={remaining}
      />

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          form="hybrid-base-form"
          variant="contained"
          color="primary"
          disabled={entries.length === 0}
          sx={{ width: 300, py: 1.5 }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

// ─── IRON ─────────────────────────────────────────────────────────────────────

const IRON_OPTIONS = [
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: 'PW', value: 'PW' },
];

interface IronProps {
  quantity: number;
  initial: IronClubForm | null;
  onSave: (data: IronClubForm) => void;
}

export const IronDetailsStep: React.FC<IronProps> = ({ quantity, initial, onSave }) => {
  const [entries, setEntries] = useState<SelectableEntry[]>(
    initial?.ironEntries.map((e) => ({ type: e.ironNumber, quantity: e.quantity })) ?? []
  );

  const methods = useForm<IronClubFormData>({
    resolver: zodResolver(ironClubSchema),
    defaultValues: {
      brand: initial?.brand ?? '',
      model: initial?.model ?? '',
      flex: (initial?.flex as IronClubFormData['flex']) || undefined,
      loft: initial?.loft ?? '',
      shaftType: (initial?.shaftType as IronClubFormData['shaftType']) || undefined,
    },
  });

  const totalSelected = entries.reduce((sum, e) => sum + e.quantity, 0);
  const remaining = quantity - totalSelected;

  const handleSubmit = methods.handleSubmit((data) => {
    if (entries.length === 0) return;
    onSave({
      brand: data.brand,
      model: data.model,
      flex: data.flex,
      loft: data.loft,
      shaftType: data.shaftType || '',
      ironEntries: entries.map((e) => ({ ironNumber: e.type, quantity: e.quantity })),
    });
  });

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 500 }}>
        Provide additional information for the irons
      </Typography>

      <Box sx={{ border: '0.5px solid', borderColor: 'grey.200', borderRadius: '8px', p: 2, mb: 3 }}>
        <FormProvider {...methods}>
          <form id="iron-base-form" onSubmit={handleSubmit}>
            <ClubBaseForm showShaftType={true} />
          </form>
        </FormProvider>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <EntrySelector
        options={IRON_OPTIONS}
        entries={entries}
        onChange={setEntries}
        remaining={remaining}
      />

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          form="iron-base-form"
          variant="contained"
          color="primary"
          disabled={entries.length === 0}
          sx={{ width: 300, py: 1.5 }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

// ─── WEDGE ────────────────────────────────────────────────────────────────────

const WEDGE_OPTIONS = [
  { label: 'Pitching Wedge', value: 'pitching' },
  { label: 'Gap Wedge', value: 'gap' },
  { label: 'Sand Wedge', value: 'sand' },
  { label: 'Lob Wedge', value: 'lob' },
];

interface WedgeProps {
  quantity: number;
  initial: WedgeClubForm | null;
  onSave: (data: WedgeClubForm) => void;
}

export const WedgeDetailsStep: React.FC<WedgeProps> = ({ quantity, initial, onSave }) => {
  const [entries, setEntries] = useState<SelectableEntry[]>(
    initial?.wedgeEntries.map((e) => ({ type: e.wedgeType, quantity: e.quantity })) ?? []
  );

  const methods = useForm<WedgeClubFormData>({
    resolver: zodResolver(wedgeClubSchema),
    defaultValues: {
      brand: initial?.brand ?? '',
      model: initial?.model ?? '',
      flex: (initial?.flex as WedgeClubFormData['flex']) || undefined,
      loft: initial?.loft ?? '',
      shaftType: (initial?.shaftType as WedgeClubFormData['shaftType']) || undefined,
    },
  });

  const totalSelected = entries.reduce((sum, e) => sum + e.quantity, 0);
  const remaining = quantity - totalSelected;

  const handleSubmit = methods.handleSubmit((data) => {
    if (entries.length === 0) return;
    onSave({
      brand: data.brand,
      model: data.model,
      flex: data.flex,
      loft: data.loft,
      shaftType: data.shaftType || '',
      wedgeEntries: entries.map((e) => ({ wedgeType: e.type, quantity: e.quantity })),
    });
  });

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 500 }}>
        Provide additional information for the wedges
      </Typography>

      <Box sx={{ border: '0.5px solid', borderColor: 'grey.200', borderRadius: '8px', p: 2, mb: 3 }}>
        <FormProvider {...methods}>
          <form id="wedge-base-form" onSubmit={handleSubmit}>
            <ClubBaseForm showShaftType={true} />
          </form>
        </FormProvider>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <EntrySelector
        options={WEDGE_OPTIONS}
        entries={entries}
        onChange={setEntries}
        remaining={remaining}
      />

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          form="wedge-base-form"
          variant="contained"
          color="primary"
          disabled={entries.length === 0}
          sx={{ width: 300, py: 1.5 }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

// ─── PUTTER ───────────────────────────────────────────────────────────────────

const PUTTER_TYPE_OPTIONS = [
  { value: 'blade', label: 'Blade' },
  { value: 'mallet', label: 'Mallet' },
  { value: 'mid_mallet', label: 'Mid-mallet' },
  { value: 'center_shafted', label: 'Center-shafted' },
];

interface PutterProps {
  initial: PutterClubForm | null;
  onSave: (data: PutterClubForm) => void;
}

export const PutterDetailsStep: React.FC<PutterProps> = ({ initial, onSave }) => {
  const methods = useForm<PutterClubFormData>({
    resolver: zodResolver(putterClubSchema),
    defaultValues: {
      brand: initial?.brand ?? '',
      model: initial?.model ?? '',
      flex: (initial?.flex as PutterClubFormData['flex']) || undefined,
      loft: initial?.loft ?? '',
      putterType: initial?.putterType ?? '',
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = methods;

  const onSubmit = handleSubmit((data) => {
    onSave({
      brand: data.brand,
      model: data.model,
      flex: data.flex,
      loft: data.loft,
      putterType: data.putterType,
    });
  });

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 500 }}>
        Provide additional information for the putter
      </Typography>

      <Box sx={{ border: '0.5px solid', borderColor: 'grey.200', borderRadius: '8px', p: 2 }}>
        <FormProvider {...methods}>
          <form id="putter-base-form" onSubmit={onSubmit}>
            <ClubBaseForm showShaftType={false} />

            <Box sx={{ mt: 2 }}>
              <MuiTypography variant="h6" sx={{ mb: 0.5 }}>Putter Type*</MuiTypography>
              <Controller
                name="putterType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.putterType}>
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
                        <MuiTypography variant="body2" sx={{ color: 'text.disabled' }}>Select putter type</MuiTypography>
                      </MenuItem>
                      {PUTTER_TYPE_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                    {errors.putterType && (
                      <FormHelperText>{errors.putterType.message as string}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </form>
        </FormProvider>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          form="putter-base-form"
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