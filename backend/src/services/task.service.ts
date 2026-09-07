// src/services/task.service.ts
import { Task } from "../models/task.model.js";
import { getPagination } from "../utils/pagination.js";

export class TaskService {
  static async getTasks(query: any) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = {};

    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.projectId) filter.project = query.projectId;
    if (query.search) filter.title = { $regex: query.search, $options: "i" };

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("assignee", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Task.countDocuments(filter),
    ]);

    return { tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async createTask(data: any, reporterId: string) {
    const taskData = {
      ...data,
      project: data.projectId || data.project,
      assignee: data.assigneeId || data.assignee,
      reporter: reporterId,
    };

    return Task.create(taskData);
  }

  static async updateTaskStatus(taskId: string, status: string) {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    ).populate("assignee", "name email");

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  static async updateTask(taskId: string, data: any) {
    const updateData: any = { ...data };

    // Map assigneeId -> assignee
    if (data.assigneeId) {
      updateData.assignee = data.assigneeId;
      delete updateData.assigneeId;
    }

    // Map projectId -> project
    if (data.projectId) {
      updateData.project = data.projectId;
      delete updateData.projectId;
    }

    const task = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    }).populate("assignee", "name email");

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  static async deleteTask(taskId: string) {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    return { message: "Task deleted successfully" };
  }
}