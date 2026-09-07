import { api } from "./api";
import { ApiResponse } from "@/types/api.types";
import { Project } from "../types/project.types";
import { CreateProjectInput } from "@/lib/validations/project.schema";

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const res = await api.get<ApiResponse<Project[]>>("/projects");
    return res.data.data;
  },

  createProject: async (data: CreateProjectInput): Promise<Project> => {
    const res = await api.post<ApiResponse<Project>>("/projects", data);
    return res.data.data;
  },

  updateProject: async (
    projectId: string,
    data: Partial<CreateProjectInput>
  ): Promise<Project> => {
    const res = await api.put<ApiResponse<Project>>(`/projects/${projectId}`, data);
    return res.data.data;
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}`);
  },
};