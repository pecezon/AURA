import { Router } from "express";
import { generateCourseController } from "./openai.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

// Admin and supervisor users can generate courses using AI
router.post("/generate-course", requireAdmin, generateCourseController);

export default router;
