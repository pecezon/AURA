import { prisma } from '../src/config/prisma';
import { CourseType } from '../generated/prisma';

async function main() {
  console.log("Seeding SS104 Course for Sempra Infrastructure...");

  // 1. Ensure the regulations exist
  const nom029 = await prisma.regulation.upsert({
    where: { name: "NOM-029-STPS-2011" },
    update: { description: "Mantenimiento de las instalaciones eléctricas en los centros de trabajo-Condiciones de seguridad." },
    create: {
      name: "NOM-029-STPS-2011",
      description: "Mantenimiento de las instalaciones eléctricas en los centros de trabajo-Condiciones de seguridad."
    }
  });

  const nfpa70e = await prisma.regulation.upsert({
    where: { name: "NFPA 70E" },
    update: { description: "Standard for Electrical Safety in the Workplace." },
    create: {
      name: "NFPA 70E",
      description: "Standard for Electrical Safety in the Workplace."
    }
  });

  console.log("Regulations NOM-029-STPS-2011 and NFPA 70E are ensured.");  // 2. Define Simulation Configuration
  const simulationConfig = {
    simulationType: "GUIDED_SEQUENCE",
    scenario: "Subestación de Control de Motores (MCC)",
    imageUrl: "/simulations/electrical_safety_1.png",
    timeLimitSeconds: 180,
    hotspots: [
      {
        id: "h1",
        type: "SWITCH",
        riskType: "Libranza Eléctrica",
        name: "Interruptor Principal 480V",
        x: 10.0,
        y: 15.0,
        width: 20.0,
        height: 55.0,
        stepOrder: 1,
        instruction: "Encuentra e interactúa con el interruptor principal de alimentación de la subestación para realizar la desconexión segura (Libranza).",
        quiz: {
          question: "Al realizar la desconexión de un interruptor de fuerza bajo carga para mantenimiento, ¿cuál es la medida preventiva de seguridad inmediata?",
          options: [
            { id: "o1", text: "Abrir directamente la puerta del gabinete sin usar protección especial.", feedback: "¡Inseguro! Abrir la puerta bajo carga sin protección ante un potencial arco eléctrico viola la NOM-029 y la NFPA 70E." },
            { id: "o2", text: "Posicionarse a un costado del tablero (fuera de la línea de fuego ante posible arco eléctrico), usar careta facial Arc Flash y girar la manija de operación a la posición OFF.", isCorrect: true },
            { id: "o3", text: "Cortar los cables alimentadores con pinzas comunes dieléctricas.", feedback: "¡Peligro mortal! Cortar cables vivos sin verificar ausencia de tensión ni realizar libranza puede provocar un arco eléctrico letal." }
          ]
        },
        justification: "La NOM-029-STPS-2011 exige realizar la libranza (corte de energía) antes de intervenir. Se debe operar de costado para evitar el impacto directo en el rostro en caso de un arco eléctrico (Arc Flash) inesperado."
      },
      {
        id: "h2",
        type: "LOTO_LOCK",
        riskType: "Bloqueo y Candadeo (LOTO)",
        name: "Dispositivo de Bloqueo LOTO",
        x: 32.0,
        y: 20.0,
        width: 18.0,
        height: 45.0,
        stepOrder: 2,
        instruction: "Aplica el bloqueo físico y etiquetado (LOTO) en la manija del interruptor principal desenergizado.",
        quiz: {
          question: "Según la NOM-029-STPS-2011, ¿quién debe conservar la llave única del candado de bloqueo instalado en el disyuntor?",
          options: [
            { id: "o1", text: "El supervisor del centro de trabajo para emergencias.", feedback: "Incorrecto. Si el supervisor tiene la llave, podría energizar el circuito por error mientras el trabajador sigue interviniendo." },
            { id: "o2", text: "El encargado general de la subestación.", feedback: "Incorrecto. Ningún tercero debe poseer control de la llave de tu candado de seguridad." },
            { id: "o3", text: "Estrictamente el trabajador autorizado que realiza la actividad de mantenimiento.", isCorrect: true }
          ]
        },
        justification: "El candado LOTO debe ser personal y la llave retenida exclusivamente por el trabajador para evitar que terceros energicen el circuito por accidente mientras se realiza el trabajo."
      },
      {
        id: "h3",
        type: "MEASURE",
        riskType: "Verificación de Ausencia de Tensión",
        name: "Bornes de Medición",
        x: 52.0,
        y: 15.0,
        width: 22.0,
        height: 55.0,
        stepOrder: 3,
        instruction: "Realiza la comprobación de ausencia de tensión en los bornes del circuito para garantizar energía cero.",
        quiz: {
          question: "Antes de tocar los conductores con las manos, ¿cómo se debe validar el instrumento de medición (multímetro) para verificar la ausencia de tensión?",
          options: [
            { id: "o1", text: "Encenderlo y verificar que la pantalla no muestre mensaje de batería baja.", feedback: "Insuficiente. La pantalla encendida no asegura que las puntas de prueba o los fusibles internos del multímetro estén operando correctamente." },
            { id: "o2", text: "Probar el instrumento en una fuente de tensión viva conocida antes y después de la medición (método de tres pasos).", isCorrect: true },
            { id: "o3", text: "Frotar las puntas de prueba para ver si genera chispa.", feedback: "¡Sumamente peligroso! Provocar cortocircuitos deliberados puede dañar el equipo y causar lesiones." }
          ]
        },
        justification: "El método de tres pasos asegura que el multímetro funcione correctamente antes y después de medir, previniendo falsos negativos (lecturas de 0V en cables energizados por falla de fusible o cable del medidor)."
      },
      {
        id: "h4",
        type: "BOUNDARY",
        riskType: "Delimitación de Seguridad",
        name: "Perímetro Arc Flash Boundary",
        x: 75.0,
        y: 50.0,
        width: 23.0,
        height: 45.0,
        stepOrder: 4,
        instruction: "Coloca las delimitaciones de seguridad para restringir el paso de personal no calificado al área de aproximación.",
        quiz: {
          question: "Según la NFPA 70E, ¿cuál es el límite de aproximación que solo puede ser cruzado por personas calificadas equipadas con el EPP de arco eléctrico adecuado?",
          options: [
            { id: "o1", text: "Límite de Aproximación Restringida (Restricted Approach Boundary).", isCorrect: true },
            { id: "o2", text: "Límite de Aproximación Limitada (Limited Approach Boundary).", feedback: "Incorrecto. El límite de aproximación limitada es la distancia más lejana para evitar choque eléctrico, no es el límite crítico de Arc Flash." },
            { id: "o3", text: "Límite de Aproximación Permitida.", feedback: "Incorrecto. Este concepto no está normado bajo la NFPA 70E." }
          ]
        },
        justification: "El límite de aproximación restringida está más cerca de las partes vivas expuestas y requiere EPP calificado contra arco eléctrico y choque. Ninguna persona no calificada puede traspasarlo sin supervisión y EPP completo."
      }
    ]
  };

  // 3. Check if Course already exists
  const existingCourse = await prisma.course.findFirst({
    where: { title: "SS104: Seguridad Eléctrica y Bloqueo LOTO" },
    include: { modules: true }
  });

  if (existingCourse) {
    console.log("El curso SS104 ya existe. Actualizando la simulación de su primer módulo...");
    if (existingCourse.modules.length > 0) {
      const moduleId = existingCourse.modules[0].id;
      await prisma.simulation.upsert({
        where: { moduleId },
        update: {
          title: "Simulación de Seguridad Eléctrica SS104",
          passingScore: 80,
          configuration: simulationConfig
        },
        create: {
          moduleId,
          title: "Simulación de Seguridad Eléctrica SS104",
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

  // 4. Create the new course and link to both regulations
  const course = await prisma.course.create({
    data: {
      title: "SS104: Seguridad Eléctrica y Bloqueo LOTO",
      description: "Curso teórico-práctico para la aplicación de medidas de seguridad eléctrica y candadeo en base a las normas NFPA 70E y NOM-029-STPS-2011.",
      type: CourseType.SECURITY,
      duration: "3 horas",
      isPublished: true,
      regulations: {
        connect: [
          { id: nom029.id },
          { id: nfpa70e.id }
        ]
      },
      modules: {
        create: [
          {
            title: "Simulación Guiada: Subestación CCM",
            order: 1,
            simulation: {
              create: {
                title: "Simulación de Seguridad Eléctrica SS104",
                passingScore: 80,
                configuration: simulationConfig
              }
            }
          }
        ]
      }
    }
  });

  console.log(`Curso creado con ID: ${course.id}`);
  console.log("Seed de SS104 finalizado correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
