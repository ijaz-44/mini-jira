// src/types/auth.types.ts

export type UserRole = "EMPLOYEE" | "MANAGER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

// 1. Export LoginInput interface
export interface LoginInput {
  email: string;
  password?: string;
}

// 2. Export RegisterInput interface
export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
}