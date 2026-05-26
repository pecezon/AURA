import { Router } from "express";
import { enrollInCourseController, getAllEnrollmentsController, getEnrollmentsByProfileIdController, getEnrollmentController, completeModuleController } from "./enrollment.controller";

const router = Router();

router.param("profileId", (req: any, res: any, next: any, id: string) => {
  if (process.env.DEMO_MODE === "true" && req.headers["x-demo-override-role"]) {
    req.params.profileId = req.profile.id;
  }
  next();
});

router.post("/course-enrollment", enrollInCourseController);
router.get("/all", getAllEnrollmentsController);
router.get("/:profileId", getEnrollmentsByProfileIdController);
router.get("/:profileId/:courseId", getEnrollmentController);
router.patch("/:profileId/:courseId/complete-module", completeModuleController);

export default router;