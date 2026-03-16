import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { DriverClubForm } from '@/stores/createListingStore';
import { driverClubSchema, type DriverClubFormData } from '@/schemas/listingDetailsSchema';
import ClubBaseForm from './ClubBaseForm';

const ORDINALS = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'];

interface SingleDriverFormProps {
  index: number;
  defaultValues: DriverClubForm;
  expanded: boolean;
  onToggle: () => void;
  onSave: (data: DriverClubFormData, index: number) => void;
}

// Each driver has its own form instance
const SingleDriverForm: React.FC<SingleDriverFormProps> = ({
  index,
  defaultValues,
  expanded,
  onToggle,
  onSave,
}) => {
  const methods = useForm<DriverClubFormData>({
    resolver: zodResolver(driverClubSchema),
    defaultValues: {
      brand: defaultValues.brand,
      model: defaultValues.model,
      flex: (defaultValues.flex as DriverClubFormData['flex']) || undefined,
      loft: defaultValues.loft,
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
        sx={{
          px: 2,
          py: 1,
          minHeight: 'unset',
          '& .MuiAccordionSummary-content': { my: 1 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {ORDINALS[index] ?? `#${index + 1}`} club
          </Typography>
          {expanded ? (
            <ExpandLessIcon sx={{ color: 'grey.500' }} />
          ) : (
            <ExpandMoreIcon sx={{ color: 'grey.500' }} />
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 2, pb: 2 }}>
        <FormProvider {...methods}>
          <form id={`driver-form-${index}`} onSubmit={handleSave}>
            <ClubBaseForm showShaftType={false} />
          </form>
        </FormProvider>
      </AccordionDetails>
    </Accordion>
  );
};

// ─── Parent step ──────────────────────────────────────────────────────────────

interface Props {
  count: number;
  initialDrivers: DriverClubForm[];
  onSave: (drivers: DriverClubForm[]) => void;
}

const DriverDetailsStep: React.FC<Props> = ({ count, initialDrivers, onSave }) => {
  const [expanded, setExpanded] = useState<number>(0);
  const [saved, setSaved] = useState<(DriverClubForm | null)[]>(
    Array.from({ length: count }, (_, i) => initialDrivers[i] ?? null)
  );

  const handleSingleSave = (data: DriverClubFormData, index: number) => {
    setSaved((prev) => {
      const next = [...prev];
      next[index] = { ...data, flex: data.flex };
      return next;
    });
    // Auto-expand next
    if (index < count - 1) setExpanded(index + 1);
  };

  //TODO: ver porque no se usan estos metodos ademas el button de continue reacciona al segundo click
  const handleContinue = () => {
    // Trigger all forms via submit — collect saved state
    const allFilled = saved.every((s) => s !== null);
    if (!allFilled) return;
    onSave(saved as DriverClubForm[]);
  };

  // We use individual form submit buttons hidden, and track saves per index
  const allSaved = saved.every((s) => s !== null);

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 500 }}>
        Provide additional information for the driver
      </Typography>

      {Array.from({ length: count }, (_, i) => (
        <SingleDriverForm
          key={i}
          index={i}
          defaultValues={saved[i] ?? { brand: '', model: '', flex: '', loft: '' }}
          expanded={expanded === i}
          onToggle={() => setExpanded((prev) => (prev === i ? -1 : i))}
          onSave={handleSingleSave}
        />
      ))}

      {/* Hidden submit triggers for each form */}
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          id={`driver-submit-trigger-${i}`}
          type="submit"
          form={`driver-form-${i}`}
          style={{ display: 'none' }}
        />
      ))}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Trigger all form submissions then continue
            Array.from({ length: count }, (_, i) => {
              document.getElementById(`driver-submit-trigger-${i}`)?.click();
            });
            // Continue is gated by allSaved check after re-render
            setTimeout(() => {
              // Check again after saves
              const currentSaved = saved.filter(Boolean);
              if (currentSaved.length === count) {
                onSave(currentSaved as DriverClubForm[]);
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

export default DriverDetailsStep;