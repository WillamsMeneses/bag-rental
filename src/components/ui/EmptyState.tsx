import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactElement;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: EmptyStateAction;
  minHeight?: string;
  icon?: React.ReactElement<SvgIconComponent>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  minHeight = '50vh',
  icon,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
      gap={1.5}
    >
      {icon && (
        <Box sx={{ color: 'text.disabled', mb: 1 }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {description}
        </Typography>
      )}
      {action && (
        <Button
          variant="contained"
          startIcon={action.icon}
          onClick={action.onClick}
          sx={{ mt: 1.5, borderRadius: 2, textTransform: 'none', px: 4 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};