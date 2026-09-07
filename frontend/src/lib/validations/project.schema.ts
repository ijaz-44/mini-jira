import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(50, "Project name cannot exceed 50 characters"),
  description: z.string().trim().max(500, "Description too long").optional(),
});

// Update ke liye z.partial() use karein jisse saare fields optional ho jate hain
export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;