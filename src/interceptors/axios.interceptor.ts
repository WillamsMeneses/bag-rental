import { PUBLIC_ENDPOINTS } from '@/config/api.config';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';


const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url || '';
    
    if (isPublicEndpoint(url)) {
      return config;
    }

    const token = useAuthStore.getState().accessToken;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      
      if (refreshToken) {
        try {
          // Aquí puedes implementar la lógica de refresh token si tu API lo soporta
          // const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken });
          // useAuthStore.getState().setTokens(data.access_token, data.refresh_token);
          // return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/';
        }
      } else {
        useAuthStore.getState().logout();
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);