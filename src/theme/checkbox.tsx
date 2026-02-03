import type { Components, Theme } from "@mui/material/styles";

export const checkboxConfig: Components<Theme>['MuiCheckbox'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.grey[500],
      padding: '8px',
      
      '&.Mui-checked': {
        color: theme.palette.primary.main,
      },
      
      '& .MuiSvgIcon-root': {
        fontSize: '30px',
      },
    }),
  },
};