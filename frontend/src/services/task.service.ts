import { api } from "./api";
import { Task, TaskStatus } from "@/types/task.types";
import { CreateTaskInput, UpdateTaskInput } from "@/lib/validations/task.schema";

export const taskService = {
  // Fetch all tasks
  getTasks: async (params?: Record<string, string>): Promise<Task[]> => {
    const res = await api.get("/tasks", { params });
    const rawData = res.data?.data ?? res.data?.tasks ?? res.data;
    return Array.isArray(rawData) ? rawData : [];
  },

  // Fetch single task by ID
  getTaskById: async (taskId: string): Promise<Task> => {
    const res = await api.get(`/tasks/${taskId}`);
    return res.data?.data ?? res.data?.task ?? res.data;
  },

  // Create task
  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const res = await api.post("/tasks", data);
    return res.data?.data ?? res.data?.task ?? res.data;
  },

  // Update task details
  updateTask: async (taskId: string, data: Partial<UpdateTaskInput>): Promise<Task> => {
    const res = await api.patch(`/tasks/${taskId}`, data);
    return res.data?.data ?? res.data?.task ?? res.data;
  },

  // Update status (Kanban Drag and Drop)
  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<Task> => {
    const res = await api.patch(`/tasks/${taskId}/status`, { status });
    return res.data?.data ?? res.data?.task ?? res.data;
  },

  // Delete task
  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};