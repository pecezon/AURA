import { Router } from "express";
import { enrollInCourseController, getAllEnrollmentsController, getEnrollmentsByProfileIdController, getEnrollmentController, completeModuleController } from "./enrollment.controller";

const router = Router();

router.post("/course-enrollment", enrollInCourseController);
router.get("/all", getAllEnrollmentsController);
router.get("/:profileId", getEnrollmentsByProfileIdController);
router.get("/:profileId/:courseId", getEnrollmentController);
router.patch("/:profileId/:courseId/complete-module", completeModuleController);

export default router;