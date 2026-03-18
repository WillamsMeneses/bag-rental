import { create } from 'zustand';

type AuthStep = 'email' | 'login' | 'register';

interface AuthFlowState {
  currentStep: AuthStep;
  currentEmail: string;
  isLoading: boolean;
  setCurrentStep: (step: AuthStep) => void;
  setCurrentEmail: (email: string) => void;
  setIsLoading: (loading: boolean) => void;
  resetAuthFlow: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  currentStep: 'email',
  currentEmail: '',
  isLoading: false,

  setCurrentStep: (step: AuthStep) =>
    set({ currentStep: step }),

  setCurrentEmail: (email: string) =>
    set({ currentEmail: email }),

  setIsLoading: (loading: boolean) =>  // ← agregar
    set({ isLoading: loading }),

  resetAuthFlow: () =>
    set({
      currentStep: 'email',
      currentEmail: '',
      isLoading: false,
    }),
}));