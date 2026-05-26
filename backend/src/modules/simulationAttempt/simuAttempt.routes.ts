import { Router } from "express";
import { createNewAttempt, getAllAttemptsByProfile, saveProgress, submitAttempt } from "./simuAttempt.controller";

const router = Router()

router.param("profileId", (req: any, res: any, next: any, id: string) => {
  if (process.env.DEMO_MODE === "true" && req.headers["x-demo-override-role"]) {
    req.params.profileId = req.profile.id;
  }
  next();
});

router.get("/:profileId", getAllAttemptsByProfile)
router.post("/create-attempt", createNewAttempt)
router.patch("/save-progress/:attemptId", saveProgress) 
router.patch("/submit/:attemptId", submitAttempt)

export default router