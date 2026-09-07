// src/services/project.service.ts
import { Project } from "../models/project.model.js";

export class ProjectService {
  static async getProjects(userId: string) {
    return Project.find({ $or: [{ owner: userId }, { members: userId }] }).populate("owner", "name email");
  }

  static async createProject(data: any, ownerId: string) {
    return Project.create({ ...data, owner: ownerId, members: [ownerId] });
  }

  static async updateProject(projectId: string, data: any) {
    const project = await Project.findByIdAndUpdate(projectId, data, {
      new: true,
      runValidators: true,
    }).populate("owner", "name email");

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  }

  static async deleteProject(projectId: string) {
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    return { message: "Project deleted successfully" };
  }
}