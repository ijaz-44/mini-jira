import { api } from "@/lib/axios";
import { User } from "../types/auth.types";

export const authService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  login: async (credentials: Record<string, string>): Promise<User> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // 👇 Yeh missing tha, isy add kar dein:
  register: async (userData: Record<string, string>): Promise<User> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};