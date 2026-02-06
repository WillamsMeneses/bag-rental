export const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: `${import.meta.env.VITE_API_URL}/auth/google/callback`,
  scopes: ['profile', 'email', 'openid'],
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
};

export const buildGoogleAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    response_type: 'code',
    scope: GOOGLE_CONFIG.scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });

  return `${GOOGLE_CONFIG.authUrl}?${params.toString()}`;
};

// Función para abrir popup
export const openGooglePopup = (url: string, width = 500, height = 600) => {
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const popup = window.open(
    url,
    'Google Sign In',
    `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
  );

  return popup;
};