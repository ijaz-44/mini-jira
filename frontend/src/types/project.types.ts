// src/types/project.types.ts

export interface Project {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}