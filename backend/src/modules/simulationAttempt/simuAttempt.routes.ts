import { Router } from "express";
import { createNewAttempt, getAllAttemptsByProfile, saveProgress, submitAttempt } from "./simuAttempt.controller";

const router = Router()

router.get("/:profileId", getAllAttemptsByProfile)
router.post("/create-attempt", createNewAttempt)
router.patch("/save-progress", saveProgress) 
router.patch("/submit", submitAttempt)

export default router