import "dotenv/config";
import { prisma } from "../src/config/prisma";
import { createClient } from "@supabase/supabase-js";
import { Role } from "../generated/prisma";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const DEMO_PASSWORD = "SempraDemo2026!";

async function ensureAuthUser(email: string, role: Role, firstName: string, lastName: string) {
  console.log(`Verificando usuario en Auth: ${email}...`);
  
  // Buscar en nuestra BD local de Profiles
  let profile = await prisma.profile.findFirst({
    where: { email }
  });

  let userId: string;

  if (!profile) {
    console.log(`Creando usuario en Supabase Auth: ${email}...`);
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { firstName, lastName }
    });

    if (error) {
      throw new Error(`Error al crear usuario auth para ${email}: ${error.message}`);
    }

    userId = data.user!.id;
    console.log(`Creado en Auth con ID: ${userId}`);
  } else {
    userId = profile.id;
    console.log(`Usuario ya existe en base de datos con ID: ${userId}. Actualizando contraseña...`);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: DEMO_PASSWORD
    });
    if (error) {
      console.warn(`Advertencia al actualizar contraseña de ${email}: ${error.message}`);
    }
  }

  // Upsert en Profile
  profile = await prisma.profile.upsert({
    where: { id: userId },
    update: {
      email,
      firstName,
      lastName,
      role,
      isProfileComplete: true,
      area: "Operaciones Sempra",
      employeeId: `EMP-${role}-${Math.floor(1000 + Math.random() * 9000)}`
    },
    create: {
      id: userId,
      email,
      firstName,
      lastName,
      role,
      isProfileComplete: true,
      area: "Operaciones Sempra",
      employeeId: `EMP-${role}-${Math.floor(1000 + Math.random() * 9000)}`
    }
  });

  return profile;
}

async function main() {
  console.log("Iniciando siembra de usuarios demo...");

  const worker = await ensureAuthUser("worker@aura.com", Role.EMPLOYEE, "Linette", "Acosta (Worker)");
  const supervisor = await ensureAuthUser("supervisor@aura.com", Role.SUPERVISOR, "Juan", "(Supervisor)");
  const admin = await ensureAuthUser("admin@aura.com", Role.ADMIN, "Flavio Emiliano", "(Admin)");

  console.log("Cuentas demo aseguradas.");

  // Enrolar al Worker en los cursos
  const courses = await prisma.course.findMany();
  console.log(`Enrolando a worker@aura.com en ${courses.length} cursos...`);
  
  for (const course of courses) {
    await prisma.courseEnrollment.upsert({
      where: {
        profileId_courseId: {
          profileId: worker.id,
          courseId: course.id
        }
      },
      update: {
        status: "IN_PROGRESS",
        progress: 50
      },
      create: {
        profileId: worker.id,
        courseId: course.id,
        status: "IN_PROGRESS",
        progress: 50
      }
    });
  }

  // Buscar simulaciones existentes para registrar intentos demo
  const simulations = await prisma.simulation.findMany();
  if (simulations.length > 0) {
    const targetSim = simulations[0];
    console.log(`Sembrando intentos de simulación para ${worker.email} en simulación ${targetSim.title}...`);

    // Limpiar intentos anteriores del worker para evitar duplicados infinitos
    await prisma.simulationAttempt.deleteMany({
      where: { profileId: worker.id }
    });

    // Intento 1: Buen desempeño (Bajo riesgo)
    await prisma.simulationAttempt.create({
      data: {
        profileId: worker.id,
        simulationId: targetSim.id,
        score: 95,
        passed: true,
        riskScore: 10, // bajo riesgo
        events: [
          { type: "PLACE_PIN", id: "p1", x: 10, y: 20, timestamp: Date.now() - 3600000 },
          { type: "PLACE_PIN", id: "p2", x: 30, y: 40, timestamp: Date.now() - 3550000 },
          { type: "SUBMIT", timeTakenSeconds: 45, timestamp: Date.now() - 3500000 }
        ]
      }
    });

    // Intento 2: Mal desempeño (Alto riesgo)
    await prisma.simulationAttempt.create({
      data: {
        profileId: worker.id,
        simulationId: targetSim.id,
        score: 45,
        passed: false,
        riskScore: 75, // alto riesgo
        events: [
          { type: "PLACE_PIN", id: "p1", x: 10, y: 20, timestamp: Date.now() - 1800000 },
          { type: "WRONG_CLICK", x: 50, y: 60, expectedStep: "p2", timestamp: Date.now() - 1750000 },
          { type: "QUIZ_ERROR", id: "p2", optionId: "opt_wrong", timestamp: Date.now() - 1700000 },
          { type: "SUBMIT", timeTakenSeconds: 150, timestamp: Date.now() - 1650000 }
        ]
      }
    });
    
    console.log("Intentos de simulación sembrados con éxito.");
  }

  console.log("¡Siembra demo finalizada con éxito!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
