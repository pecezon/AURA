import { Router } from "express";
import { createNewSimulation, getSimulationByModuleId, getSimulationByTitle } from "./simulation.controller";


const router = Router()

router.get("/simulation-by-module/:moduleId", getSimulationByModuleId)
router.get("/simulation-by-title", getSimulationByTitle)
router.post("/simulation-create", createNewSimulation)

export default router
