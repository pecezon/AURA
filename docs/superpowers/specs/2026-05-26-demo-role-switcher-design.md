# Demo Role Switcher - Design Document

## Visión General
Diseño técnico para permitir a los evaluadores/jueces del demo de Sempra explorar las tres vistas de la aplicación (Trabajador, Supervisor y Administrador) de forma fluida, instantánea y con datos representativos de alta fidelidad, manteniendo su sesión de Google OAuth activa y evitando modificaciones complejas de base de datos.

Este mecanismo estará protegido por variables de entorno y se desactivará por completo en entornos de producción reales.

---

## 💻 Frontend (Consola Demo e Interceptor)

### 1. El Widget Flotante (`DemoConsole.tsx`)
- **Visual**: Un componente flotante en la esquina inferior derecha con diseño premium (glassmorphism: fondo translúcido con blur, bordes verdes con brillo de Sempra y micro-animación de pulso).
- **Control de Entorno**: Solo se inyecta en el árbol de componentes principal (`main.tsx` o `AppRouter` en `router.tsx`) si `import.meta.env.VITE_DEMO_MODE === 'true'`.
- **Acción**: Al seleccionar un rol (Trabajador, Supervisor, Administrador):
  1. Guarda el rol seleccionado en `localStorage` con la clave `aura-demo-emulated-role`.
  2. Limpia el caché de TanStack Query (`queryClient.clear()`) para forzar la recarga de datos limpios.
  3. Redirige al enrutador a `/dashboard` para que la lógica de redirección de rutas se ejecute de nuevo con la identidad emulada.

### 2. Guardia de Rutas (`authGuard.ts`)
- Modificar `getUserState` para que, si `localStorage.getItem('aura-demo-emulated-role')` está presente, devuelva el rol emulado (normalizado si es necesario, ej: `EMPLOYEE` para Worker) en lugar del rol real del perfil autenticado, permitiendo el acceso a las rutas específicas del router de TanStack.

### 3. Axios Interceptor (`api.ts` o Axios Setup)
- Modificar el interceptor de Axios del frontend para inyectar automáticamente la cabecera HTTP `X-Demo-Override-Role` en cada petición si hay un rol emulado activo en `localStorage`.

---

## ⚙️ Backend (Bypass de Contexto / Swapping)

### 1. Middleware de Autenticación (`auth.middleware.ts`)
- Modificar la lógica de `requireAuth` para interceptar la cabecera `X-Demo-Override-Role`:
  - Si `process.env.DEMO_MODE === 'true'` y la cabecera `X-Demo-Override-Role` está presente en los headers:
    1. Buscar el email/cuenta demo asociada al rol solicitado en la base de datos (ej. `worker@aura.com`, `supervisor@aura.com`, `admin@aura.com`).
    2. Reemplazar el objeto `req.profile` con el perfil del usuario demo encontrado.
    3. Reemplazar `req.user` con un mock consistente.
    4. Continuar al siguiente middleware/controlador.
  - Si `process.env.DEMO_MODE` no es `'true'` (producción), la cabecera se ignora por completo por motivos de seguridad.

### 2. Middleware de Rol (`requireRole.ts`)
- Utilizará el perfil modificado en `req.profile` para validar el rol, permitiendo el acceso a los endpoints protegidos.

---

## 🗄️ Base de Datos y Seeding (`seed-demo-users.ts`)
Crearemos un script de siembra específico para inicializar las cuentas y datos representativos:
1. **Perfiles Creados**:
   - `worker@aura.com` (Rol: `EMPLOYEE`, perfil completo con nombre "Diego (Worker)")
   - `supervisor@aura.com` (Rol: `SUPERVISOR`, perfil completo con nombre "Juan (Supervisor)")
   - `admin@aura.com` (Rol: `ADMIN`, perfil completo con nombre "Admin (Creator)")
2. **Datos de Demostración**:
   - Inscribir a `worker@aura.com` en los 4 cursos oficiales de Sempra.
   - Crear al menos **2 registros de simulación terminados** (`SimulationAttempt`) e intentos de cuestionarios (`QuizAttempt`) para `worker@aura.com`, de modo que cuando el juez cambie al rol de Supervisor, el dashboard cargue métricas y reportes cualitativos de IA con datos de comportamiento reales.

---

## 🔒 Criterios de Aislamiento y Seguridad
- **Cero Modificación en Supabase**: No dependemos del estado de autenticación por email de Supabase, ya que la sesión de Google original del evaluador sigue siendo la firma válida.
- **Doble Candado**:
  - Frontend: `VITE_DEMO_MODE === 'true'`.
  - Backend: `process.env.DEMO_MODE === 'true'`.
  Ambas deben ser verdaderas para activar el bypass.
