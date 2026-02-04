// Estructura de respuesta de tu backend
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface CheckEmailData {
  exists: boolean;
  email: string;
}

export interface AuthData {
  accessToken: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

// Tipos de respuesta completos
export type CheckEmailResponse = ApiResponse<CheckEmailData>;
export type AuthResponse = ApiResponse<AuthData>;