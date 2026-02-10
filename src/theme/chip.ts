import type { Components, Theme } from "@mui/material/styles";

export const chipConfig: Components<Theme>['MuiChip'] = {
  styleOverrides: {
    root: {
      fontSize: '0.875rem',
      fontWeight: 500,
      height: 28,
      borderRadius: '8px',
    },
    label: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '14px',
      fontWeight: 500,
      padding: '0 8px',
    },
  },
  variants: [
    {
      props: { variant: 'filled' },
      style: {
        '&.MuiChip-colorSuccess': {
          backgroundColor: 'white',
          color: '#6A9D50',
          border: '1px solid #059669',
          '& .MuiChip-label': {
            color: '#6A9D50',
          },
        },
      },
    },
    {
      props: { variant: 'outlined' },
      style: {
        '&.MuiChip-colorSuccess': {
          backgroundColor: 'white',
          color: '#6A9D50',
          border: '1px solid #059669',
          '& .MuiChip-label': {
            color: '#6A9D50',
          },
        },
        '&.MuiChip-colorWarning': {
          backgroundColor: '#f59e0b',
          color: '#ffffff',
          border: '1px solid #d97706',
          '& .MuiChip-label': {
            color: '#ffffff',
          },
        },
        '&.MuiChip-colorError': {
          backgroundColor: '#ef4444',
          color: '#ffffff',
          border: '1px solid #dc2626',
          '& .MuiChip-label': {
            color: '#ffffff',
          },
        },
        '&.MuiChip-colorInfo': {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: '1px solid #2563eb',
          '& .MuiChip-label': {
            color: '#ffffff',
          },
        },
        '&.MuiChip-colorDefault': {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: '1px solid #d1d5db',
          '& .MuiChip-label': {
            color: '#374151',
          },
        },
      },
    },
  ],
};