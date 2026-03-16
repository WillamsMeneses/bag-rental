import React, { useState } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { WoodClubForm } from '@/stores/createListingStore';
import type { SelectableEntry } from './EntrySelector';
import { woodClubSchema, type WoodClubFormData } from '@/schemas/listingDetailsSchema';
import ClubBaseForm from './ClubBaseForm';
import EntrySelector from './EntrySelector';

const WOOD_OPTIONS = [
  { label: '3 Wood', value: '3' },
  { label: '4 Wood', value: '4' },
  { label: '5 Wood', value: '5' },
  { label: '7 Wood', value: '7' },
  { label: '9 Wood', value: '9' },
];

interface Props {
  quantity: number;
  initial: WoodClubForm | null;
  onSave: (data: WoodClubForm) => void;
}

const WoodDetailsStep: React.FC<Props> = ({ quantity, initial, onSave }) => {
  const [entries, setEntries] = useState<SelectableEntry[]>(
    initial?.woodEntries.map((e) => ({ type: e.woodType, quantity: e.quantity })) ?? []
  );

  const methods = useForm<WoodClubFormData>({
    resolver: zodResolver(woodClubSchema),
    defaultValues: {
      brand: initial?.brand ?? '',
      model: initial?.model ?? '',
      flex: (initial?.flex as WoodClubFormData['flex']) || undefined,
      loft: initial?.loft ?? '',
      shaftType: (initial?.shaftType as WoodClubFormData['shaftType']) || undefined,
    },
  });

  const totalSelected = entries.reduce((sum, e) => sum + e.quantity, 0);
  const remaining = quantity - totalSelected;

  const handleSubmit = methods.handleSubmit((data) => {
    if (entries.length === 0) {
      // Allow saving even without specific types — at least one required
      return;
    }
    onSave({
      brand: data.brand,
      model: data.model,
      flex: data.flex,
      loft: data.loft,
      shaftType: data.shaftType || '',
      woodEntries: entries.map((e) => ({ woodType: e.type, quantity: e.quantity })),
    });
  });

  const canContinue = entries.length > 0 && totalSelected <= quantity;

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 500 }}>
        Provide additional information for the woods
      </Typography>

      <Box
        sx={{
          border: '0.5px solid',
          borderColor: 'grey.200',
          borderRadius: '8px',
          p: 2,
          mb: 3,
        }}
      >
        <FormProvider {...methods}>
          <form id="wood-base-form" onSubmit={handleSubmit}>
            <ClubBaseForm showShaftType={false} />
          </form>
        </FormProvider>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <EntrySelector
        options={WOOD_OPTIONS}
        entries={entries}
        onChange={setEntries}
        remaining={remaining}
      />

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          form="wood-base-form"
          variant="contained"
          color="primary"
          disabled={!canContinue}
          sx={{ width: 300, py: 1.5 }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default WoodDetailsStep;