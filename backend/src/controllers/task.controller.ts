// src/controllers/task.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { TaskService } from "../services/task.service.js";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const result = await TaskService.getTasks(req.query);
  res.status(200).json({ success: true, ...result });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await TaskService.createTask(req.body, req.user!.id);
  res.status(201).json({ success: true, data: task });
});
