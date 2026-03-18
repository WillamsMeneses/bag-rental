import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const { success, error } = useToastStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const authError = searchParams.get('error');

    if (window.opener) {
      // Flujo popup — pasar tokens al opener y cerrar
      if (token && refreshToken) {
        window.opener.postMessage(
          { type: 'GOOGLE_AUTH_SUCCESS', token, refreshToken },
          window.location.origin
        );
      } else if (authError) {
        window.opener.postMessage(
          { type: 'GOOGLE_AUTH_ERROR', error: authError },
          window.location.origin
        );
      }
      setTimeout(() => window.close(), 500);
    } else {
      // Flujo redirect — guardar tokens directamente y navegar
      if (token && refreshToken) {
        setTokens(token, refreshToken);
        success('Login successful!');
        navigate('/dashboard');
      } else if (authError) {
        error(decodeURIComponent(authError));
        navigate('/');
      } else {
        navigate('/');
      }
    }
  }, [searchParams, navigate, setTokens, success, error]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2 }}>
      <CircularProgress />
      <Typography variant="h6">Completing authentication...</Typography>
    </Box>
  );
};

export default AuthCallbackPage;