import { Router } from "express";
import { createNewSimulation, getSimulationByModuleId, getSimulationByTitle, updateSimulation } from "./simulation.controller";


const router = Router()

router.get("/simulation-by-module/:moduleId", getSimulationByModuleId)
router.get("/simulation-by-title", getSimulationByTitle)
router.post("/simulation-create", createNewSimulation)
router.put("/update-simulation", updateSimulation)

export default router
