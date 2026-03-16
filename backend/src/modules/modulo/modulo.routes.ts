import { Router } from "express";
import { createFullModule, getAllModulesByCourseId, getAllModulesContentByTypeAndCourseId, getModuleByTitle } from "./modulo.controller";

const router = Router();

router.post("/create-module", createFullModule)
router.get("/get-all-modules-by-course/:courseId", getAllModulesByCourseId)
router.get("/get-all-modules-content-by-type", getAllModulesContentByTypeAndCourseId)
router.get("/get-module-by-title", getModuleByTitle)

export default router