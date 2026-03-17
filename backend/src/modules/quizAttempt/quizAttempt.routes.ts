import { Router } from "express";
import { createQuizAttemptController, getAllAttemptsOfQuizByUserController, getAttemptsByProfileController, getAttemptsByQuizIdController } from "./quizAttempt.controller";

const router = Router();

router.post("/create-quiz-attempt", createQuizAttemptController);
router.get("/get-by-quiz-and-profile", getAllAttemptsOfQuizByUserController);
router.get("/:profileId", getAttemptsByProfileController);
router.get("/:quizId", getAttemptsByQuizIdController);

export default router;