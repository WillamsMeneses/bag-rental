import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

export const useStripeOnboarding = () => {
  const { isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsCheckingStatus(false);
      return;
    }

    const checkStatus = async () => {
      setIsCheckingStatus(true);
      try {
        const response = await api.get<{ data: { isConnected: boolean } }>('/users/stripe/status');
        setIsConnected(response.data.data.isConnected);
      } catch {
        setIsConnected(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, [isAuthenticated]);

  const handleConnectStripe = async () => {
    setIsLoading(true);
    try {
      const response = await api.post<{ data: { url: string } }>('/users/stripe/onboarding');
      window.location.href = response.data.data.url;
    } catch {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    isCheckingStatus,
    handleConnectStripe,
  };
};