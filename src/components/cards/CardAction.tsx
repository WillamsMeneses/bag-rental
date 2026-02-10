import React from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCardAction = styled(Box)(() => ({
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 2,
}));

export interface CardActionProps extends BoxProps {
  children: React.ReactNode;
}

export const CardAction: React.FC<CardActionProps> = ({
  children,
  ...props
}) => {
  return <StyledCardAction {...props}>{children}</StyledCardAction>;
};