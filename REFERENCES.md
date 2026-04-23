# Referencias y Patrones de Arquitectura (REFERENCES.md)

Este documento centraliza los patrones de diseño, convenciones de nombres e implementaciones de referencia para que el asistente de IA los use al generar código nuevo (especialmente con el comando `/new-feature`).

## Backend (Node.js + Prisma)

### Patrón de Arquitectura
Seguimos una arquitectura de N capas:
1. **Model** (Prisma Schema): Única fuente de verdad para la base de datos.
2. **Repository** (Opcional/Depende del proyecto): Abstracción sobre Prisma para consultas complejas reutilizables.
3. **Service**: Contiene la lógica de negocio. No debe saber de peticiones HTTP (req/res).
4. **Controller**: Maneja la entrada/salida HTTP, extrae parámetros y delega al Service.
5. **Route**: Define los endpoints y conecta con los controladores y middlewares.

### Manejo de Errores
- Utilizar clases de error personalizadas (ej. `AppError` o `NotFoundError`).
- Los controladores deben envolver las llamadas asíncronas en bloques `try/catch` o usar un wrapper (ej. `catchAsync`).

## Frontend (React + Vite)

### Tipos (TypeScript)
- Definir tipos compartidos o interfaces exactas de la API antes de construir componentes.
- Evitar usar `any`. Preferir `unknown` o genéricos si es necesario.

### Hooks
- Lógica compleja o consumo de API debe encapsularse en Custom Hooks (ej. `useUser`, `useAuth`).
- Mantener los componentes UI lo más "tontos" (dumb) posible.

### Peticiones a la API (TanStack Query)
- **Regla Estricta:** TODAS las peticiones de red al backend deben realizarse utilizando `@tanstack/react-query` (`useQuery`, `useMutation`). No usar `fetch` o `axios` directamente dentro de un `useEffect` para guardar en estados locales.
- **Registro de Query Keys:** Para evitar peticiones duplicadas y permitir que la caché se comparta entre componentes (ej. *ProfileRecap* y *MyCourses*), se deben unificar las Query Keys.
- **Cuándo usar el patrón:** Siempre que necesites leer o escribir datos del servidor en el Frontend.
- **Snippet de Referencia:**
  ```typescript
  // 1. Unificar claves para consistencia (pueden vivir en un archivo central o exportarse)
  export const QUERY_KEYS = {
    profile: (id: string) => ["profile", id],
    enrollments: (profileId: string) => ["enrollments", profileId],
  };

  // 2. Implementación con manejo de estados
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.enrollments(profileId),
    queryFn: async () => {
      const response = await api.get(`/api/enrollments/${profileId}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Ajustar staleTime para evitar saturar el backend
    enabled: !!profileId, // Previene la ejecución si falta el ID
  });
  ```
- **Gotchas / Detalles importantes:**
  - Siempre maneja `isLoading` (preferiblemente con `Skeleton` de shadcn) y `isError` (con fallbacks visuales).
  - Usa el parámetro `enabled` si la query depende de un dato previo (ej. obtener primero el perfil, luego los cursos).

### Componentes
- Separar componentes de UI genéricos (botones, inputs) de los componentes de negocio (formularios específicos, vistas completas).
- Preferir funciones puras y evitar efectos secundarios (`useEffect`) si se pueden derivar del estado.

---
*Nota: Agrega aquí fragmentos de código de referencia a medida que la arquitectura del proyecto se defina mejor.*
