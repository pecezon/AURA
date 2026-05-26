import { Router } from "express";
import { createQuizAttemptController, getAllAttemptsOfQuizByUserController, getAttemptsByProfileController, getAttemptsByQuizIdController } from "./quizAttempt.controller";

const router = Router();

router.param("profileId", (req: any, res: any, next: any, id: string) => {
  if (process.env.DEMO_MODE === "true" && req.headers["x-demo-override-role"]) {
    req.params.profileId = req.profile.id;
  }
  next();
});

router.post("/create-quiz-attempt", createQuizAttemptController);
router.get("/get-by-quiz-and-profile", getAllAttemptsOfQuizByUserController);
router.get("/by-profile/:profileId", getAttemptsByProfileController);
router.get("/by-quiz/:quizId", getAttemptsByQuizIdController);

export default router;