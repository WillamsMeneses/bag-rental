import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    // Enviar mensaje al window opener (la ventana principal)
    if (window.opener) {
      if (token) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_SUCCESS',
            token,
          },
          window.location.origin
        );
      } else if (error) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_ERROR',
            error,
          },
          window.location.origin
        );
      }

      // Cerrar el popup después de enviar el mensaje
      setTimeout(() => {
        window.close();
      }, 500);
    } else {
      // Si no es un popup, redirigir manualmente
      if (token) {
        localStorage.setItem('auth_token', token);
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    }
  }, [searchParams]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="h6">Completing authentication...</Typography>
    </Box>
  );
};

export default AuthCallbackPage;