import { api } from "./api";
import { ApiResponse } from "@/types/api.types";
import { Task } from "@/types/task.types";
import { CreateTaskInput } from "@/lib/validations/task.schema";

export const taskService = {
  getTasks: async (params?: Record<string, string>): Promise<Task[]> => {
    const res = await api.get<ApiResponse<Task[]>>("/tasks", { params });
    
    // Safety Fallback: Agar backend res.data.data undefined de ya structure match na ho, 
    // to empty array [] return hoga taakay React Query crash na ho.
    return res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
  },

  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const res = await api.post<ApiResponse<Task>>("/tasks", data);
    return res.data?.data ?? res.data;
  },

  updateTaskStatus: async (taskId: string, status: string): Promise<Task> => {
    const res = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}/status`, { status });
    return res.data?.data ?? res.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};