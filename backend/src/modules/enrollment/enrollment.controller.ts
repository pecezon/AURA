import { Request, Response, NextFunction } from "express";
import { createCourseEnrollmentSchema, completeModuleSchema } from "./enrollment.validation";
import { enrollmentService } from "../../services/enrollment.service";

export async function enrollInCourseController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createCourseEnrollmentSchema.parse(req.body);
    const { courseId, profileId } = parsed;
    const enrollment = await enrollmentService.enrollInCourse(courseId, profileId);
    return res.status(201).json(enrollment);
  } catch (err) {
    return next(err);
  }
}

export async function getAllEnrollmentsController(req: Request, res: Response, next: NextFunction) {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    return res.json(enrollments);
  } catch (err) {
    return next(err);
  }
}

export async function getEnrollmentsByProfileIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const { profileId} = req.params as { profileId: string };
    const enrollments = await enrollmentService.getEnrollmentsByProfileId(profileId);
    return res.json(enrollments);
  } catch (err) {
    return next(err);
  }
}

export async function getEnrollmentController(req: Request, res: Response, next: NextFunction) {
  try {
    const { profileId, courseId } = req.params as { profileId: string; courseId: string };
    const enrollment = await enrollmentService.getEnrollment(profileId, courseId);
    return res.json(enrollment);
  } catch (err: any) {
    if (err.statusCode === 404) {
      return res.status(404).json({ error: err.message });
    }
    return next(err);
  }
}


export async function completeModuleController(req: Request, res: Response, next: NextFunction) {
  try {
    const { profileId, courseId } = req.params as { profileId: string; courseId: string };

    const userProfile = (req as any).profile;
    if (profileId !== userProfile.id && userProfile.role !== "ADMIN" && userProfile.role !== "OWNER") {
      return res.status(403).json({ error: "Forbidden: You can only modify your own enrollments" });
    }
    const parsed = completeModuleSchema.parse(req.body);
    
    const result = await enrollmentService.completeModule(profileId, courseId, parsed.moduleId);
    return res.json(result);
  } catch (err: any) {
    if (err.statusCode === 404) {
      return res.status(404).json({ error: err.message });
    }
    return next(err);
  }
}