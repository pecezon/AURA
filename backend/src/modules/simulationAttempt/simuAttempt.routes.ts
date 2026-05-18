import { Router } from "express";
import { createNewAttempt, getAllAttemptsByProfile, saveProgress, submitAttempt } from "./simuAttempt.controller";

const router = Router()

router.get("/:profileId", getAllAttemptsByProfile)
router.post("/create-attempt", createNewAttempt)
router.patch("/save-progress/:attemptId", saveProgress) 
router.patch("/submit/:attemptId", submitAttempt)

export default router