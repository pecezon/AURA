import { Router } from "express";
import { createQuizAttemptController, getAllAttemptsOfQuizByUserController, getAttemptsByProfileController, getAttemptsByQuizIdController } from "./quizAttempt.controller";

const router = Router();

router.post("/create-quiz-attempt", createQuizAttemptController);
router.get("/get-by-quiz-and-profile", getAllAttemptsOfQuizByUserController);
router.get("/by-profile/:profileId", getAttemptsByProfileController);
router.get("/by-quiz/:quizId", getAttemptsByQuizIdController);

export default router;