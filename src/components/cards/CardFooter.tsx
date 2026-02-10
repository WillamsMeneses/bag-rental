import React from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCardFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export interface CardFooterProps extends BoxProps {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  ...props
}) => {
  return <StyledCardFooter {...props}>{children}</StyledCardFooter>;
};