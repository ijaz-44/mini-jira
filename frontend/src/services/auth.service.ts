import { api } from "@/lib/axios";
import { User, LoginInput, RegisterInput } from "../types/auth.types";

export const authService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data.data; 
  },

  login: async (credentials: LoginInput): Promise<User> => {
    const response = await api.post("/auth/login", credentials);
    return response.data.data;
  },

  register: async (userData: RegisterInput): Promise<User> => {
    const response = await api.post("/auth/register", userData);
    return response.data.data;
  },

  updateRole: async (role: string): Promise<User> => {
    const response = await api.patch("/auth/role", { role });
    return response.data.data; 
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};