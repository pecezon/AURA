import { Router } from "express";
import { createRegulationController, getAllRegulationsController } from "./regulation.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", getAllRegulationsController);
router.post("/", requireAdmin, createRegulationController);

export default router;
