// src/services/project.service.ts
import { Project } from "../models/project.model.js";

export class ProjectService {
  static async getProjects(userId: string) {
    return Project.find({ $or: [{ owner: userId }, { members: userId }] }).populate("owner", "name email");
  }

  static async createProject(data: any, ownerId: string) {
    return Project.create({ ...data, owner: ownerId, members: [ownerId] });
  }
}