import "dotenv/config";
import { prisma } from "../src/config/prisma";
import { CourseType, ContentType } from "../generated/prisma";
import { simulationTemplates } from "../src/config/simulationTemplates";

async function main() {
  console.log("Iniciando la siembra de 4 cursos robustos multimedia en la base de datos...");

  // Ensure Regulations exist
  const rNom017 = await prisma.regulation.upsert({
    where: { name: "NOM-017-STPS-2008" },
    update: {},
    create: {
      name: "NOM-017-STPS-2008",
      description: "Equipo de protección personal, selección, uso y manejo en los centros de trabajo."
    }
  });

  const rNom026 = await prisma.regulation.upsert({
    where: { name: "NOM-026-STPS-2008" },
    update: {},
    create: {
      name: "NOM-026-STPS-2008",
      description: "Colores y señales de seguridad e higiene, e identificación de riesgos por fluidos conducidos en tuberías."
    }
  });

  const rNom029 = await prisma.regulation.upsert({
    where: { name: "NOM-029-STPS-2011" },
    update: {},
    create: {
      name: "NOM-029-STPS-2011",
      description: "Mantenimiento de las instalaciones eléctricas en los centros de trabajo-Condiciones de seguridad."
    }
  });

  const rNfpa70e = await prisma.regulation.upsert({
    where: { name: "NFPA 70E" },
    update: {},
    create: {
      name: "NFPA 70E",
      description: "Standard for Electrical Safety in the Workplace."
    }
  });

  const rNom004 = await prisma.regulation.upsert({
    where: { name: "NOM-004-STPS-1999" },
    update: {},
    create: {
      name: "NOM-004-STPS-1999",
      description: "Sistemas de protección y dispositivos de seguridad en la maquinaria y equipo que se utilice en los centros de trabajo."
    }
  });

  const rApi610 = await prisma.regulation.upsert({
    where: { name: "API 610" },
    update: {},
    create: {
      name: "API 610",
      description: "Centrifugal Pumps for Petroleum, Petrochemical, and Natural Gas Industries."
    }
  });

  const rNom003 = await prisma.regulation.upsert({
    where: { name: "NOM-003-ASEA-2016" },
    update: {},
    create: {
      name: "NOM-003-ASEA-2016",
      description: "Distribución de gas natural y gas licuado de petróleo por ductos."
    }
  });

  const rAsmeB318 = await prisma.regulation.upsert({
    where: { name: "ASME B31.8" },
    update: {},
    create: {
      name: "ASME B31.8",
      description: "Gas Transmission and Distribution Piping Systems."
    }
  });

  console.log("Todas las normativas aseguradas en la base de datos.");

  // ==========================================
  // CURSO 1: SS101 SEGURIDAD INDUSTRIAL BÁSICA
  // ==========================================
  const c1 = await prisma.course.create({
    data: {
      title: "SS101: Seguridad Industrial Básica en Terminales",
      description: "Curso integral para la identificación de peligros locativos, aplicación de la jerarquía de controles de riesgo y uso de equipo de protección personal en áreas de proceso.",
      type: CourseType.SECURITY,
      duration: "4 horas",
      isPublished: true,
      regulations: {
        connect: [{ id: rNom017.id }, { id: rNom026.id }]
      },
      modules: {
        create: [
          {
            title: "Introducción a la Seguridad de Planta e Higiene",
            order: 1,
            contents: {
              create: [
                {
                  title: "Equipos de Protección Personal en Terminales de Gas",
                  type: ContentType.READING,
                  order: 1,
                  content: "En Sempra Infrastructure, la seguridad física es nuestra mayor prioridad. De acuerdo con la NOM-017-STPS-2008, el uso de Equipo de Protección Personal (EPP) básico es mandatorio para todo ingreso a las áreas operativas:\n\n1. Casco de Seguridad Dialéctico (Clase E): Protege contra impactos y descargas eléctricas de baja tensión.\n2. Lentes de Seguridad con Protección Lateral: Protección permanente contra partículas voladoras y destellos.\n3. Botas de Seguridad con Casquillo Dialéctico: Evitan lesiones por caída de objetos pesados y previenen arcos de corriente.\n4. Ropa de Trabajo de Algodón o Antiestática: Evita la acumulación de electricidad estática que pudiera generar chispas en atmósferas inflamables.\n\nJerarquía de Controles de Riesgo:\nAntes de recurrir al EPP (que es la última línea de defensa), se deben evaluar controles de Eliminación, Sustitución, Controles de Ingeniería (como guardas de seguridad y extractores) y Controles Administrativos (como capacitaciones y señalizaciones según NOM-026-STPS-2008)."
                },
                {
                  title: "Infografía de EPP Obligatorio y Jerarquía de Controles",
                  type: ContentType.IMAGE,
                  order: 2,
                  url: "/simulations/industrial_safety_1.png"
                },
                {
                  title: "Inducción General a la Seguridad Industrial y EPP",
                  type: ContentType.VIDEO,
                  order: 3,
                  url: "https://www.youtube.com/watch?v=F3S_LpeYw_g"
                }
              ]
            }
          },
          {
            title: "Identificación de Riesgos y Señalización en Campo",
            order: 2,
            contents: {
              create: [
                {
                  title: "Identificación de Condiciones Inseguras y Colores de Seguridad",
                  type: ContentType.READING,
                  order: 1,
                  content: "Una condición insegura es cualquier estado físico del entorno que puede causar un accidente. De acuerdo con la NOM-026-STPS-2008, la señalización en campo se divide por colores:\n\n- ROJO: Paro, prohibición e identificación de equipos contra incendio.\n- AMARILLO: Advertencia de peligro, delimitación de áreas y advertencia de radiación/electricidad.\n- VERDE: Condición de seguridad, rutas de evacuación, camillas y regaderas de emergencia.\n- AZUL: Obligación (p. ej., uso de equipo de protección específico).\n\nProcedimiento ante hallazgos:\n1. Aislar temporalmente el peligro (usar cinta delimitadora amarilla).\n2. Reportar inmediatamente al supervisor de seguridad mediante la tarjeta de condición insegura.\n3. No intervenir herramientas ni equipos eléctricos a menos que se tenga la autorización respectiva."
                },
                {
                  title: "Podcast Sempra: Minuto de Seguridad - Reporte de Actos Inseguros",
                  type: ContentType.AUDIO,
                  order: 2,
                  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                }
              ]
            }
          },
          {
            title: "Práctica y Simulación de Riesgos Industriales",
            order: 3,
            contents: {
              create: [
                {
                  title: "Instrucciones de la Simulación Virtual de Riesgos",
                  type: ContentType.READING,
                  order: 1,
                  content: "En la simulación interactiva del módulo, ingresarás virtualmente a una sección de la terminal de gas. Tu misión es de gran importancia: localizar 4 condiciones de riesgo crítico en menos de 2 minutos.\n\nTu Risk Score se calculará con base en los riesgos correctamente identificados. Cada condición crítica que no detectes restará 15 puntos, y retirar un pin por indecisión puede restar 2 puntos. Analiza bien la escena antes de colocar tu pin de riesgo."
                }
              ]
            },
            simulation: {
              create: {
                title: "SS101: Simulación de Riesgos Industriales Básica",
                passingScore: 80,
                configuration: simulationTemplates.ss101 as any
              }
            }
          }
        ]
      }
    }
  });
  console.log(`Creado Curso SS101 con ID: ${c1.id}`);

  // ==========================================
  // CURSO 2: SS104 SEGURIDAD ELÉCTRICA Y LIBRANZA
  // ==========================================
  const c2 = await prisma.course.create({
    data: {
      title: "SS104: Seguridad Eléctrica y Libranza (NOM-029)",
      description: "Desenergización y mantenimiento de subestaciones de baja y media tensión mediante bloqueo y etiquetado físico (LOTO) bajo regulaciones nacionales e internacionales.",
      type: CourseType.SECURITY,
      duration: "8 horas",
      isPublished: true,
      regulations: {
        connect: [{ id: rNom029.id }, { id: rNfpa70e.id }]
      },
      modules: {
        create: [
          {
            title: "Riesgos Eléctricos y Equipo de Protección Dieléctrico",
            order: 1,
            contents: {
              create: [
                {
                  title: "Protección Contra Choque y Arco Eléctrico",
                  type: ContentType.READING,
                  order: 1,
                  content: "La corriente eléctrica representa uno de los mayores peligros invisibles en la planta. La NFPA 70E establece que antes de abrir cualquier compuerta de un arrancador o interruptor en un Motor Control Center (MCC), el operador debe portar el EPP dieléctrico adecuado:\n\nLímites de Aproximación:\n1. Límite de Aproximación Limitada: Distancia mínima a la cual personas no calificadas pueden acercarse a conductores expuestos.\n2. Límite de Aproximación Restringida: Solo accesible a personal calificado portando el EPP adecuado."
                },
                {
                  title: "Demostración de Arco Eléctrico (Arc Flash) y Categoría de Trajes",
                  type: ContentType.VIDEO,
                  order: 2,
                  url: "https://www.youtube.com/watch?v=2y48GqH0F5A"
                }
              ]
            }
          },
          {
            title: "Protocolo LOTO de Bloqueo y Etiquetado de Seguridad",
            order: 2,
            contents: {
              create: [
                {
                  title: "La Regla de Oro del Aislamiento Eléctrico (LOTO)",
                  type: ContentType.READING,
                  order: 1,
                  content: "El protocolo Lockout-Tagout (LOTO) garantiza que un operador no sufra accidentes por re-energización accidental de una máquina mientras realiza mantenimiento. Los 6 pasos fundamentales son:\n\n1. Preparación para el Apagado.\n2. Apagado del Equipo.\n3. Aislamiento de la Fuente.\n4. Colocación de Candados y Tarjetas (LOTO).\n5. Control de Energía Residual.\n6. Verificación de Energía Cero."
                },
                {
                  title: "Audio Guía: Validación de Energía Cero mediante la Prueba de los 3 Puntos",
                  type: ContentType.AUDIO,
                  order: 2,
                  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
                }
              ]
            }
          },
          {
            title: "Práctica de Libranza Virtual en Subestaciones",
            order: 3,
            contents: {
              create: [
                {
                  title: "Instrucciones de Simulación SS104",
                  type: ContentType.READING,
                  order: 1,
                  content: "Para completar la simulación de seguridad eléctrica SS104 de forma satisfactoria (Risk Score > 80), deberás realizar las siguientes acciones en el orden estricto de seguridad:\n\n1. Apagar el interruptor de control.\n2. Mover el interruptor principal a la posición OFF.\n3. Instalar la pinza de bloqueo múltiple e insertar tu candado de seguridad LOTO.\n4. Colocar la tarjeta de advertencia.\n5. Usar el detector de voltaje dieléctrico para verificar ausencia de tensión."
                }
              ]
            },
            simulation: {
              create: {
                title: "SS104: Simulación de Seguridad Eléctrica",
                passingScore: 80,
                configuration: simulationTemplates.ss104 as any
              }
            }
          }
        ]
      }
    }
  });
  console.log(`Creado Curso SS104 con ID: ${c2.id}`);

  // ==========================================
  // CURSO 3: TEC102 OPERACIÓN DE BOMBAS
  // ==========================================
  const c3 = await prisma.course.create({
    data: {
      title: "TEC102: Operación y Purga de Bombas Centrífugas",
      description: "Fundamentos operativos e hidráulicos para técnicos de campo, enfocados en purga de aire, verificación de nivel de aceite y arranque óptimo de equipos API 610.",
      type: CourseType.TECHNICAL,
      duration: "12 horas",
      isPublished: true,
      regulations: {
        connect: [{ id: rNom004.id }, { id: rApi610.id }]
      },
      modules: {
        create: [
          {
            title: "Fundamentos Hidráulicos y Mecánicos de las Bombas Centrífugas",
            order: 1,
            contents: {
              create: [
                {
                  title: "Principios de Cavitación y Nivel de Aceite en Bombas API 610",
                  type: ContentType.READING,
                  order: 1,
                  content: "El visor de lubricación de cojinetes es el indicador crítico de salud mecánica. Debe mantenerse estrictamente en el punto medio (50%). Un nivel bajo causa fricción extrema y fallas mecánicas por sobrecalentamiento.\n\nFenómeno de Cavitación:\nOcurre cuando la presión estática en el ojo del impulsor cae por debajo de la presión de vapor del líquido, formando burbujas de vapor que colapsan violentamente al avanzar. Esto destruye la superficie del impulsor."
                },
                {
                  title: "Muestra de Audio: Diagnóstico de Sonido de Cavitación vs Operación Normal",
                  type: ContentType.AUDIO,
                  order: 2,
                  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
                }
              ]
            }
          },
          {
            title: "Procedimiento de Pre-Arranque, Cebado y Alineación de Válvulas",
            order: 2,
            contents: {
              create: [
                {
                  title: "Protocolo Operativo de Puesta en Marcha",
                  type: ContentType.READING,
                  order: 1,
                  content: "El arranque de una bomba centrífuga requiere seguir una secuencia lógica técnica:\n\n1. Verificación Visual de Lubricante.\n2. Cebado y Venteo: Expulsar aire atrapado. Arrancar una bomba seca destruye el sello mecánico en segundos.\n3. Alineación de Válvulas de Proceso:\n   - Válvula de Succión: Totalmente abierta.\n   - Válvula de Descarga: Cerrada temporalmente para minimizar corriente de arranque y torque.\n4. Arranque Eléctrico y Monitoreo."
                },
                {
                  title: "Simulación 3D del Flujo e Impulsor en una Bomba Centrífuga",
                  type: ContentType.VIDEO,
                  order: 2,
                  url: "https://www.youtube.com/watch?v=BaEHVpKc-1Q"
                }
              ]
            }
          },
          {
            title: "Práctica de Simulación y Verificación de Presiones",
            order: 3,
            contents: {
              create: [
                {
                  title: "Instrucciones de Simulación Virtual de Bombas",
                  type: ContentType.READING,
                  order: 1,
                  content: "En la simulación interactiva de operación de bombas TEC102, estarás frente a una bomba API 610 real en una estación de gas natural. Deberás completar los siguientes 4 pasos en orden:\n\n1. Hacer clic en el Visor de Aceite (50%).\n2. Interactuar con la Válvula de Venteo/Purga superior.\n3. Cerrar la Válvula de Descarga de proceso.\n4. Encender el motor y validar la presión diferencial de descarga en el manómetro local."
                }
              ]
            },
            simulation: {
              create: {
                title: "TEC102: Simulación de Operación de Bombas Centrífugas",
                passingScore: 80,
                configuration: simulationTemplates.tec102 as any
              }
            }
          }
        ]
      }
    }
  });
  console.log(`Creado Curso TEC102 con ID: ${c3.id}`);

  // ==========================================
  // CURSO 4: TEC110 CONSTRUCCIÓN Y REDES PEAD
  // ==========================================
  const c4 = await prisma.course.create({
    data: {
      title: "TEC110: Construcción y Pruebas de Redes PEAD",
      description: "Ciclos de soldadura por termofusión y electrofusión, requerimientos técnicos de excavación de zanjas y comisionamiento neumático bajo normas ASME B31.8.",
      type: CourseType.TECHNICAL,
      duration: "16 horas",
      isPublished: true,
      regulations: {
        connect: [{ id: rNom003.id }, { id: rAsmeB318.id }]
      },
      modules: {
        create: [
          {
            title: "Propiedades del Polietileno y Soldadura por Termofusión",
            order: 1,
            contents: {
              create: [
                {
                  title: "Parámetros Críticos en la Termofusión de Tuberías PEAD",
                  type: ContentType.READING,
                  order: 1,
                  content: "La soldadura por fusión a tope (termofusión) une dos secciones de tuberías PEAD. Los 4 parámetros esenciales del ciclo de termofusión son:\n\n1. Temperatura de Placa: 200°C y 220°C.\n2. Presión de Calentamiento e Interfaz.\n3. Tiempo de Calentamiento.\n4. Ciclo de Enfriamiento bajo Presión: La soldadura debe enfriarse de forma natural manteniendo la presión de unión."
                },
                {
                  title: "Videotutorial: Proceso de Termofusión de Tubería PEAD en Campo",
                  type: ContentType.VIDEO,
                  order: 2,
                  url: "https://www.youtube.com/watch?v=F3S_LpeYw_g"
                }
              ]
            }
          },
          {
            title: "Excavación de Zanjas, Colocación de Tubería y Señalización",
            order: 2,
            contents: {
              create: [
                {
                  title: "Sección Transversal de la Zanja y Cable Localizador",
                  type: ContentType.READING,
                  order: 1,
                  content: "Para proteger las líneas de gas natural, las zanjas deben construirse siguiendo estándares técnicos:\n\n1. Cama de Arena: Fondo de zanja recubierto con 10 cm de arena limpia compactada.\n2. Cable Localizador de Cobre: Colocar un cable de cobre desnudo (calibre 12 AWG mínimo) para detección electromagnética.\n3. Relleno Compactado Inicial.\n4. Cinta de Advertencia Detectable (NOM-003-ASEA-2016): Colocada a unos 30 cm sobre la tubería."
                }
              ]
            }
          },
          {
            title: "Comisionamiento, Purga e Inyección de Gas Natural",
            order: 3,
            contents: {
              create: [
                {
                  title: "Pruebas Neumáticas de Hermeticidad e Introducción del Gas",
                  type: ContentType.READING,
                  order: 1,
                  content: "Conforme a la normativa ASME B31.8, antes de inyectar gas natural, la red de PEAD debe superar la Prueba de Hermeticidad Neumática:\n\n1. Presurización con Gas Inerte (Nitrógeno seco a 1.5x MOP).\n2. Estabilización de Temperatura y Presión durante 24 horas.\n3. Purga del Aire/Nitrógeno.\n4. Inyección del Gas Natural: Introducir gas de forma muy lenta para evitar ondas de choque sónicas."
                },
                {
                  title: "Transmisión Radial: Protocolo de Comunicación en Pruebas de Hermeticidad",
                  type: ContentType.AUDIO,
                  order: 2,
                  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
                }
              ]
            }
          },
          {
            title: "Simulación en Simulador Virtual de Redes",
            order: 4,
            contents: {
              create: [
                {
                  title: "Instrucciones de Simulación Virtual TEC110",
                  type: ContentType.READING,
                  order: 1,
                  content: "En la simulación interactiva TEC110, asumirás el rol de Inspector de Redes de Polietileno en Sempra. Tu objetivo es revisar y aprobar los 3 puntos clave de construcción en el orden correcto:\n\n1. Validar el cordón de Fusión a Tope.\n2. Inspeccionar la Zanja.\n3. Revisar la Cinta de Seguridad.\n\nCada paso erróneo u omisión de verificación de soldadura reducirá tu Risk Score (-15 puntos). ¡La seguridad de la red de gas depende de una correcta inspección!"
                }
              ]
            },
            simulation: {
              create: {
                title: "TEC110: Simulación de Redes de Polietileno (PEAD)",
                passingScore: 80,
                configuration: simulationTemplates.tec110 as any
              }
            }
          }
        ]
      }
    }
  });
  console.log(`Creado Curso TEC110 con ID: ${c4.id}`);

  console.log("¡Siembra de los 4 cursos robustos terminada con éxito!");
}

main()
  .catch((e) => {
    console.error("Error durante la siembra de cursos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
