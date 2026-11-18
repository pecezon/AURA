import { Role } from "../../generated/prisma";
import { prisma } from "../config/prisma";
import { getSuperAdminEmail } from "../middleware/requireSuperAdmin";

export async function getSuperAdminUsersService() {
  const users = await prisma.profile.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      employeeId: true,
      area: true,
      role: true,
      isProfileComplete: true,
      createdAt: true,
      _count: {
        select: {
          enrollments: true,
          quizAttempts: true,
          simulationAttempts: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

export async function updateUserRoleService(
  superAdminUserId: string,
  targetUserId: string,
  newRole: "EMPLOYEE" | "SUPERVISOR" | "ADMIN"
) {
  const superAdminEmail = getSuperAdminEmail();

  // Self-demotion guard: cannot modify own role
  if (superAdminUserId === targetUserId) {
    const error = new Error("SuperAdmin cannot modify their own role");
    (error as any).statusCode = 400;
    throw error;
  }

  const targetProfile = await prisma.profile.findUnique({
    where: { id: targetUserId },
  });

  if (!targetProfile) {
    const error = new Error("User not found");
    (error as any).statusCode = 404;
    throw error;
  }

  // Prevent modifying account associated with the primary superadmin email
  if (targetProfile.email?.trim().toLowerCase() === superAdminEmail) {
    const error = new Error("Cannot modify role of the primary SuperAdmin account");
    (error as any).statusCode = 400;
    throw error;
  }

  const updatedProfile = await prisma.profile.update({
    where: { id: targetUserId },
    data: {
      role: newRole as Role,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      employeeId: true,
      area: true,
      role: true,
      isProfileComplete: true,
      createdAt: true,
    },
  });

  console.info(
    `[AUDIT - ROLE_CHANGE] SuperAdmin (${superAdminEmail}) updated role of user ${targetUserId} (${targetProfile.email}) from ${targetProfile.role} to ${newRole} at ${new Date().toISOString()}`
  );

  return updatedProfile;
}
