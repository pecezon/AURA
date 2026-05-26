# Demo Role Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que los evaluadores cambien dinámicamente entre las vistas de Trabajador, Supervisor y Administrador mediante un widget flotante premium, inyectando cabeceras de conmutación en la API y sobreescribiendo el perfil de la sesión en el backend cuando el modo demo está activo.

**Architecture:** El frontend almacena el rol emulado en `localStorage` y lo añade como la cabecera `X-Demo-Override-Role` en Axios. En el backend, si `DEMO_MODE=true`, el middleware de autenticación intercepta la cabecera, busca el perfil demo de la base de datos correspondiente al rol solicitado y sobreescribe `req.profile` con dicho perfil, logrando que el frontend cargue datos de simulación y analíticas reales para ese rol de manera instantánea y sin desloguearse.

**Tech Stack:** React, TypeScript, Axios, Express, Prisma ORM, Supabase Auth.

---

### Task 1: Siembra de Datos de Usuarios y Simulaciones Demo

**Files:**
- Create: `backend/prisma/seed-demo-users.ts`

- [ ] **Step 1: Crear el script de seeding de usuarios demo**
  Crear el script en `backend/prisma/seed-demo-users.ts` para verificar la existencia de los usuarios `worker@aura.com`, `supervisor@aura.com` y `admin@aura.com` en Supabase Auth y Prisma Profile. Si no existen, los crea con una contraseña predeterminada y les asocia intentos de simulación representativos para que el Dashboard de Supervisor muestre analíticas reales del trabajador.

  ```typescript
  // backend/prisma/seed-demo-users.ts
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

    const worker = await ensureAuthUser("worker@aura.com", Role.EMPLOYEE, "Diego", "López (Worker)");
    const supervisor = await ensureAuthUser("supervisor@aura.com", Role.SUPERVISOR, "Juan", "Sandoval (Supervisor)");
    const admin = await ensureAuthUser("admin@aura.com", Role.ADMIN, "Carlos", "Admin (Creator)");

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
  ```

- [ ] **Step 2: Ejecutar el script de seeding**
  Ejecutar el script en el entorno local para validar que no existan errores de compilación ni de base de datos.
  Run: `npx ts-node prisma/seed-demo-users.ts`
  Expected: Mensaje final "¡Siembra demo finalizada con éxito!" en consola.

- [ ] **Step 3: Commit de la siembra**
  ```bash
  git add backend/prisma/seed-demo-users.ts
  git commit -m "db: add seed-demo-users script to seed supervisor and worker demo accounts"
  ```

---

### Task 2: Modificación de Middleware en Backend para Override de Contexto

**Files:**
- Modify: `backend/src/middleware/auth.middleware.ts`

- [ ] **Step 1: Modificar `requireAuth` para inyectar perfiles demo en base a la cabecera `x-demo-override-role`**
  Actualizar `requireAuth` para capturar la cabecera de override. Si `process.env.DEMO_MODE` está configurado como `'true'`, el middleware cargará los datos del perfil demo correspondiente y los reemplazará en `req.profile` y `req.user`.

  ```typescript
  // backend/src/middleware/auth.middleware.ts
  // Buscar en el archivo las lineas alrededor de requireAuth y reemplazarlas con:
  export async function requireAuth(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let profile = await ensureProfile(data.user);

    // Bypass de contexto para el Demo Mode
    const demoOverrideRole = req.headers["x-demo-override-role"];
    if (process.env.DEMO_MODE === "true" && demoOverrideRole) {
      console.log(`[DEMO MODE] Interceptando cabecera de override. Emulando rol: ${demoOverrideRole}`);
      let targetEmail = "";
      if (demoOverrideRole === "ADMIN") {
        targetEmail = "admin@aura.com";
      } else if (demoOverrideRole === "SUPERVISOR") {
        targetEmail = "supervisor@aura.com";
      } else if (demoOverrideRole === "EMPLOYEE" || demoOverrideRole === "WORKER") {
        targetEmail = "worker@aura.com";
      }

      if (targetEmail) {
        const demoProfile = await prisma.profile.findFirst({
          where: { email: targetEmail }
        });

        if (demoProfile) {
          console.log(`[DEMO MODE] Reemplazando perfil de ${profile.email} por perfil demo ${demoProfile.email}`);
          profile = demoProfile;
          req.user = { id: demoProfile.id, email: demoProfile.email };
        } else {
          console.warn(`[DEMO MODE] No se encontró el perfil demo para ${targetEmail}`);
        }
      }
    }

    req.user = req.user || data.user;
    req.profile = profile;

    next();
  }
  ```

