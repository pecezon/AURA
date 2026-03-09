import { z } from "zod";

export const createCourseEnrollmentSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  profileId: z.string().min(1, "Profile ID is required"),
});

export type CreateCourseEnrollmentInput = z.infer<typeof createCourseEnrollmentSchema>;