import React from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export type TagVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'tagVariant',
})<{ tagVariant?: TagVariant }>(({ theme, tagVariant = 'default' }) => {
  const variantStyles = {
    default: {
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.grey[800],
      border: `1px solid ${theme.palette.grey[300]}`,
    },
    success: {
      backgroundColor: 'white',
      color: '#6A9D50',
      border: '1px solid #059669',
    },
    warning: {
      backgroundColor: '#f59e0b',
      color: '#ffffff',
      border: '1px solid #d97706',
    },
    error: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: '1px solid #dc2626',
    },
    info: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: '1px solid #2563eb',
    },
  };

  return {
    ...variantStyles[tagVariant],
    fontSize: '0.875rem',
    fontWeight: 500,
    height: 28,
    borderRadius: theme.spacing(1),
  };
});

export interface TagProps extends Omit<ChipProps, 'variant'> {
  variant?: TagVariant;
}

export const Tag: React.FC<TagProps> = ({ variant = 'default', ...props }) => {
  return <StyledChip tagVariant={variant} size="small" {...props} />;
};