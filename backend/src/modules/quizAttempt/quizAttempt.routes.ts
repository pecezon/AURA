import { Router } from "express";
import { createQuizAttemptController } from "./quizAttempt.controller";

const router = Router();

router.post("/create-quiz-attempt", createQuizAttemptController);

export default router;