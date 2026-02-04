import { create } from 'zustand';
import type { AlertColor } from '@mui/material';

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
  duration: number;
  showToast: (message: string, severity: AlertColor, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  hideToast: () => void;
}

const DEFAULT_DURATION = 3000;
const ERROR_DURATION = 4000;

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  duration: DEFAULT_DURATION,

  showToast: (message: string, severity: AlertColor, duration?: number) =>
    set({
      open: true,
      message,
      severity,
      duration: duration || DEFAULT_DURATION,
    }),

  success: (message: string) =>
    set({
      open: true,
      message,
      severity: 'success',
      duration: DEFAULT_DURATION,
    }),

  error: (message: string) =>
    set({
      open: true,
      message,
      severity: 'error',
      duration: ERROR_DURATION,
    }),

  info: (message: string) =>
    set({
      open: true,
      message,
      severity: 'info',
      duration: DEFAULT_DURATION,
    }),

  warning: (message: string) =>
    set({
      open: true,
      message,
      severity: 'warning',
      duration: DEFAULT_DURATION,
    }),

  hideToast: () =>
    set({
      open: false,
    }),
}));