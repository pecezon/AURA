// Mock data for AURA platform

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'supervisor' | 'admin';
  department: string;
  riskScore?: number;
  reactionIndex?: number;
  disciplineLevel?: number;
}

export interface Course {
  id: string;
  title: string;
  type: 'technical' | 'safety';
  description: string;
  duration: string;
  modules: Module[];
  hasSimulation: boolean;
  regulatoryCompliance?: string[];
}

export interface Module {
  id: string;
  title: string;
  content: string;
  duration: string;
  completed?: boolean;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  progress: number;
  completedModules: string[];
  simulationCompleted: boolean;
  lastAccess: Date;
}

export interface SimulationEvent {
  timestamp: number;
  eventType: 'decision' | 'reaction' | 'omission' | 'correction';
  action: string;
  isCorrect: boolean;
  timeToDecide?: number;
}

export interface UserProfile {
  userId: string;
  riskScore: number;
  reactionIndex: number;
  disciplineLevel: number;
  completedSimulations: number;
  events: SimulationEvent[];
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'w1',
    name: 'Carlos Ramírez',
    email: 'carlos.ramirez@sempra.com',
    role: 'worker',
    department: 'Operaciones de Campo',
    riskScore: 78,
    reactionIndex: 85,
    disciplineLevel: 92,
  },
  {
    id: 'w2',
    name: 'María González',
    email: 'maria.gonzalez@sempra.com',
    role: 'worker',
    department: 'Mantenimiento',
    riskScore: 92,
    reactionIndex: 88,
    disciplineLevel: 95,
  },
  {
    id: 'w3',
    name: 'Jorge Hernández',
    email: 'jorge.hernandez@sempra.com',
    role: 'worker',
    department: 'Operaciones de Campo',
    riskScore: 65,
    reactionIndex: 70,
    disciplineLevel: 75,
  },
  {
    id: 's1',
    name: 'Ana Martínez',
    email: 'ana.martinez@sempra.com',
    role: 'supervisor',
    department: 'Operaciones de Campo',
  },
  {
    id: 'a1',
    name: 'Roberto Silva',
    email: 'roberto.silva@sempra.com',
    role: 'admin',
    department: 'Capacitación y Desarrollo',
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Manejo Seguro de Gas Natural Comprimido',
    type: 'technical',
    description: 'Capacitación técnica sobre los procedimientos correctos para el manejo, transporte y almacenamiento de gas natural comprimido en infraestructura energética.',
    duration: '4 horas',
    regulatoryCompliance: ['NOM-029-STPS-2011', 'NFPA 52'],
    hasSimulation: true,
    modules: [
      {
        id: 'm1',
        title: 'Introducción al Gas Natural',
        content: 'El gas natural es un combustible fósil versátil que se encuentra en depósitos subterráneos. Compuesto principalmente de metano (CH₄), es incoloro, inodoro y más ligero que el aire.',
        duration: '30 min',
      },
      {
        id: 'm2',
        title: 'Propiedades y Características',
        content: 'Propiedades físicas y químicas del gas natural: punto de inflamación, densidad relativa, poder calorífico, y comportamiento bajo presión.',
        duration: '45 min',
      },
      {
        id: 'm3',
        title: 'Equipos de Protección Personal (EPP)',
        content: 'EPP requerido: casco, gafas de seguridad, guantes resistentes a químicos, botas de seguridad, ropa antiestática, y detector de gas portátil.',
        duration: '30 min',
      },
      {
        id: 'm4',
        title: 'Procedimientos de Emergencia',
        content: 'Protocolos ante fugas: evacuación, ventilación, comunicación de emergencia, y uso de equipos de respuesta rápida.',
        duration: '1 hora',
      },
    ],
  },
  {
    id: 'c2',
    title: 'Prevención de Riesgos en Espacios Confinados',
    type: 'safety',
    description: 'Normativas y procedimientos para trabajo seguro en espacios confinados, incluyendo evaluación de riesgos, permisos de trabajo y rescate.',
    duration: '3.5 horas',
    regulatoryCompliance: ['NOM-029-STPS-2011', 'NFPA 350'],
    hasSimulation: true,
    modules: [
      {
        id: 'm5',
        title: 'Identificación de Espacios Confinados',
        content: 'Un espacio confinado es cualquier área con acceso limitado, no diseñada para ocupación continua: tanques, túneles, alcantarillas, silos.',
        duration: '30 min',
      },
      {
        id: 'm6',
        title: 'Riesgos Asociados',
        content: 'Atmósferas peligrosas: deficiencia de oxígeno, gases tóxicos, materiales inflamables. Riesgos físicos: derrumbes, inundación, atrapamiento.',
        duration: '45 min',
      },
      {
        id: 'm7',
        title: 'Permisos de Trabajo y Procedimientos',
        content: 'Sistema de permisos: evaluación previa, monitoreo atmosférico continuo, comunicación constante, presencia de vigía externo.',
        duration: '1 hora',
      },
      {
        id: 'm8',
        title: 'Equipos de Rescate y Emergencia',
        content: 'Equipos necesarios: arnés y línea de vida, sistema de ventilación forzada, equipos de respiración autónoma, comunicación bidireccional.',
        duration: '1 hora',
      },
    ],
  },
  {
    id: 'c3',
    title: 'Operación de Sistemas de Compresión',
    type: 'technical',
    description: 'Formación técnica especializada en la operación, monitoreo y mantenimiento de sistemas de compresión de gas en estaciones de infraestructura energética.',
    duration: '5 horas',
    regulatoryCompliance: ['NFPA 20'],
    hasSimulation: true,
    modules: [
      {
        id: 'm9',
        title: 'Principios de Compresión de Gas',
        content: 'Fundamentos termodinámicos: ciclos de compresión, relación de compresión, eficiencia volumétrica, potencia requerida.',
        duration: '1 hora',
      },
      {
        id: 'm10',
        title: 'Componentes del Sistema',
        content: 'Compresores centrífugos y reciprocantes, sistemas de enfriamiento, separadores de líquidos, válvulas de control y seguridad.',
        duration: '1.5 horas',
      },
      {
        id: 'm11',
        title: 'Procedimientos de Arranque y Paro',
        content: 'Secuencias críticas: verificación previa, purgado de líneas, presurización gradual, monitoreo de parámetros operativos.',
        duration: '1 hora',
      },
      {
        id: 'm12',
        title: 'Monitoreo y Diagnóstico',
        content: 'Parámetros críticos: presión de succión/descarga, temperatura, vibración, análisis de tendencias, alarmas.',
        duration: '1.5 horas',
      },
    ],
  },
  {
    id: 'c4',
    title: 'Seguridad Eléctrica y Bloqueo/Etiquetado (LOTO)',
    type: 'safety',
    description: 'Procedimientos de seguridad eléctrica y sistema LOTO (Lockout/Tagout) para prevenir energización accidental durante mantenimiento.',
    duration: '3 horas',
    regulatoryCompliance: ['NOM-029-STPS-2011', 'NFPA 70E'],
    hasSimulation: true,
    modules: [
      {
        id: 'm13',
        title: 'Fundamentos de Seguridad Eléctrica',
        content: 'Riesgos eléctricos: choque, arco eléctrico, quemaduras. Factores de riesgo: voltaje, corriente, resistencia del cuerpo, trayectoria.',
        duration: '45 min',
      },
      {
        id: 'm14',
        title: 'Procedimientos LOTO',
        content: 'Lockout/Tagout: identificación de fuentes de energía, desconexión, bloqueo con candado, verificación de energía cero.',
        duration: '1 hora',
      },
      {
        id: 'm15',
        title: 'Equipos y Dispositivos de Bloqueo',
        content: 'Candados personales, tarjetas de advertencia, dispositivos de bloqueo multipunto, cajas de bloqueo grupal.',
        duration: '45 min',
      },
      {
        id: 'm16',
        title: 'Verificación y Pruebas',
        content: 'Uso de multímetro, probadores de tensión, verificación de des-energización, protocolo de reactivación segura.',
        duration: '30 min',
      },
    ],
  },
];

