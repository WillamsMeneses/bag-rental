import { create } from 'zustand';

type AuthStep = 'email' | 'login' | 'register';

interface AuthFlowState {
  currentStep: AuthStep;
  currentEmail: string;
  setCurrentStep: (step: AuthStep) => void;
  setCurrentEmail: (email: string) => void;
  resetAuthFlow: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  currentStep: 'email',
  currentEmail: '',

  setCurrentStep: (step: AuthStep) =>
    set({ currentStep: step }),

  setCurrentEmail: (email: string) =>
    set({ currentEmail: email }),

  resetAuthFlow: () =>
    set({
      currentStep: 'email',
      currentEmail: '',
    }),
}));