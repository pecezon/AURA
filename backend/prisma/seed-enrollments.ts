import { prisma } from '../src/config/prisma';

async function main() {
  const ss101Course = await prisma.course.findFirst({
    where: { title: "SS101: Identificación de Riesgos en Gasoductos" }
  });

  if (!ss101Course) {
    console.log("Curso SS101 no encontrado");
    return;
  }

  const profiles = await prisma.profile.findMany();

  for (const profile of profiles) {
    await prisma.courseEnrollment.upsert({
      where: {
        profileId_courseId: {
          profileId: profile.id,
          courseId: ss101Course.id
        }
      },
      update: {},
      create: {
        profileId: profile.id,
        courseId: ss101Course.id,
        status: "ASSIGNED"
      }
    });
  }

  console.log(`✅ Inscriptos ${profiles.length} usuarios al curso SS101`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
