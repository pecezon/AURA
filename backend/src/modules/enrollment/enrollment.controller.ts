import { Request, Response, NextFunction } from "express";
import { createCourseEnrollmentSchema } from "./enrollment.validation";
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