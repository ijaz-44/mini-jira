// src/routes/task.routes.ts
import { Router } from "express";
import { createTask, getTasks, updateTaskStatus, updateTask, deleteTask } from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "../validators/task.validator.js";
import { filterQuerySchema } from "../validators/filter.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", validate(filterQuerySchema), getTasks);
router.post("/", validate(createTaskSchema), createTask);
router.patch("/:id/status", validate(updateTaskStatusSchema), updateTaskStatus);

// FIX: PUT ko PATCH me change kar diya hai taake frontend ki PATCH request match ho sakay
router.patch("/:id", validate(updateTaskSchema), updateTask);
router.put("/:id", validate(updateTaskSchema), updateTask); // Optional: Standard PUT backup

router.delete("/:id", deleteTask);

export default router;