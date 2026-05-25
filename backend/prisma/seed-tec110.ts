import { prisma } from '../src/config/prisma';
import { CourseType } from '../generated/prisma';

async function main() {
  console.log("Seeding TEC110 Polyethylene Gas Networks Course...");

  // 1. Ensure Regulations exist
  const nom003 = await prisma.regulation.upsert({
    where: { name: "NOM-003-ASEA-2016" },
    update: { description: "Distribución de gas natural y gas licuado de petróleo por ductos." },
    create: {
      name: "NOM-003-ASEA-2016",
      description: "Distribución de gas natural y gas licuado de petróleo por ductos."
    }
  });

  const asmeB318 = await prisma.regulation.upsert({
    where: { name: "ASME B31.8" },
    update: { description: "Gas Transmission and Distribution Piping Systems." },
    create: {
      name: "ASME B31.8",
      description: "Gas Transmission and Distribution Piping Systems."
    }
  });

  console.log("Regulations NOM-003-ASEA-2016 and ASME B31.8 are ensured.");

  // 2. Define Simulation Configuration
  const simulationConfig = {
    simulationType: "GUIDED_SEQUENCE",
    scenario: "Estación de Distribución - Red de Polietileno Sempra Infrastructure",
    imageUrl: "/simulations/polyethylene_network_1.png",
    timeLimitSeconds: 240,
    hotspots: [
      {
        id: "p1",
        type: "INSPECT",
        riskType: "Inspección de Tubería PE",
        name: "Inspección de Tubería y Alineación",
        x: 2.0,
        y: 46.0,
        width: 28.0,
        height: 40.0,
        stepOrder: 1,
        instruction: "Verifica la superficie exterior del tubo de polietileno para detectar ralladuras o daños mecánicos antes de iniciar el ensamble.",
        quiz: {
          question: "¿Cuál es la profundidad máxima permitida para ralladuras o surcos en la superficie exterior del tubo de polietileno (PE) según la normativa ASME B31.8 y NOM-003-ASEA?",
          options: [
            { id: "o1", text: "Hasta un 20% del espesor de pared de la tubería, siempre que no pase de lado a lado.", feedback: "¡Inaceptable! Defectos de esta profundidad reducen peligrosamente la resistencia a la presión de la red." },
            { id: "o2", text: "Un 10% del espesor de la pared de la tubería; cualquier tubo con ralladuras más profundas debe ser descartado.", isCorrect: true },
            { id: "o3", text: "No hay límite de profundidad ya que el polietileno es flexible y se expande bajo presión.", feedback: "¡Incorrecto! Las muescas mecánicas actúan como concentradores de esfuerzo y provocan grietas por fatiga." }
          ]
        },
        justification: "ASME B31.8 y NOM-003-ASEA-2016 regulan que cualquier daño o ralladura mayor al 10% del espesor nominal del tubo compromete la resistencia mecánica y requiere el descarte de la sección afectada."
      },
      {
        id: "p2",
        type: "FUSION",
        riskType: "Fusión de Tubería PE",
        name: "Alineador y Raspado de Tubería",
        x: 30.0,
        y: 38.0,
        width: 28.0,
        height: 55.0,
        stepOrder: 2,
        instruction: "Utiliza la herramienta raspadora para remover la capa de oxidación exterior y alinea los extremos del tubo en el equipo de termofusión.",
        quiz: {
          question: "¿Por qué es fundamental realizar el raspado mecánico de los extremos de la tubería de polietileno antes de realizar una unión por termofusión o electrofusión?",
          options: [
            { id: "o1", text: "Para asegurar que los tubos entren fácilmente en el alineador.", feedback: "Incorrecto. El alineador sujeta los tubos por diámetro exterior, el raspado tiene una función química/molecular." },
            { id: "o2", text: "Para eliminar la capa externa oxidada por la intemperie y garantizar la interpenetración molecular del polímero durante la fusión.", isCorrect: true },
            { id: "o3", text: "Para calentar la tubería de manera uniforme con un soplete.", feedback: "¡Peligro! El calentamiento con fuego directo degrada químicamente el polietileno y arruina la soldadura." }
          ]
        },
        justification: "El polietileno expuesto al aire genera una delgada capa de oxidación que actúa como aislante térmico y barrera molecular. Si no se raspa mecánicamente, la fusión fallará por falta de adherencia al presurizar la línea."
      },
      {
        id: "p3",
        type: "PRESSURE_TEST",
        riskType: "Prueba de Hermeticidad",
        name: "Manifold y Manómetro de Prueba",
        x: 58.0,
        y: 28.0,
        width: 24.0,
        height: 66.0,
        stepOrder: 3,
        instruction: "Conecta el cabezal de prueba y presuriza gradualmente la red con nitrógeno para realizar la prueba de hermeticidad de acuerdo con el estándar.",
        quiz: {
          question: "Al realizar una prueba de presión neumática con nitrógeno en una línea de polietileno, ¿cuál es la principal medida de seguridad operativa?",
          options: [
            { id: "o1", text: "Realizar la prueba lo más rápido posible elevando la presión de golpe.", feedback: "¡Extremadamente peligroso! La presurización brusca puede generar fallas catastróficas y proyectar fragmentos letales." },
            { id: "o2", text: "Establecer un área de exclusión (línea de fuego), presurizar de manera gradual por etapas y verificar que no haya personal en las cercanías de las uniones expuestas.", isCorrect: true },
            { id: "o3", text: "Inspeccionar visualmente de cerca y tocar las uniones mientras se alcanza la presión máxima de prueba.", feedback: "¡Inseguro! Exponerse directamente a uniones bajo alta presión neumática viola los protocolos de seguridad." }
          ]
        },
        justification: "Las pruebas neumáticas almacenan una enorme cantidad de energía elástica. NOM-003-ASEA-2016 exige zonas de exclusión de seguridad y presurización controlada para mitigar el riesgo de una liberación violenta."
      },
      {
        id: "p4",
        type: "PURGE",
        riskType: "Desplazamiento y Purga",
        name: "Válvula de Purga y Detector de Gas",
        x: 82.0,
        y: 13.0,
        width: 15.0,
        height: 80.0,
        stepOrder: 4,
        instruction: "Purga el aire remanente en la tubería utilizando un colchón de nitrógeno y posteriormente introduce gas natural de forma segura.",
        quiz: {
          question: "¿Por qué se introduce un colchón de gas inerte (Nitrógeno) como paso intermedio al desplazar el aire de la tubería e introducir gas natural?",
          options: [
            { id: "o1", text: "Para evitar que el gas natural y el aire entren en contacto directo, previniendo la formación de una atmósfera explosiva dentro del tubo.", isCorrect: true },
            { id: "o2", text: "Para enfriar la red interna de gas y aumentar su densidad de flujo.", feedback: "Incorrecto. El nitrógeno no se utiliza con fines termodinámicos o de enfriamiento." },
            { id: "o3", text: "Para aromatizar el gas natural con odorizante antes de que llegue a los consumidores.", feedback: "Incorrecto. El odorizante (mercaptano) se inyecta en estaciones fijas de regulación, no se mezcla mediante purgas de nitrógeno." }
          ]
        },
        justification: "Para evitar la inflamabilidad y explosión, se debe evitar que la mezcla de metano y oxígeno se encuentre dentro del rango explosivo (5%-15%). El nitrógeno actúa como gas barrera inerte de separación."
      }
    ]
  };

  // 3. Check if Course already exists
  const existingCourse = await prisma.course.findFirst({
    where: { title: "TEC110: Diseño, construcción, comisionamiento y puesta en marcha de redes de polietileno para transporte y distribución de gas natural" },
    include: { modules: true }
  });

  if (existingCourse) {
    console.log("El curso TEC110 ya existe. Actualizando la simulación de su primer módulo...");
    if (existingCourse.modules.length > 0) {
      const moduleId = existingCourse.modules[0].id;
      await prisma.simulation.upsert({
        where: { moduleId },
        update: {
          title: "Simulación de Redes de Polietileno TEC110",
          passingScore: 80,
          configuration: simulationConfig
        },
        create: {
          moduleId,
          title: "Simulación de Redes de Polietileno TEC110",
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

  // 4. Create the new course
  const course = await prisma.course.create({
    data: {
      title: "TEC110: Diseño, construcción, comisionamiento y puesta en marcha de redes de polietileno para transporte y distribución de gas natural",
      description: "Curso de especialización para el diseño, tendido, fusión, prueba de hermeticidad y comisionamiento de redes de tubería de polietileno de alta densidad (PEAD) para distribución de gas natural en base a la normatividad nacional e internacional.",
      type: CourseType.TECHNICAL,
      duration: "5 horas",
      isPublished: true,
      regulations: {
        connect: [
          { id: nom003.id },
          { id: asmeB318.id }
        ]
      },
      modules: {
        create: [
          {
            title: "Simulación de Instalación y Comisionamiento de Red PEAD",
            order: 1,
            simulation: {
              create: {
                title: "Simulación de Redes de Polietileno TEC110",
                passingScore: 80,
                configuration: simulationConfig
              }
            }
          }
        ]
      }
    }
  });

  console.log(`Curso TEC110 creado con ID: ${course.id}`);
  console.log("Seed de TEC110 finalizado correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
