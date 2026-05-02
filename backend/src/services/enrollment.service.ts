import { prisma } from "../config/prisma";
import { Prisma } from "../../generated/prisma";

export class EnrollmentService {
  async enrollInCourse(courseId: string, profileId: string) {
    try {
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
      return {
        profileName: enrollment.profile.firstName,
        courseTitle: enrollment.course.title,
      };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const conflictError: any = new Error(
          "Profile is already enrolled in this course",
        );
        conflictError.statusCode = 409;
        throw conflictError;
      }

      throw error;
    }
  }

  async getAllEnrollments() {
    const enrollments = await prisma.courseEnrollment.findMany({
      include: {
        profile: true,
        course: { include: { regulations: true } },
      },
    });
    return enrollments.map((e) => ({
      profileId: e.profileId,
      courseId: e.courseId,
      profileName: e.profile.firstName,
      courseTitle: e.course.title,
      courseDescription: e.course.description,
      courseDuration: e.course.duration,
      courseType: e.course.type,
      courseRegulations: e.course.regulations.map(r => r.name),
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
        course: { include: { regulations: true } },
      },
    });
    return enrollments.map((e) => ({
      profileId: e.profileId,
      courseId: e.courseId,
      profileName: e.profile.firstName,
      courseTitle: e.course.title,
      courseDescription: e.course.description,
      courseDuration: e.course.duration,
      courseType: e.course.type,
      courseRegulations: e.course.regulations.map(r => r.name),
      enrolledAt: e.enrolledAt.toISOString(),
      status: e.status,
      progress: e.progress,
    }));
  }

  async getEnrollment(profileId: string, courseId: string) {
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        profileId_courseId: {
          profileId,
          courseId,
        },
      },
      include: {
        profile: {
          include: {
            completedModules: {
              where: {
                module: {
                  courseId,
                },
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      const error: any = new Error("Enrollment not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      profileId: enrollment.profileId,
      courseId: enrollment.courseId,
      status: enrollment.status,
      progress: enrollment.progress,
      completedModules: enrollment.profile.completedModules.map((cm) => cm.moduleId),
    };
  }

  async completeModule(profileId: string, courseId: string, moduleId: string) {
    return await prisma.$transaction(async (tx) => {
      // Verify enrollment
      const enrollment = await tx.courseEnrollment.findUnique({
        where: {
          profileId_courseId: {
            profileId,
            courseId,
          },
        },
      });

      if (!enrollment) {
        const error: any = new Error("Enrollment not found");
        error.statusCode = 404;
        throw error;
      }

      // Verify module belongs to course
      const module = await tx.module.findUnique({
        where: { id: moduleId },
        select: { courseId: true },
      });

      if (!module || module.courseId !== courseId) {
        const error: any = new Error("Module not found or does not belong to this course");
        error.statusCode = 400;
        throw error;
      }

      // Upsert completed module
      await tx.completedModule.upsert({
        where: {
          profileId_moduleId: {
            profileId,
            moduleId,
          },
        },
        update: {},
        create: {
          profileId,
          moduleId,
        },
      });

      // Recalculate progress
      const totalModules = await tx.module.count({
        where: { courseId },
      });

      const completedCount = await tx.completedModule.count({
        where: {
          profileId,
          module: { courseId },
        },
      });

      const progress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
      
      // Determine status
      let status = enrollment.status;
      let completedAt = enrollment.completedAt;
      
      if (progress === 100) {
        status = "COMPLETED";
        completedAt = completedAt || new Date();
      } else {
        status = progress > 0 ? "IN_PROGRESS" : "ASSIGNED";
        completedAt = null;
      }

      const updatedEnrollment = await tx.courseEnrollment.update({
        where: {
          profileId_courseId: {
            profileId,
            courseId,
          },
        },
        data: {
          progress,
          status,
          completedAt,
        },
      });

      // Get all completed modules to return
      const completedModules = await tx.completedModule.findMany({
        where: {
          profileId,
          module: { courseId },
        },
        select: { moduleId: true },
      });

      return {
        ...updatedEnrollment,
        completedModules: completedModules.map((cm) => cm.moduleId),
      };
    });
  }
}

export const enrollmentService = new EnrollmentService();
