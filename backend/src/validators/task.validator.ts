// src/validators/task.validator.ts
import { z } from "zod";
import { TASK_STATUS } from "../constants/status.js";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    projectId: z.string(),
    assigneeId: z.string().optional(),
    status: z.nativeEnum(TASK_STATUS).optional(),
  }),
});