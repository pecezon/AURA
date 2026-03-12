import { Router } from "express";
import { getSimulationByModuleId, getSimulationByTitle } from "./simulation.controller";


const router = Router()

router.get("/simulation-by-module/:moduleId", getSimulationByModuleId)
router.get("/simulation-by-title", getSimulationByTitle)

export default router
