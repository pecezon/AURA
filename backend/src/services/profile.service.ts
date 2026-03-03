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
