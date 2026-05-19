import { Router } from "express";
import { createFullModule, getAllModulesByCourseId, getAllModulesContentByTypeAndCourseId, getModuleByTitle, getModuleById } from "./modulo.controller";

const router = Router();

router.post("/create-module", createFullModule)
router.get("/get-all-modules-by-course/:courseId", getAllModulesByCourseId)
router.get("/get-all-modules-content-by-type", getAllModulesContentByTypeAndCourseId)
router.get("/get-module-by-title", getModuleByTitle)
router.get("/get-module-by-id/:moduleId", getModuleById)

export default router