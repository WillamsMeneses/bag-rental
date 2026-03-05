import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useAuthFlowStore } from '@/stores/authFlowStore';
import { useToastStore } from '@/stores/toastStore';
import type { AuthFormData, LoginFormData, RegisterFormData } from '@/schemas/authSchema';
import { authService } from '@/services/auth.service';

interface ErrorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const { 
    currentStep, 
    currentEmail, 
    setCurrentStep, 
    setCurrentEmail,
    resetAuthFlow 
  } = useAuthFlowStore();
  const { success, error, info } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckEmail = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.checkEmail(data);
      setCurrentEmail(data.email);

      if (response.data.exists) {
        setCurrentStep('login');
        info('Please enter your password');
      } else {
        setCurrentStep('register');
        info('Create your password to register');
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Error checking email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(currentEmail, data);
      
      // ✅ Corregido: usa accessToken de response.data (no access_token)
      setTokens(response.data.accessToken);
      success(response.message || 'Login successful!');
      resetAuthFlow();
      navigate('/');
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(currentEmail, data);
      
      // ✅ Corregido: usa accessToken de response.data (no access_token)
      setTokens(response.data.accessToken);
      success(response.message || 'Registration successful!');
      resetAuthFlow();
      navigate('/dashboard');
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    currentStep,
    currentEmail,
    handleCheckEmail,
    handleLogin,
    handleRegister,
    resetAuth: resetAuthFlow,
  };
};