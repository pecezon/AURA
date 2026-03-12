import { prisma } from "../config/prisma";
//import { Prisma } from "../generated/prisma/client";

export class EnrollmentService {
  async enrollInCourse(courseId: string, profileId: string) {
    try{
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId,
        profileId,
      },
      include: {
        course: true,
        profile: true,
      },
    });
    return { profileName: enrollment.profile.firstName, courseTitle: enrollment.course.title, enrolledAt: enrollment.enrolledAt.toISOString() };
  } catch (error: unknown){
        /*
        if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const conflictError: any = new Error(
          "Profile is already enrolled in this course"
        );
        conflictError.statusCode = 409;
        throw conflictError;
      }
        */
      throw error;
  }
  }

  async getAllEnrollments() {
    const enrollments = await prisma.courseEnrollment.findMany({
      include: {
        profile: true,
        course: true,
      },
    });
    return enrollments.map((e) => ({
      profileId: e.profileId,
      courseId: e.courseId,
      profileName: e.profile.firstName,
      courseTitle: e.course.title,
      enrolledAt: e.enrolledAt.toISOString(),
      status: e.status,
      progress: e.progress,
    }));
  }

  async getEnrollmentsByProfileId(profileId: string) {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { profileId },
      include: {
        profile: true,
        course: true,
      },
    });
    return enrollments.map((e) => ({
      profileId: e.profileId,
      courseId: e.courseId,
      profileName: e.profile.firstName,
      courseTitle: e.course.title,
      enrolledAt: e.enrolledAt.toISOString(),
      status: e.status,
      progress: e.progress,
    }));
  }
}

export const enrollmentService = new EnrollmentService();