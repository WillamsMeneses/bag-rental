import type { Components, Theme } from "@mui/material/styles";

export const buttonConfig: Components<Theme>['MuiButton'] = {
  styleOverrides: {
    root: {
      borderRadius: '4px',
      boxShadow: '2px 4px 16px 0 rgba(0, 0, 0, 0.08)',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      textTransform: 'none',
    },
  },
  variants: [
    {
      props: { variant: 'contained', color: 'primary' },
      style: {
        background: '#89C96A',
        color: '#FFF',
        '&:hover': {
          background: '#7AB85B',
        },
      },
    },
    {
      props: { variant: 'outlined', color: 'secondary' },
      style: {
        background: 'white',
        border: '1.2px solid #6A9D50',
        color: '#6A9D50',
        '&:hover': {
          background: 'rgba(106, 157, 80, 0.04)',
          border: '1.2px solid #6A9D50',
        },
      },
    },
  ],
};