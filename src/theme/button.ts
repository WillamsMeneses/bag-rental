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
      style: ({ theme }) => ({
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          background: theme.palette.primary.dark,
        },
      }),
    },
    {
      props: { variant: 'outlined', color: 'secondary' },
      style: ({ theme }) => ({
        background: theme.palette.background.paper,
        border: `1.2px solid ${theme.palette.secondary.main}`,
        color: theme.palette.secondary.main,
        '&:hover': {
          background: 'rgba(106, 157, 80, 0.04)',
          border: `1.2px solid ${theme.palette.secondary.main}`,
        },
      }),
    },
  ],
};