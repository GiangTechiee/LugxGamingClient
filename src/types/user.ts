export interface UserResponse {
  user_id: number;
  username: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  role: 'ADMIN' | 'CUSTOMER';
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateUser {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone_number?: string;
  role?: 'ADMIN' | 'CUSTOMER';
}

export interface UpdateUser {
  email?: string;
  password?: string;
  full_name?: string;
  phone_number?: string;
}

export interface UpdateUserByAdmin {
  username?: string;
  email?: string;
  password?: string;
  full_name?: string;
  phone_number?: string;
  role?: 'ADMIN' | 'CUSTOMER';
  is_active?: boolean;
}