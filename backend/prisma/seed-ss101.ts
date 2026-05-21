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
        id: "h1",
        type: "OIL_SPILL",
        riskType: "Derrame de Aceite",
        name: "Derrame de Aceite",
        x: 25.0,
        y: 80.0,
        radius: 10,
        penaltyPoints: 25,
        justification: "Los derrames en el piso son una de las causas más frecuentes de accidentes por resbalones y caídas. Además, representan un riesgo grave de incendio o de contaminación."
      },
      {
        id: "h2",
        type: "NO_PPE",
        riskType: "Falta de EPP (Casco)",
        name: "Falta de EPP (Casco)",
        x: 37.0,
        y: 46.0,
        radius: 8,
        penaltyPoints: 25,
        justification: "El uso de Equipo de Protección Personal (EPP) es mandatorio en áreas operativas. La ausencia de casco expone al trabajador a traumatismos craneoencefálicos por caída de herramientas o materiales."
      },
      {
        id: "h3",
        type: "EXPOSED_CABLES",
        riskType: "Cables Expuestos",
        name: "Cables Expuestos",
        x: 80.0,
        y: 55.0,
        radius: 12,
        penaltyPoints: 25,
        justification: "El cableado eléctrico expuesto fuera de su canalización o panel cerrado crea un riesgo inminente de electrocución, cortocircuito y posibles arcos eléctricos que pueden desencadenar incendios."
      },
      {
        id: "h4",
        type: "LOOSE_CABLES",
        riskType: "Cables Sueltos",
        name: "Cables Sueltos",
        x: 74.0,
        y: 65.0,
        radius: 10,
        penaltyPoints: 25,
        justification: "Los cables sueltos colgando o tirados en el suelo representan un riesgo grave de tropiezo y caída, además de peligro eléctrico si llegan a entrar en contacto con agua o maquinaria."
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
                      id: "h1",
                      type: "OIL_SPILL",
                      riskType: "Derrame de Aceite",
                      name: "Derrame de Aceite",
                      x: 25.0,
                      y: 80.0,
                      radius: 10,
                      penaltyPoints: 25,
                      justification: "Los derrames en el piso son una de las causas más frecuentes de accidentes por resbalones y caídas. Además, representan un riesgo grave de incendio o de contaminación."
                    },
                    {
                      id: "h2",
                      type: "NO_PPE",
                      riskType: "Falta de EPP (Casco)",
                      name: "Falta de EPP (Casco)",
                      x: 37.0,
                      y: 46.0,
                      radius: 8,
                      penaltyPoints: 25,
                      justification: "El uso de Equipo de Protección Personal (EPP) es mandatorio en áreas operativas. La ausencia de casco expone al trabajador a traumatismos craneoencefálicos por caída de herramientas o materiales."
                    },
                    {
                      id: "h3",
                      type: "EXPOSED_CABLES",
                      riskType: "Cables Expuestos",
                      name: "Cables Expuestos",
                      x: 80.0,
                      y: 55.0,
                      radius: 12,
                      penaltyPoints: 25,
                      justification: "El cableado eléctrico expuesto fuera de su canalización o panel cerrado crea un riesgo inminente de electrocución, cortocircuito y posibles arcos eléctricos que pueden desencadenar incendios."
                    },
                    {
                      id: "h4",
                      type: "LOOSE_CABLES",
                      riskType: "Cables Sueltos",
                      name: "Cables Sueltos",
                      x: 74.0,
                      y: 65.0,
                      radius: 10,
                      penaltyPoints: 25,
                      justification: "Los cables sueltos colgando o tirados en el suelo representan un riesgo grave de tropiezo y caída, además de peligro eléctrico si llegan a entrar en contacto con agua o maquinaria."
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
