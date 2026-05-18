import { Router } from "express";
import { generateCourseController } from "./openai.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

// Only admin users should be able to generate courses using AI
router.post("/generate-course", requireAdmin, generateCourseController);

export default router;
