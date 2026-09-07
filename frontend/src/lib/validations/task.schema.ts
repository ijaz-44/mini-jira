import { z } from "zod";

export const TaskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]);
export const TaskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().trim().optional(),
  status: TaskStatusEnum.default("TODO"),
  priority: TaskPriorityEnum.default("MEDIUM"),
  projectId: z.string().min(1, "Project is required"),
  assignedTo: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;