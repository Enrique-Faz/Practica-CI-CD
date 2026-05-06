export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'normal' | 'admin';
  google2fa_enabled: boolean;
}

export interface LoggedUser {
  token: string;
  user: User;
  expiresAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  data?: {
    token: string;
    user: User;
  };
  expiresAt?: string;
  require_2fa?: boolean;
  temp_user_id?: number;
}