- [ ] **Step 2: Verificar la compilación del backend**
  Validar que el backend siga compilando perfectamente tras agregar el import o la búsqueda de prisma.
  Run: `npm run build` (en `backend/`)
  Expected: Compilación exitosa (0 errores de compilación).

- [ ] **Step 3: Commit del middleware**
  ```bash
  git add backend/src/middleware/auth.middleware.ts
  git commit -m "feat(backend): add context swapping in auth middleware for demo mode"
  ```

---

### Task 3: Modificación del Cliente API Frontend para Inyección de Cabecera

**Files:**
- Modify: `frontend/src/lib/api.ts`

- [ ] **Step 1: Modificar Axios Request Interceptor para enviar `X-Demo-Override-Role`**
  Actualizar `frontend/src/lib/api.ts` para capturar el rol guardado en `localStorage` e insertarlo en los encabezados HTTP.

  ```typescript
  // frontend/src/lib/api.ts
  // Reemplazar el bloque interceptors.request.use con lo siguiente:
  api.interceptors.request.use(async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const emulatedRole = localStorage.getItem("aura-demo-emulated-role");
    if (emulatedRole) {
      config.headers["X-Demo-Override-Role"] = emulatedRole;
    }

    return config;
  });
  ```

- [ ] **Step 2: Commit de los cambios en el cliente API**
  ```bash
  git add frontend/src/lib/api.ts
  git commit -m "feat(frontend): inject X-Demo-Override-Role header from localStorage in axios interceptor"
  ```

---

### Task 4: Modificación del Guardia de Rutas Frontend

**Files:**
- Modify: `frontend/src/lib/authGuard.ts`

- [ ] **Step 1: Sobreescribir el rol devuelto por `getUserState` si existe un rol emulado**
  Modificar `frontend/src/lib/authGuard.ts` para que, cuando el usuario solicite sus datos de sesión, se devuelva el rol emulado guardado en el storage local.

  ```typescript
  // frontend/src/lib/authGuard.ts
  // Modificar la sección donde se procesa la respuesta exitosa del backend:
  // Alrededor de la línea 45:
  if (res.ok) {
    const profile = await res.json();
    
    // Obtener rol emulado local
    const emulatedRole = localStorage.getItem("aura-demo-emulated-role");
    const activeRole = emulatedRole || profile.role;

    return {
      isAuthenticated: true,
      isProfileComplete: true,
      role: activeRole === "WORKER" || activeRole === "EMPLOYEE" ? "EMPLOYEE" : activeRole,
    };
  }
  ```

- [ ] **Step 2: Commit del authGuard**
  ```bash
  git add frontend/src/lib/authGuard.ts
  git commit -m "feat(frontend): override session role in authGuard with emulated role"
  ```

---

### Task 5: Componente Visual del Conmutador de Roles (`DemoConsole`)

**Files:**
- Create: `frontend/src/components/dashboards/DemoConsole.tsx`

