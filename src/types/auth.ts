export interface AuthResponse {
  access_token: string;
  user: {
    user_id: number;
    username: string;
    email: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}