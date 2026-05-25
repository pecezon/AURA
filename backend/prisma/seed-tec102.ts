import { prisma } from '../src/config/prisma';
import { CourseType } from '../generated/prisma';

async function main() {
  console.log("Seeding TEC102 Centrifugal Pumps Course...");

  // 1. Ensure Regulations exist
  const nom004 = await prisma.regulation.upsert({
    where: { name: "NOM-004-STPS-1999" },
    update: { description: "Sistemas de protección y dispositivos de seguridad en la maquinaria y equipo que se utilice en los centros de trabajo." },
    create: {
      name: "NOM-004-STPS-1999",
      description: "Sistemas de protección y dispositivos de seguridad en la maquinaria y equipo que se utilice en los centros de trabajo."
    }
  });

  const api610 = await prisma.regulation.upsert({
    where: { name: "API 610" },
    update: { description: "Centrifugal Pumps for Petroleum, Petrochemical, and Natural Gas Industries." },
    create: {
      name: "API 610",
      description: "Centrifugal Pumps for Petroleum, Petrochemical, and Natural Gas Industries."
    }
  });

  console.log("Regulations NOM-004-STPS-1999 and API 610 are ensured.");

  // 2. Define Simulation Configuration
  const simulationConfig = {
    simulationType: "GUIDED_SEQUENCE",
    scenario: "Estación de Distribución de Gas Natural - Bombas de Condensados",
    imageUrl: "/simulations/centrifugal_pump_1.png",
    timeLimitSeconds: 240,
    hotspots: [
      {
        id: "p1",
        type: "INSPECT",
        riskType: "Nivel de Lubricante y Sellos",
        name: "Cárter de Rodamientos y Visor de Aceite",
        x: 8.0,
        y: 20.0,
        width: 18.0,
        height: 40.0,
        stepOrder: 1,
        instruction: "Verifica el nivel de aceite en el cárter de rodamientos de la bomba usando el visor transparente para asegurar una lubricación adecuada antes del arranque.",
        quiz: {
          question: "¿Qué indicador visual garantiza la correcta lubricación de los rodamientos antes de encender la bomba centrífuga?",
          options: [
            { id: "o1", text: "Que el cárter de rodamientos esté lleno hasta el tope de aceite.", feedback: "¡Error! Llenar en exceso el cárter provoca sobrecalentamiento de los rodamientos debido al batido violento del aceite, provocando fallas prematuras." },
            { id: "o2", text: "El nivel de aceite ubicado exactamente en el centro del visor transparente (ojo de buey) del cárter.", isCorrect: true },
            { id: "o3", text: "Que no gotee líquido del cárter, sin importar lo que muestre el visor.", feedback: "Incorrecto. La ausencia de fugas externas visibles no garantiza que el cárter cuente con el volumen de aceite necesario para la operación." }
          ]
        },
        justification: "La norma API 610 indica que el nivel de lubricante debe mantenerse en el punto medio del visor. Un nivel bajo causará fricción extrema y fallas catastróficas, mientras que un nivel excesivo causará sobrecalentamiento."
      },
      {
        id: "p2",
        type: "VENT",
        riskType: "Cebado y Venteo de Aire/Gas",
        name: "Válvula de Purga de la Carcasa",
        x: 30.0,
        y: 15.0,
        width: 18.0,
        height: 35.0,
        stepOrder: 2,
        instruction: "Interactúa con la válvula de purga/venteo en la parte superior de la carcasa para eliminar bolsas de aire o gas acumuladas y cebar la bomba.",
        quiz: {
          question: "Al cebar una bomba centrífuga en una estación de gas, ¿por qué es crítico ventear completamente el aire o vapor de la carcasa antes del arranque?",
          options: [
            { id: "o1", text: "Para evitar la cavitación por aire o que la bomba trabaje en seco, lo cual destruiría las caras del sello mecánico en segundos.", isCorrect: true },
            { id: "o2", text: "Para presurizar la línea de succión y calentar el fluido.", feedback: "Incorrecto. El venteo se realiza para desalojar gases acumulados que impiden el cebado, no tiene como fin presurizar ni alterar la temperatura de la succión." },
            { id: "o3", text: "Para forzar al impulsor a girar en la dirección correcta por presión de aire.", feedback: "¡Peligro! El sentido de rotación es puramente eléctrico. Arrancar una bomba centrífuga sin líquido en su interior dañará gravemente el equipo." }
          ]
        },
        justification: "NOM-004-STPS-1999 y las buenas prácticas operativas exigen el cebado completo. Las bombas centrífugas no están diseñadas para bombear gases; el aire atrapado provoca la pérdida inmediata de succión y sobrecalentamiento del sello mecánico."
      },
      {
        id: "p3",
        type: "VALVE",
        riskType: "Alineación de Válvulas de Proceso",
        name: "Válvulas de Succión y Descarga",
        x: 52.0,
        y: 25.0,
        width: 20.0,
        height: 50.0,
        stepOrder: 3,
        instruction: "Verifica el estado de las válvulas de proceso: abre la válvula de succión al 100% y mantén la válvula de descarga estrangulada o cerrada para el arranque.",
        quiz: {
          question: "¿Cuál es la configuración correcta de las válvulas de proceso para el arranque de una bomba centrífuga estándar?",
          options: [
            { id: "o1", text: "Válvula de succión cerrada y descarga abierta al 100%.", feedback: "¡Peligro crítico! Arrancar la bomba con la succión cerrada provocará cavitación instantánea, daño al impulsor y destrucción del sello mecánico por falta de lubricación." },
            { id: "o2", text: "Válvula de succión abierta al 100% y válvula de descarga cerrada (o estrangulada al mínimo) para reducir la carga de arranque del motor.", isCorrect: true },
            { id: "o3", text: "Ambas válvulas (succión y descarga) abiertas al 100% desde el inicio.", feedback: "Inadecuado. Arrancar con la descarga totalmente abierta exige el torque máximo del motor desde el segundo cero, lo que puede disparar las protecciones por sobrecorriente." }
          ]
        },
        justification: "El torque y la corriente de arranque (inrush) del motor eléctrico se reducen al mínimo cuando la descarga está cerrada (flujo cero), protegiendo la integridad del devanado del motor en base a especificaciones de diseño."
      },
      {
        id: "p4",
        type: "MONITOR",
        riskType: "Monitoreo de Presión de Descarga",
        name: "Manómetro de Descarga",
        x: 76.0,
        y: 15.0,
        width: 18.0,
        height: 40.0,
        stepOrder: 4,
        instruction: "Una vez arrancada la bomba, monitorea el manómetro de descarga para confirmar la correcta entrega de presión diferencial del equipo.",
        quiz: {
          question: "Inmediatamente después del arranque del motor, ¿qué comportamiento en el manómetro de descarga indica una operación exitosa?",
          options: [
            { id: "o1", text: "El incremento de la presión diferencial que se estabilice en el valor nominal del diseño sin fluctuaciones.", isCorrect: true },
            { id: "o2", text: "La caída de presión a cero absoluto, lo que demuestra flujo libre continuo.", feedback: "¡Grave! Una caída de presión a cero posterior al arranque indica pérdida de cebado, giro inverso del motor o rotura interna del eje." },
            { id: "o3", text: "Que la aguja del manómetro vibre violentamente hasta el límite de escala.", feedback: "Incorrecto. Una vibración violenta u oscilación en la aguja es síntoma inequívoco de cavitación o recirculación severa en el impulsor." }
          ]
        },
        justification: "La presión diferencial (Descarga menos Succión) confirma que el impulsor está transmitiendo energía cinética al fluido de manera estable, de acuerdo a la curva de operación de la bomba centrífuga."
      }
    ]
  };

  // 3. Check if Course already exists
  const existingCourse = await prisma.course.findFirst({
    where: { title: "TEC102: Bombas centrífugas – principios, operación, mantenimiento y seguridad" },
    include: { modules: { orderBy: { order: "asc" } } }
  });

  if (existingCourse) {
    console.log("El curso TEC102 ya existe. Actualizando la simulación de su primer módulo...");
    if (existingCourse.modules.length > 0) {
      const moduleId = existingCourse.modules[0].id;
      await prisma.simulation.upsert({
        where: { moduleId },
        update: {
          title: "Simulación de Operación de Bombas TEC102",
          passingScore: 80,
          configuration: simulationConfig
        },
        create: {
          moduleId,
          title: "Simulación de Operación de Bombas TEC102",
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
      title: "TEC102: Bombas centrífugas – principios, operación, mantenimiento y seguridad",
      description: "Curso técnico para comprender el funcionamiento, arranque seguro, alineación de válvulas y mantenimiento preventivo de bombas centrífugas industriales en plantas de distribución.",
      type: CourseType.TECHNICAL,
      duration: "4 horas",
      isPublished: true,
      regulations: {
        connect: [
          { id: nom004.id },
          { id: api610.id }
        ]
      },
      modules: {
        create: [
          {
            title: "Simulación de Protocolo de Arranque de Bomba",
            order: 1,
            simulation: {
              create: {
                title: "Simulación de Operación de Bombas TEC102",
                passingScore: 80,
                configuration: simulationConfig
              }
            }
          }
        ]
      }
    }
  });

  console.log(`Curso TEC102 creado con ID: ${course.id}`);
  console.log("Seed de TEC102 finalizado correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
