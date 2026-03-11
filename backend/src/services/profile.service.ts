import { prisma } from "../config/prisma";

export async function ensureProfile(user: any) {
  let profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        id: user.id,
        email: user.email,
        role: "EMPLOYEE",
      },
    });
  }

  return profile;
}

export async function updateProfile(profileId: string, data: Partial<{ firstName: string; lastName: string; area: string }>) {
  const updated = await prisma.profile.update({
    where: { id: profileId },
    data,
  });
  return updated;
}


export async function searchProfiles(name: string) {
  const profiles = await prisma.profile.findMany({
    where: {
      OR: [
        { firstName: { contains: name, mode: 'insensitive' } },
        { lastName: { contains: name, mode: 'insensitive' } },
      ],
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
  return profiles.map((profile) => ({
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    employeeId: profile.employeeId,
    area: profile.area,
    role: profile.role,
    isProfileComplete: profile.isProfileComplete,
    createdAt: profile.createdAt.toISOString(),
  }));
}

export async function getProfileById(id: string) {
  const profile = await prisma.profile.findUnique({
    where: { id },
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
  if (!profile) return null;
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    employeeId: profile.employeeId,
    area: profile.area,
    role: profile.role,
    isProfileComplete: profile.isProfileComplete,
    createdAt: profile.createdAt.toISOString(),
  };
}
