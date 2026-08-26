export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image?: string | null;
  favorites?: string[];
}

export type CurrentUser = User;

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
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}
