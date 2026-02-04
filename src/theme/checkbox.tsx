import type { Components, Theme } from "@mui/material/styles";

export const checkboxConfig: Components<Theme>['MuiCheckbox'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.grey[500],
      padding: 0, // Elimina el padding
      
      '&.Mui-checked': {
        color: theme.palette.primary.main,
      },
      
      '& .MuiSvgIcon-root': {
        fontSize: '30px',
      },
      
      // Elimina el efecto hover circular
      '&:hover': {
        backgroundColor: 'transparent',
      },
    }),
  },
  defaultProps: {
    disableRipple: true, // Elimina el efecto ripple al hacer click
  },
};