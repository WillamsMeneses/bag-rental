import type { PaletteOptions } from '@mui/material/styles';

export const paletteConfig: PaletteOptions = {
  primary: {
    main: '#89C96A',
    light: '#9DD67E',
    dark: '#7AB85B',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#6A9D50',
    light: '#7DB35E',
    dark: '#5A8644',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#ED6C02',
    light: '#FF9800',
    dark: '#E65100',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0288D1',
    light: '#03A9F4',
    dark: '#01579B',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FAFAFA',
    100: '#FFFFFF',  // Gray-scale-100
    200: '#F5F5F5',
    300: '#E0E0E0',
    400: '#BFBFBF',  // Gray-scale-400
    500: '#A6A6A6',  // Gray-scale-500
    600: '#4E4E4E',  // Gray-scale-600
    700: '#737373',  // Gray-scale-700
    800: '#595959',  // Gray-scale-800
    900: '#404040',  // Gray-scale-900
  },
  text: {
    primary: '#404040',    // Gray-scale-900
    secondary: '#737373',  // Gray-scale-700
    disabled: '#A6A6A6',   // Gray-scale-500
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
  },
  divider: '#BFBFBF',
};