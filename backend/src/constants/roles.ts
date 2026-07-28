// src/constants/roles.ts
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type role = (typeof ROLES)[keyof typeof ROLES];


