import React, { useRef, useState } from 'react';
import { Box, Typography, Divider, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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

const ORDINALS = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'];

// ─── Single putter form (one accordion per putter) ────────────────────────────

interface SinglePutterFormProps {
  index: number;
  defaultValues: PutterClubForm;
  expanded: boolean;
  onToggle: () => void;
  onSave: (data: PutterClubFormData, index: number) => void;
}

const SinglePutterForm: React.FC<SinglePutterFormProps> = ({
  index,
  defaultValues,
  expanded,
  onToggle,
  onSave,
}) => {
  const methods = useForm<PutterClubFormData>({
    resolver: zodResolver(putterClubSchema),
    defaultValues: {
      brand: defaultValues.brand,
      model: defaultValues.model,
      flex: (defaultValues.flex as PutterClubFormData['flex']) || undefined,
      loft: defaultValues.loft,
      putterType: defaultValues.putterType ?? '',
    },
  });

  const handleSave = methods.handleSubmit((data) => {
    onSave(data, index);
  });

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggle}
      disableGutters
      elevation={0}
      sx={{
        border: '0.5px solid',
        borderColor: 'grey.200',
        borderRadius: '8px !important',
        mb: 2,
        '&::before': { display: 'none' },
        '&.Mui-expanded': { borderColor: 'primary.light' },
      }}
    >
      <AccordionSummary
        sx={{ px: 2, py: 1, minHeight: 'unset', '& .MuiAccordionSummary-content': { my: 1 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {ORDINALS[index] ?? `#${index + 1}`} putter
          </Typography>
          {expanded
            ? <ExpandLessIcon sx={{ color: 'grey.500' }} />
            : <ExpandMoreIcon sx={{ color: 'grey.500' }} />
          }
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 2, pb: 2 }}>
        <FormProvider {...methods}>
          {/*
           * El id vincula este form con su hidden submit button en el padre.
           * Mismo patrón que DriverDetailsStep — necesario porque cada putter
           * tiene su propio useForm instance y el padre no tiene acceso directo.
           */}
          <form id={`putter-form-${index}`} onSubmit={handleSave}>
            <ClubBaseForm showShaftType={false} />

            <Box sx={{ mt: 2 }}>
              <MuiTypography variant="h6" sx={{ mb: 0.5 }}>Putter Type*</MuiTypography>
              <Controller
                name="putterType"
                control={methods.control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!methods.formState.errors.putterType}>
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
                        <MuiTypography variant="body2" sx={{ color: 'text.disabled' }}>
                          Select putter type
                        </MuiTypography>
                      </MenuItem>
                      {PUTTER_TYPE_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                    {methods.formState.errors.putterType && (
                      <FormHelperText>
                        {methods.formState.errors.putterType.message as string}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </form>
        </FormProvider>
      </AccordionDetails>
    </Accordion>
  );
};

// ─── Parent step ──────────────────────────────────────────────────────────────

interface PutterProps {
  count: number;
  initialPutters: PutterClubForm[];
  onSave: (putters: PutterClubForm[]) => void;
}

export const PutterDetailsStep: React.FC<PutterProps> = ({ count, initialPutters, onSave }) => {
  const [expanded, setExpanded] = useState<number>(0);
  const [saved, setSaved] = useState<(PutterClubForm | null)[]>(
    Array.from({ length: count }, (_, i) => initialPutters[i] ?? null)
  );

  // Ver DriverDetailsStep para explicación completa del por qué del ref
  const savedRef = useRef(saved);

  const handleSingleSave = (data: PutterClubFormData, index: number) => {
    setSaved((prev) => {
      const next = [...prev];
      next[index] = { ...data };
      savedRef.current = next;
      return next;
    });
    if (index < count - 1) setExpanded(index + 1);
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 500 }}>
        Provide additional information for the putter
      </Typography>

      {Array.from({ length: count }, (_, i) => (
        <SinglePutterForm
          key={i}
          index={i}
          defaultValues={saved[i] ?? { brand: '', model: '', flex: '', loft: '', putterType: '' }}
          expanded={expanded === i}
          onToggle={() => setExpanded((prev) => (prev === i ? -1 : i))}
          onSave={handleSingleSave}
        />
      ))}

      {/* Ver DriverDetailsStep para explicación del patrón hidden buttons */}
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          id={`putter-submit-trigger-${i}`}
          type="submit"
          form={`putter-form-${i}`}
          style={{ display: 'none' }}
        />
      ))}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            Array.from({ length: count }, (_, i) => {
              document.getElementById(`putter-submit-trigger-${i}`)?.click();
            });
            setTimeout(() => {
              const currentSaved = savedRef.current.filter(Boolean);
              if (currentSaved.length === count) {
                onSave(currentSaved as PutterClubForm[]);
              }
            }, 50);
          }}
          sx={{ width: 300, py: 1.5 }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};