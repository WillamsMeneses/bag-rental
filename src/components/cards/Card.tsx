import React from 'react';
import { Card as MuiCard, } from '@mui/material';
import type {  CardProps as MuiCardProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

export interface CardProps extends MuiCardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};