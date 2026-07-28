// src/validators/filter.validator.ts
import { z } from "zod";

export const filterQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.string().optional(),
  }),
});