// Mock Course Progress
export const mockProgress: CourseProgress[] = [
  {
    userId: 'w1',
    courseId: 'c1',
    progress: 75,
    completedModules: ['m1', 'm2', 'm3'],
    simulationCompleted: false,
    lastAccess: new Date('2026-02-28'),
  },
  {
    userId: 'w1',
    courseId: 'c2',
    progress: 100,
    completedModules: ['m5', 'm6', 'm7', 'm8'],
    simulationCompleted: true,
    lastAccess: new Date('2026-02-25'),
  },
  {
    userId: 'w2',
    courseId: 'c1',
    progress: 100,
    completedModules: ['m1', 'm2', 'm3', 'm4'],
    simulationCompleted: true,
    lastAccess: new Date('2026-02-27'),
  },
  {
    userId: 'w2',
    courseId: 'c3',
    progress: 60,
    completedModules: ['m9', 'm10'],
    simulationCompleted: false,
    lastAccess: new Date('2026-02-28'),
  },
  {
    userId: 'w3',
    courseId: 'c1',
    progress: 50,
    completedModules: ['m1', 'm2'],
    simulationCompleted: false,
    lastAccess: new Date('2026-02-20'),
  },
];

// Mock User Profiles (behavioral scoring)
export const mockProfiles: UserProfile[] = [
  {
    userId: 'w1',
    riskScore: 78,
    reactionIndex: 85,
    disciplineLevel: 92,
    completedSimulations: 1,
    events: [],
  },
  {
    userId: 'w2',
    riskScore: 92,
    reactionIndex: 88,
    disciplineLevel: 95,
    completedSimulations: 2,
    events: [],
  },
  {
    userId: 'w3',
    riskScore: 65,
    reactionIndex: 70,
    disciplineLevel: 75,
    completedSimulations: 0,
    events: [],
  },
];
