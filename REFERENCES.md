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

### Peticiones a la API (TanStack Query y Custom Hooks)
- **Regla Estricta:** TODAS las peticiones de red al backend deben realizarse utilizando `@tanstack/react-query` (`useQuery`, `useMutation`) a través de **Custom Hooks centralizados**. Está estrictamente prohibido usar `useQuery` o `fetch`/`axios` directamente dentro de los componentes visuales para evitar duplicación de lógica.
- **Estructura Requerida:**
  1. Definir la lógica de la petición HTTP y las `Query Keys` en un archivo en `src/api/` (ej. `profileApi.ts`).
  2. Encapsular la llamada de TanStack Query en un archivo en `src/hooks/` (ej. `useProfile.ts`).
  3. Consumir únicamente el Custom Hook en el componente visual.
- **Cuándo usar el patrón:** Siempre que necesites leer o escribir datos del servidor en el Frontend.
- **Snippet de Referencia:**
  ```typescript
  // 1. Definición de API y Query Keys (src/api/enrollmentApi.ts)
  import { api } from '@/lib/api';

  export const enrollmentKeys = {
    all: ['enrollments'] as const,
    byProfile: (profileId: string) => ['enrollments', 'profile', profileId] as const,
  };

  export const enrollmentApi = {
    getByProfileId: (profileId: string) => api.get(`/api/enrollments/${profileId}`).then(r => r.data),
  };

  // 2. Custom Hook Centralizado (src/hooks/useEnrollments.ts)
  import { useQuery } from '@tanstack/react-query';
  import { enrollmentApi, enrollmentKeys } from '@/api/enrollmentApi';

  export const useProfileEnrollments = (profileId: string) =>
    useQuery({ 
      queryKey: enrollmentKeys.byProfile(profileId), 
      queryFn: () => enrollmentApi.getByProfileId(profileId), 
      enabled: !!profileId 
    });

  // 3. Consumo en el Componente (ej. my-courses.tsx)
  import { useProfileEnrollments } from "@/hooks/useEnrollments";

  export const MyCourses: React.FC = ({ profileId }) => {
    const { data: enrollments = [], isLoading, isError } = useProfileEnrollments(profileId);

    if (isLoading) return <div>Cargando...</div>;
    // ...
  };
  ```
- **Gotchas / Detalles importantes:**
  - **Manejo de Estados de Carga:** Cuando se manejen estados de carga (`isLoading`) de páginas o componentes en el frontend, **se debe hacer uso del componente `Skeleton` de shadcn por default**, simulando la estructura visual del resultado final. Evita usar spinners estáticos a menos que se especifique explícitamente lo contrario.
  - Siempre maneja `isError` con fallbacks visuales adecuados (Alertas, mensajes amigables).
  - Usa el parámetro `enabled` en la configuración del `useQuery` si la petición depende de un dato previo (ej. no ejecutar hasta tener el `profileId`).

### Componentes
- Separar componentes de UI genéricos (botones, inputs) de los componentes de negocio (formularios específicos, vistas completas).
- Preferir funciones puras y evitar efectos secundarios (`useEffect`) si se pueden derivar del estado.

---
*Nota: Agrega aquí fragmentos de código de referencia a medida que la arquitectura del proyecto se defina mejor.*
