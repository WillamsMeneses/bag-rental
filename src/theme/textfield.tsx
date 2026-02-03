import type { Components, Theme } from "@mui/material/styles";

export const textFieldConfig: Components<Theme>['MuiTextField'] = {
  defaultProps: {
    variant: 'outlined',
  },
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiOutlinedInput-root': {
        borderRadius: '4px',
        backgroundColor: theme.palette.background.paper,
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        
        '& input': {
          padding: '6px 8px',
        },
        
        '& fieldset': {
          borderWidth: '0.5px',
          borderColor: theme.palette.grey[400],
        },
        
        '&:hover fieldset': {
          borderWidth: '0.5px',
          borderColor: theme.palette.grey[400],
        },
        
        '&.Mui-focused fieldset': {
          borderWidth: '1.5px',
          borderColor: theme.palette.primary.main,
        },
      },
    }),
  },
};