import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { useAuthFlowStore } from '@/stores/authFlowStore';
import { buildGoogleAuthUrl, openGooglePopup } from '@/config/oauth.config';

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const { success, error } = useToastStore();
  const { setIsLoading } = useAuthFlowStore();
  const popupRef = useRef<Window | null>(null);
  const [popupBlocked, setPopupBlocked] = useState(false);

  // Escuchar mensajes del popup (cuando el backend redirige con el token)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificar que el mensaje venga de tu dominio
      if (event.origin !== window.location.origin) return;

      const { type, token, error: authError } = event.data;

      if (type === 'GOOGLE_AUTH_SUCCESS' && token) {
        setTokens(token);
        success('Login successful!');
        navigate('/dashboard');
        
        // Cerrar el popup
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
        }
      } else if (type === 'GOOGLE_AUTH_ERROR') {
        error(authError || 'Authentication failed');
      }

      setIsLoading(false);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, setTokens, success, error, setIsLoading]);

  // Función para iniciar el login con Google
  const loginWithGoogle = () => {
    setIsLoading(true);
    setPopupBlocked(false);

    const googleAuthUrl = buildGoogleAuthUrl();
    const popup = openGooglePopup(googleAuthUrl);

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // El popup fue bloqueado
      setPopupBlocked(true);
      setIsLoading(false);
      error('Popup blocked. Please allow popups for this site.');
      return;
    }

    popupRef.current = popup;

    // Verificar si el popup fue cerrado manualmente
    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        setIsLoading(false);
      }
    }, 500);
  };

  return {
    loginWithGoogle,
    popupBlocked,
  };
};