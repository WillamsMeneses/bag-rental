import React from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCardBadge = styled(Box)(() => ({
  position: 'absolute',
  top: 12,
  left: 12,
  zIndex: 2,
}));

export interface CardBadgeProps extends BoxProps {
  children: React.ReactNode;
}

export const CardBadge: React.FC<CardBadgeProps> = ({ children, ...props }) => {
  return <StyledCardBadge {...props}>{children}</StyledCardBadge>;
};