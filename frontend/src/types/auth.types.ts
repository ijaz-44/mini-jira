export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}