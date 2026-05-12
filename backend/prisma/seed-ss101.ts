import { prisma } from '../src/config/prisma';
import { CourseType } from '../generated/prisma';

async function main() {
  console.log("Seeding SS101 Course for Sempra Infrastructure...");

  const existingCourse = await prisma.course.findFirst({
    where: { title: "SS101: Identificación de Riesgos en Gasoductos" },
    include: { modules: true }
  });

  const simulationConfig = {
    scenario: "Terminal de Gasoductos Sempra",
    imageUrl: "placeholder-sempra-terminal",
    timeLimitSeconds: 120,
    hotspots: [
      {
        id: "risk-1",
        type: "GAS_LEAK",
        name: "Fuga de Gas en Válvula Principal",
        x: 45.5,
        y: 60.2,
        radius: 5,
        penaltyPoints: 30
      },
      {
        id: "risk-2",
        type: "NO_PPE",
        name: "Personal sin equipo de protección (Casco/Lentes)",
        x: 75.0,
        y: 30.5,
        radius: 6,
        penaltyPoints: 20
      },
      {
        id: "risk-3",
        type: "OBSTRUCTION",
        name: "Maquinaria pesada obstruyendo ruta de evacuación",
        x: 20.0,
        y: 80.0,
        radius: 8,
        penaltyPoints: 15
      }
    ]
  };

  if (existingCourse) {
    console.log("El curso SS101 ya existe. Actualizando la simulación de su primer módulo...");
    if (existingCourse.modules.length > 0) {
      const moduleId = existingCourse.modules[0].id;
      await prisma.simulation.upsert({
        where: { moduleId },
        update: {
          title: "Simulación de Riesgos SS101",
          passingScore: 80,
          configuration: simulationConfig
        },
        create: {
          moduleId,
          title: "Simulación de Riesgos SS101",
          passingScore: 80,
          configuration: simulationConfig
        }
      });
      console.log("Simulación añadida/actualizada en el curso existente.");
    } else {
      console.log("El curso no tiene módulos. No se pudo inyectar la simulación.");
    }
    return;
  }

  // Find the regulation if it exists (from previous seeds)
  const regulation = await prisma.regulation.findFirst({
    where: { name: "NOM-029-STPS-2011" }
  });

  const course = await prisma.course.create({
    data: {
      title: "SS101: Identificación de Riesgos en Gasoductos",
      description: "Curso de capacitación para la identificación de riesgos críticos en terminales y gasoductos de Sempra Infraestructura.",
      type: CourseType.SECURITY,
      duration: "2 horas",
      isPublished: true,
      regulations: regulation ? {
        connect: { id: regulation.id }
      } : undefined,
      modules: {
        create: [
          {
            title: "Simulación Práctica: Terminal de Gas",
            order: 1,
            simulation: {
              create: {
                title: "Simulación de Riesgos SS101",
                passingScore: 80,
                configuration: {
                  scenario: "Terminal de Gasoductos Sempra",
                  imageUrl: "placeholder-sempra-terminal",
                  timeLimitSeconds: 120,
                  hotspots: [
                    {
                      id: "risk-1",
                      type: "GAS_LEAK",
                      name: "Fuga de Gas en Válvula Principal",
                      x: 45.5, // porcentaje %
                      y: 60.2, // porcentaje %
                      radius: 5,
                      penaltyPoints: 30
                    },
                    {
                      id: "risk-2",
                      type: "NO_PPE",
                      name: "Personal sin equipo de protección (Casco/Lentes)",
                      x: 75.0,
                      y: 30.5,
                      radius: 6,
                      penaltyPoints: 20
                    },
                    {
                      id: "risk-3",
                      type: "OBSTRUCTION",
                      name: "Maquinaria pesada obstruyendo ruta de evacuación",
                      x: 20.0,
                      y: 80.0,
                      radius: 8,
                      penaltyPoints: 15
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
  });

  console.log(`Curso creado con ID: ${course.id}`);
  console.log("Seed de SS101 finalizado correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
