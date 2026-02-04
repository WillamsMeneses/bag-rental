import type { AlertColor } from '@mui/material';

export interface ToastConfig {
  message: string;
  severity: AlertColor;
  duration?: number;
}

export const DEFAULT_TOAST_DURATION = 3000;
export const ERROR_TOAST_DURATION = 4000;