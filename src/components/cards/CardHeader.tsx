import React from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCardHeader = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
}));

export interface CardHeaderProps extends BoxProps {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  ...props
}) => {
  return <StyledCardHeader {...props}>{children}</StyledCardHeader>;
};