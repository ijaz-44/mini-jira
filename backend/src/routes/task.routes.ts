// src/routes/task.routes.ts
import { Router } from "express";
import { createTask, getTasks } from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema } from "../validators/task.validator.js";
import { filterQuerySchema } from "../validators/filter.validator.js";

const router = Router();

router.use(authenticate);
router.get("/", validate(filterQuerySchema), getTasks);
router.post("/", validate(createTaskSchema), createTask);

export default router;
