import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Divider,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export interface SelectableEntry {
  type: string;    // e.g. "3 Wood", "5 Iron", "gap"
  quantity: number;
}

interface EntryOption {
  label: string; // e.g. "3 Wood"
  value: string; // stored value e.g. "3"
}

interface Props {
  options: EntryOption[];
  entries: SelectableEntry[];
  onChange: (entries: SelectableEntry[]) => void;
  remaining: number; // how many more can be added
  otherAllowed?: boolean;
}

/**
 * Component that shows a list of options with +/- quantity controls.
 * Used for wood types, hybrid numbers, iron numbers, wedge types.
 * Shows "Add X more" hint. Predefined options + "Other" free text.
 */
const EntrySelector: React.FC<Props> = ({
  options,
  entries,
  onChange,
  remaining,
  otherAllowed = true,
}) => {
  const [otherText, setOtherText] = useState('');

  const getEntry = (value: string): SelectableEntry | undefined =>
    entries.find((e) => e.type === value);

  const handleIncrement = ( value: string) => {
    if (remaining <= 0) return;
    const existing = getEntry(value);
    if (existing) {
      onChange(entries.map((e) => e.type === value ? { ...e, quantity: e.quantity + 1 } : e));
    } else {
      onChange([...entries, { type: value, quantity: 1 }]);
    }
  };

  const handleDecrement = (value: string) => {
    const existing = getEntry(value);
    if (!existing) return;
    if (existing.quantity <= 1) {
      onChange(entries.filter((e) => e.type !== value));
    } else {
      onChange(entries.map((e) => e.type === value ? { ...e, quantity: e.quantity - 1 } : e));
    }
  };

  const handleAddOther = () => {
    const trimmed = otherText.trim();
    if (!trimmed || remaining <= 0) return;
    const existing = getEntry(trimmed);
    if (existing) {
      onChange(entries.map((e) => e.type === trimmed ? { ...e, quantity: e.quantity + 1 } : e));
    } else {
      onChange([...entries, { type: trimmed, quantity: 1 }]);
    }
    setOtherText('');
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 0.25 }}>
        Select all that apply
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        (Add {remaining} more)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {options.map(({ label, value }, idx) => {
          const entry = getEntry(value);
          const qty = entry?.quantity ?? 0;

          return (
            <React.Fragment key={value}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1.25,
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {label}
                </Typography>

                {qty > 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      onClick={() => handleDecrement(value)}
                      size="small"
                      sx={{ p: 0, color: 'grey.500', '&:hover': { background: 'transparent' } }}
                      disableRipple
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                    <Typography variant="body2" sx={{ minWidth: 16, textAlign: 'center', fontWeight: 700 }}>
                      {qty}
                    </Typography>
                    <IconButton
                      onClick={() => handleIncrement(value)}
                      size="small"
                      disabled={remaining <= 0}
                      sx={{ p: 0, color: 'grey.500', '&:hover': { background: 'transparent', color: 'primary.main' } }}
                      disableRipple
                    >
                      <AddCircleOutlineIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton
                    onClick={() => handleIncrement(value)}
                    size="small"
                    disabled={remaining <= 0}
                    sx={{ p: 0, color: 'grey.500', '&:hover': { background: 'transparent', color: 'primary.main' } }}
                    disableRipple
                  >
                    <AddCircleOutlineIcon sx={{ fontSize: 24 }} />
                  </IconButton>
                )}
              </Box>
              {idx < options.length - 1 && <Divider sx={{ borderColor: 'grey.100' }} />}
            </React.Fragment>
          );
        })}

        {/* "Other" free text */}
        {otherAllowed && (
          <>
            <Divider sx={{ borderColor: 'grey.100' }} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1.25,
                gap: 1,
              }}
            >
              <TextField
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddOther()}
                placeholder="Other"
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'grey.50',
                    '& fieldset': { borderColor: 'grey.200' },
                    '& input': { padding: '4px 8px', fontSize: '14px' },
                  },
                }}
              />
              <IconButton
                onClick={handleAddOther}
                size="small"
                disabled={!otherText.trim() || remaining <= 0}
                sx={{ p: 0, color: 'grey.500', '&:hover': { background: 'transparent', color: 'primary.main' } }}
                disableRipple
              >
                <AddCircleOutlineIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default EntrySelector;