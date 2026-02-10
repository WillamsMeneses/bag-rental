import React from 'react';
import {
  CardContent as MuiCardContent,
} from '@mui/material';

import type{
  CardContentProps as MuiCardContentProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

export interface CardContentProps extends MuiCardContentProps {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  ...props
}) => {
  return <StyledCardContent {...props}>{children}</StyledCardContent>;
};