- [ ] **Step 1: Crear el componente del Widget Demo Console**
  Crear el archivo `frontend/src/components/dashboards/DemoConsole.tsx` con interfaz premium en Tailwind y micro-animaciones para el cambio de rol y recarga del cache de consultas.

  ```tsx
  // frontend/src/components/dashboards/DemoConsole.tsx
  import React, { useState, useEffect } from "react";
  import { ShieldAlert, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
  import { useQueryClient } from "@tanstack/react-query";
  import { useNavigate } from "@tanstack/react-router";

  export default function DemoConsole() {
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";
    if (!isDemoMode) return null;

    const [isOpen, setIsOpen] = useState(false);
    const [activeRole, setActiveRole] = useState<string>("EMPLOYEE");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
      const storedRole = localStorage.getItem("aura-demo-emulated-role");
      if (storedRole) {
        setActiveRole(storedRole);
      }
    }, []);

    const handleRoleSwitch = async (role: string) => {
      if (role === activeRole || isTransitioning) return;
      setIsTransitioning(true);

      // Guardar el rol en localStorage
      if (role === "REAL") {
        localStorage.removeItem("aura-demo-emulated-role");
      } else {
        localStorage.setItem("aura-demo-emulated-role", role);
      }

      setActiveRole(role);

      // Simular transición visual elegante de 800ms
      setTimeout(() => {
        // Limpiar toda la caché de TanStack Query para forzar refetch
        queryClient.clear();
        setIsTransitioning(false);
        setIsOpen(false);
        
        // Redirigir al dashboard general para evaluar el switch
        navigate({ to: "/dashboard" });
      }, 800);
    };

    return (
      <div className="fixed bottom-5 right-5 z-50 font-sans">
        {/* Transition Overlay */}
        {isTransitioning && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] transition-opacity duration-300">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
              <div>
                <h4 className="text-white font-bold text-sm">Cambiando de Rol...</h4>
                <p className="text-slate-400 text-xs mt-1">Reconfigurando permisos y cargando datos reales</p>
              </div>
            </div>
          </div>
        )}

        {/* Trigger Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 font-semibold text-xs py-2.5 px-4 rounded-full shadow-lg transition-all duration-300 animate-pulse hover:animate-none cursor-pointer"
          >
            <ShieldAlert size={14} className="animate-bounce" />
            <span>AURA Demo Console</span>
            <ChevronUp size={12} />
          </button>
        )}

        {/* Expanded Console Card */}
        {isOpen && (
          <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-800 rounded-2xl p-4 shadow-2xl w-80 text-left transition-all duration-300">
            <div className="flex items-center justify-between border-bottom border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                  AURA Demo Console
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            <p className="text-slate-400 text-[11px] mb-3 leading-relaxed">
              Cambia instantáneamente la vista del juez simulando los datos y permisos reales de cada perfil sembrado en Sempra.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleRoleSwitch("EMPLOYEE")}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  activeRole === "EMPLOYEE"
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                    : "bg-slate-950/30 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex flex-col text-left">
                  <span>Diego López (Worker)</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Vista de Cursos y simulaciones</span>
                </div>
                {activeRole === "EMPLOYEE" && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full">Activo</span>}
              </button>

              <button
                onClick={() => handleRoleSwitch("SUPERVISOR")}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  activeRole === "SUPERVISOR"
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                    : "bg-slate-950/30 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex flex-col text-left">
                  <span>Juan Sandoval (Supervisor)</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Vista de analíticas y equipo</span>
                </div>
                {activeRole === "SUPERVISOR" && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full">Activo</span>}
              </button>

              <button
                onClick={() => handleRoleSwitch("ADMIN")}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  activeRole === "ADMIN"
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                    : "bg-slate-950/30 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex flex-col text-left">
                  <span>Carlos Admin (Creator)</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Vista de Creador de Cursos IA</span>
                </div>
                {activeRole === "ADMIN" && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full">Activo</span>}
              </button>
            </div>

            {localStorage.getItem("aura-demo-emulated-role") && (
              <button
                onClick={() => handleRoleSwitch("REAL")}
                className="w-full mt-3 text-center text-[10px] text-slate-500 hover:text-rose-400 transition-colors py-1 border-t border-slate-850 cursor-pointer"
              >
                Restablecer a cuenta de Google real
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit del widget**
  ```bash
  git add frontend/src/components/dashboards/DemoConsole.tsx
  git commit -m "feat(frontend): create DemoConsole widget component with role selection and cache clear"
  ```

---

### Task 6: Inyección del Widget en el Layout del Router de TanStack

**Files:**
- Modify: `frontend/src/router.tsx`

- [ ] **Step 1: Importar y agregar `DemoConsole` en el rootRoute del Router**
  Modificar el archivo `frontend/src/router.tsx` para inyectar el widget en el componente raíz de la aplicación, permitiendo su visibilidad y persistencia en cualquier ruta.

  ```typescript
  // frontend/src/router.tsx
  // Añadir la importación al inicio del archivo:
  import DemoConsole from "./components/dashboards/DemoConsole";

  // Reemplazar la definición de rootRoute (alrededor de la línea 23) con:
  const rootRoute = createRootRoute({
    component: () => (
      <div className="min-h-screen bg-gray-50 ">
        <Outlet />
        <DemoConsole />
      </div>
    ),
  });
  ```

- [ ] **Step 2: Ejecutar el frontend y comprobar compilación**
  Verificar que el empaquetado y chequeo de tipos del frontend pase sin errores.
  Run: `npm run build` (en `frontend/`)
  Expected: Compilación exitosa en menos de 3 segundos con 0 errores de TypeScript.

- [ ] **Step 3: Commit del router**
  ```bash
  git add frontend/src/router.tsx
  git commit -m "feat(frontend): register DemoConsole widget in root route tree"
  ```
