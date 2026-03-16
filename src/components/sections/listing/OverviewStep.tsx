import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { ListingWizardState, WizardStep } from '@/stores/createListingStore';

const GENDER_LABEL: Record<string, string> = { male: 'Masculine', female: 'Feminine' };
const HAND_LABEL: Record<string, string> = { left_handed: 'Left-handed', right_handed: 'Right-handed' };
const FLEX_LABEL: Record<string, string> = {
  ladies: 'Ladies', senior: 'Senior', regular: 'Regular',
  stiff: 'Stiff', x_stiff: 'X Stiff', xx_stiff: 'XX Stiff',
};

// ─── Edit button ──────────────────────────────────────────────────────────────

const EditBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button
    variant="outlined"
    color="secondary"
    size="small"
    startIcon={<EditIcon sx={{ fontSize: '14px !important' }} />}
    onClick={onClick}
    sx={{ fontSize: '12px', py: 0.25, px: 1, minWidth: 'unset', borderRadius: '6px' }}
  >
    Edit
  </Button>
);

// ─── Row ──────────────────────────────────────────────────────────────────────

const DetailRow: React.FC<{
  label: string;
  value: string;
  expandable?: boolean;
}> = ({ label, value, expandable }) => {
  const [open, setOpen] = useState(false);
  const isLong = value.length > 50;
  const shown = expandable && isLong && !open ? value.slice(0, 50) + '...' : value;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        py: 1,
        borderBottom: '0.5px solid',
        borderColor: 'grey.100',
      }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', flexShrink: 0, mr: 2 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, maxWidth: '60%', textAlign: 'right' }}>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
          {shown}
        </Typography>
        {expandable && isLong && (
          <IconButton
            size="small"
            onClick={() => setOpen((p) => !p)}
            sx={{ p: 0, color: 'grey.500' }}
            disableRipple
          >
            {open ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section: React.FC<{
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}> = ({ title, onEdit, children }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
      {onEdit && <EditBtn onClick={onEdit} />}
    </Box>
    <Box sx={{ border: '0.5px solid', borderColor: 'grey.200', borderRadius: '8px', px: 2, py: 1 }}>
      {children}
    </Box>
  </Box>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface OverviewProps {
  store: ListingWizardState;
  photoUrls?: string[];
  onGoToStep: (step: WizardStep) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

const OverviewStep: React.FC<OverviewProps> = ({
  store,
  photoUrls = [],
  onGoToStep,
  onConfirm,
  isSubmitting,
  isEdit = false,
}) => {
  const { listingDetails, quantities, drivers, wood, hybrid, irons, wedges, putter } = store;

  const locationParts = [
    listingDetails.street,
    listingDetails.city,
    listingDetails.state,
    listingDetails.zipCode,
  ].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : '—';

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3, fontWeight: 500 }}>Overview</Typography>

      {/* ── Listing details ────────────────────────────────────────────────── */}
      <Section title="Listing details" onEdit={() => onGoToStep('listing-details')}>
        {/* Photos row */}
        {photoUrls.length > 0 && (
          <Box sx={{ py: 1.5, borderBottom: '0.5px solid', borderColor: 'grey.100' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Photos</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {photoUrls.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  sx={{ width: 52, height: 52, objectFit: 'cover', borderRadius: '6px' }}
                />
              ))}
            </Box>
          </Box>
        )}

        <DetailRow label="Listing Title" value={listingDetails.title || '—'} />
        <DetailRow
          label="Price per day"
          value={listingDetails.pricePerDay ? `USD ${Number(listingDetails.pricePerDay).toFixed(2)}` : '—'}
        />
        <DetailRow label="Gender" value={GENDER_LABEL[listingDetails.gender] ?? '—'} />
        <DetailRow label="Hand" value={HAND_LABEL[listingDetails.hand] ?? '—'} />
        {listingDetails.description && (
          <DetailRow label="Description" value={listingDetails.description} expandable />
        )}
        <DetailRow label="Location" value={locationStr} expandable />
      </Section>

      {/* ── Clubs ──────────────────────────────────────────────────────────── */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Clubs</Typography>

      {/* Drivers */}
      {quantities.driver > 0 && drivers.length > 0 && (
        <Section title="Driver" onEdit={() => onGoToStep('driver-details')}>
          {drivers.map((d, i) => (
            <Box key={i} sx={{ mb: i < drivers.length - 1 ? 2 : 0 }}>
              <Typography variant="h6" sx={{ py: 1, color: 'text.secondary' }}>
                {['First', 'Second', 'Third', 'Fourth'][i] ?? `#${i + 1}`} club
              </Typography>
              <DetailRow label="Brand" value={d.brand} />
              <DetailRow label="Model" value={d.model} />
              <DetailRow label="Flex" value={FLEX_LABEL[d.flex] ?? d.flex} />
              <DetailRow label="Loft" value={d.loft} />
            </Box>
          ))}
        </Section>
      )}

      {/* Wood */}
      {quantities.wood > 0 && wood && (
        <Section title="Fairway" onEdit={() => onGoToStep('wood-details')}>
          <DetailRow label="Brand" value={wood.brand} />
          <DetailRow label="Model" value={wood.model} />
          <DetailRow label="Flex" value={FLEX_LABEL[wood.flex] ?? wood.flex} />
          <DetailRow label="Loft" value={wood.loft} />
          {wood.woodEntries.map((entry) => (
            <Box
              key={entry.woodType}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
                borderBottom: '0.5px solid',
                borderColor: 'grey.100',
                bgcolor: 'grey.50',
                px: 1,
                borderRadius: '4px',
                mt: 0.5,
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{entry.woodType} Wood</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                x {entry.quantity}
              </Typography>
            </Box>
          ))}
        </Section>
      )}

      {/* Hybrid */}
      {quantities.hybrid_rescue > 0 && hybrid && (
        <Section title="Hybrid / Rescue" onEdit={() => onGoToStep('hybrid-details')}>
          <DetailRow label="Brand" value={hybrid.brand} />
          <DetailRow label="Model" value={hybrid.model} />
          <DetailRow label="Flex" value={FLEX_LABEL[hybrid.flex] ?? hybrid.flex} />
          <DetailRow label="Loft" value={hybrid.loft} />
          {hybrid.hybridEntries.map((entry) => (
            <Box
              key={entry.hybridNumber}
              sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '0.5px solid', borderColor: 'grey.100', bgcolor: 'grey.50', px: 1, borderRadius: '4px', mt: 0.5 }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>#{entry.hybridNumber}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>x {entry.quantity}</Typography>
            </Box>
          ))}
        </Section>
      )}

      {/* Irons */}
      {quantities.iron > 0 && irons && (
        <Section title="Irons" onEdit={() => onGoToStep('iron-details')}>
          <DetailRow label="Brand" value={irons.brand} />
          <DetailRow label="Model" value={irons.model} />
          <DetailRow label="Flex" value={FLEX_LABEL[irons.flex] ?? irons.flex} />
          <DetailRow label="Loft" value={irons.loft} />
          {irons.ironEntries.map((entry) => (
            <Box
              key={entry.ironNumber}
              sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '0.5px solid', borderColor: 'grey.100', bgcolor: 'grey.50', px: 1, borderRadius: '4px', mt: 0.5 }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{entry.ironNumber} Iron</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>x {entry.quantity}</Typography>
            </Box>
          ))}
        </Section>
      )}

      {/* Wedges */}
      {quantities.wedge > 0 && wedges && (
        <Section title="Wedges" onEdit={() => onGoToStep('wedge-details')}>
          <DetailRow label="Brand" value={wedges.brand} />
          <DetailRow label="Model" value={wedges.model} />
          <DetailRow label="Flex" value={FLEX_LABEL[wedges.flex] ?? wedges.flex} />
          <DetailRow label="Loft" value={wedges.loft} />
          {wedges.wedgeEntries.map((entry) => (
            <Box
              key={entry.wedgeType}
              sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '0.5px solid', borderColor: 'grey.100', bgcolor: 'grey.50', px: 1, borderRadius: '4px', mt: 0.5 }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{entry.wedgeType} Wedge</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>x {entry.quantity}</Typography>
            </Box>
          ))}
        </Section>
      )}

      {/* Putter */}
      {quantities.putter > 0 && putter && (
        <Section title="Putter" onEdit={() => onGoToStep('putter-details')}>
          <DetailRow label="Brand" value={putter.brand} />
          <DetailRow label="Model" value={putter.model} />
          <DetailRow label="Flex" value={FLEX_LABEL[putter.flex] ?? putter.flex} />
          <DetailRow label="Loft" value={putter.loft} />
          <DetailRow label="Type" value={putter.putterType} />
        </Section>
      )}

      {/* Confirm */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', pb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          disabled={isSubmitting}
          sx={{ width: 300, py: 1.5 }}
        >
          {isSubmitting
            ? (isEdit ? 'Saving...' : 'Publishing...')
            : (isEdit ? 'Save changes' : 'Confirm')}
        </Button>
      </Box>
    </Box>
  );
};

export default OverviewStep;