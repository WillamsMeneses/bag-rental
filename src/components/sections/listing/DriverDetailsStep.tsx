import React, { useRef, useState } from 'react';
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

// Each driver gets its own isolated form instance so validations don't bleed
// between accordions.
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
          {/*
           * The form id (driver-form-{index}) is what links the hidden submit
           * buttons in the parent to each individual form instance. Without this
           * id the parent can't trigger submission programmatically.
           */}
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

  /*
   * Why a ref instead of reading `saved` directly in the onClick callback?
   *
   * The onClick closes over the value of `saved` at render time. When the
   * Continue button triggers all form submissions, each form calls
   * handleSingleSave which calls setSaved — but those setState calls are
   * async: the `saved` variable captured by onClick still holds the OLD value
   * in the same event cycle. That's why naively reading `saved` inside
   * setTimeout requires two clicks: the first updates state, the second reads
   * the already-updated value.
   *
   * savedRef is updated synchronously inside the setSaved callback (where the
   * fresh `next` array is already available), so by the time the setTimeout
   * fires it always reflects the latest saves regardless of React's batching.
   */
  const savedRef = useRef(saved);

  const handleSingleSave = (data: DriverClubFormData, index: number) => {
    setSaved((prev) => {
      const next = [...prev];
      next[index] = { ...data, flex: data.flex };
      savedRef.current = next; // keep ref in sync with the freshest state
      return next;
    });
    // Auto-open the next accordion so the user flows naturally through each club
    if (index < count - 1) setExpanded(index + 1);
  };

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

      {/*
       * Why hidden submit buttons instead of calling methods.handleSubmit() directly?
       *
       * Each form lives inside its own SingleDriverForm component and owns its
       * own useForm instance — the parent has no reference to those instances.
       * The HTML `form` attribute lets a <button> outside a <form> trigger that
       * form's submit event, so we create one hidden button per form and click
       * them programmatically from the Continue handler. This keeps each form
       * self-contained without needing refs/forwardRef/useImperativeHandle.
       *
       * WoodDetailsStep is simpler because it has only ONE form, so its Continue
       * button can use type="submit" form="wood-base-form" directly.
       */}
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
            // Trigger every form's validation + submit in one click
            Array.from({ length: count }, (_, i) => {
              document.getElementById(`driver-submit-trigger-${i}`)?.click();
            });

            /*
             * The form submissions above are synchronous DOM events but
             * React's state updates inside handleSingleSave are batched and
             * applied asynchronously. We defer the onSave check by one tick so
             * savedRef.current has had a chance to be updated by all the
             * handleSingleSave calls before we read it.
             */
            setTimeout(() => {
              const currentSaved = savedRef.current.filter(Boolean);
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