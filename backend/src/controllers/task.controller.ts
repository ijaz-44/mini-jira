// src/controllers/task.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { TaskService } from "../services/task.service.js";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const result = await TaskService.getTasks(req.query);
  // Pehle result direct spread ho raha tha, isko wapas waise hi rakhein:
  res.status(200).json({ success: true, ...result });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await TaskService.createTask(req.body, req.user!.id);
  res.status(201).json({ success: true, data: task });
});

export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  if (!id || !status) {
    res.status(400).json({ success: false, message: "Task ID and status are required" });
    return;
  }

  const updatedTask = await TaskService.updateTaskStatus(id, status);
  res.status(200).json({ success: true, data: updatedTask });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    res.status(400).json({ success: false, message: "Task ID is required" });
    return;
  }

  const updatedTask = await TaskService.updateTask(id, req.body);
  res.status(200).json({ success: true, data: updatedTask });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    res.status(400).json({ success: false, message: "Task ID is required" });
    return;
  }

  await TaskService.deleteTask(id);
  res.status(200).json({ success: true, message: "Task deleted successfully" });
});