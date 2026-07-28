// src/services/task.service.ts
import { Task } from "../models/task.model.js";
import { getPagination } from "../utils/pagination.js";

export class TaskService {
  static async getTasks(query: any) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = {};

    if (query.status) filter.status = query.status;
    if (query.search) filter.title = { $regex: query.search, $options: "i" };

    const [tasks, total] = await Promise.all([
      Task.find(filter).populate("assignee", "name email").skip(skip).limit(limit).sort({ createdAt: -1 }),
      Task.countDocuments(filter),
    ]);

    return { tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async createTask(data: any, reporterId: string) {
    return Task.create({ ...data, project: data.projectId, assignee: data.assigneeId, reporter: reporterId });
  }
}
