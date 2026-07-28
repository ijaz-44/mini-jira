// src/validators/project.validator.ts
import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    key: z.string().min(2).max(10),
  }),
});
