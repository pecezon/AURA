import "dotenv/config";
import { prisma } from "../src/config/prisma";

async function main() {
  console.log("Iniciando inscripción de todos los perfiles de usuario en los 4 nuevos cursos...");

  // 1. Fetch all profiles
  const profiles = await prisma.profile.findMany();
  console.log(`Encontrados ${profiles.length} perfiles en la base de datos.`);

  if (profiles.length === 0) {
    console.log("No hay perfiles de usuario registrados en la base de datos.");
    return;
  }

  // 2. Fetch the 4 target courses
  const courseTitles = [
    "SS101: Seguridad Industrial Básica en Terminales",
    "SS104: Seguridad Eléctrica y Libranza (NOM-029)",
    "TEC102: Operación y Purga de Bombas Centrífugas",
    "TEC110: Construcción y Pruebas de Redes PEAD"
  ];

  const courses = await prisma.course.findMany({
    where: {
      title: { in: courseTitles }
    }
  });

  console.log(`Encontrados ${courses.length} de los 4 cursos objetivos.`);

  if (courses.length === 0) {
    console.log("Error: No se encontró ninguno de los cursos objetivo en la base de datos.");
    return;
  }

  // 3. Create course enrollments
  const enrollmentsData = [];
  for (const profile of profiles) {
    for (const course of courses) {
      enrollmentsData.push({
        profileId: profile.id,
        courseId: course.id,
        status: "ASSIGNED" as const,
        progress: 0
      });
    }
  }

  const result = await prisma.courseEnrollment.createMany({
    data: enrollmentsData,
    skipDuplicates: true
  });

  console.log(`¡Inscripción exitosa! Se crearon/aseguraron ${result.count} inscripciones de cursos.`);
}

main()
  .catch((e) => {
    console.error("Error durante la inscripción de usuarios:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
