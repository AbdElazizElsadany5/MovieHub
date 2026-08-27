export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive?: boolean;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurrentUser extends User {}

export interface AdminUser extends User {
  role: 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  data?: {
    user: User;
    token?: string;
  };
  message?: string;
}

export interface UserResponse {
  success: boolean;
  data?: User;
  users?: User[];
  message?: string;
}
