import { PUBLIC_ENDPOINTS } from '@/config/api.config';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// ─── Request interceptor — attach access token ────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url || '';

    if (isPublicEndpoint(url)) return config;

    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response interceptor — handle 401 with token refresh ────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isPublicEndpoint(originalRequest.url || '')) {
        return Promise.reject(error);
      }

      const { accessToken, refreshToken } = useAuthStore.getState();

      if (!accessToken) {
        return Promise.reject(error);
      }

      if (refreshToken) {
        try {

          // Call refresh endpoint — note: use axios directly to avoid interceptor loop
          const { data } = await api.post('/auth/refresh', { refreshToken });

          // Store new tokens and retry original request
          useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

          return api(originalRequest);
        } catch {
          // Refresh failed — logout and redirect
          useAuthStore.getState().logout();
          window.location.href = '/';
        }
      } else {
        useAuthStore.getState().logout();
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  },
);