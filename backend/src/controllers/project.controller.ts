// src/controllers/project.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ProjectService } from "../services/project.service.js";

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await ProjectService.getProjects(req.user!.id);
  res.status(200).json({ success: true, data: projects });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await ProjectService.createProject(req.body, req.user!.id);
  res.status(201).json({ success: true, data: project });
});