// src/routes/project.routes.ts
import { Router } from "express";
import { createProject, getProjects } from "../controllers/project.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProjectSchema } from "../validators/project.validator.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(authenticate);
router.get("/", getProjects);
router.post("/", authorize(ROLES.ADMIN, ROLES.MANAGER), validate(createProjectSchema), createProject);

export default router;