import { Router } from "express";
import { createNewSimulation, getSimulationById, getSimulationByModuleId, getSimulationByTitle, updateSimulation } from "./simulation.controller";


const router = Router()

router.get("/simulation-by-module/:moduleId", getSimulationByModuleId)
router.get("/:simulationId", getSimulationById)
router.get("/simulation-by-title", getSimulationByTitle)
router.post("/simulation-create", createNewSimulation)
router.put("/update-simulation/:simulationId", updateSimulation)

export default router
