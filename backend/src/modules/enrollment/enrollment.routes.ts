import { Router } from "express";
import { enrollInCourseController, getAllEnrollmentsController, getEnrollmentsByProfileIdController } from "./enrollment.controller";

const router = Router();

router.post("/course-enrollment", enrollInCourseController);
router.get("/all", getAllEnrollmentsController);
router.get("/:profileId", getEnrollmentsByProfileIdController);

export default router;