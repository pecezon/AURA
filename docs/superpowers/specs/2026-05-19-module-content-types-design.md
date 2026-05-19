# Especificación de Diseño: Carga de Quizzes, Textos, Archivos, Videos, URLs y Audios en Módulos de Aprendizaje

**Fecha:** 2026-05-19
**Estado:** Propuesto (Para revisión del usuario)

---

## 1. Visión General y Alcance
El objetivo es asegurar que la plataforma AURA cargue y renderice con éxito todos los tipos de contenidos de los módulos de aprendizaje (`module-learning.tsx`). Esto incluye quizzes, textos enriquecidos, archivos adjuntos (PDFs), videos locales o externos (YouTube), URLs de otros dominios y un nuevo tipo nativo de **Audio** (MP3/Wav).

Se requiere:
1. Vista dividida (**Split-View**) en el panel de lectura (`READING`) si cuenta con un PDF o recurso enlazado.
2. Soporte nativo de un tipo de contenido **AUDIO** que acepte archivos locales subidos por el administrador y los reproduzca con una interfaz premium customizada en el visor.
3. Tratamiento de seguridad para URLs externas (evitando errores silenciosos por bloqueos de `X-Frame-Options` mediante detección automática).

---

## 2. Cambios en Base de Datos y Backend

### 2.1 Prisma Schema (`backend/prisma/schema.prisma`)
*   Se añade `"AUDIO"` al enumerador `ContentType`:
    ```prisma
    enum ContentType {
      READING
      VIDEO
      IMAGE
      AUDIO
    }
    ```

### 2.2 Migración de Base de Datos
*   Ejecutar la migración SQL para PostgreSQL:
    ```bash
    npx prisma migrate dev --name add_audio_content_type
    ```

### 2.3 Tipos TypeScript del Backend
*   **`backend/src/modules/course/course.types.ts`** y **`backend/src/modules/modulo/modulo.types.ts`**:
    *   Actualizar `ModuleContentCreateDTO` y `ModuleContentResponse` para añadir `"AUDIO"` a la unión de tipos:
        ```typescript
        type: "READING" | "VIDEO" | "IMAGE" | "AUDIO";
        ```
*   **`backend/src/modules/course/course.validation.ts`**:
    *   Actualizar el esquema de validación de Zod en `createCourseSchema` para aceptar `"AUDIO"` en `contents.type`.
*   **`backend/src/modules/modulo/modulo.controller.ts`**:
    *   Permitir `"AUDIO"` en la deserialización de parámetros del query de `getAllModulesContentByTypeAndCourseId`.

---

## 3. Cambios en la Interfaz del Administrador (Vite/React)

### 3.1 Tipos del Frontend (`frontend/src/components/dashboards/admin/types/module.types.ts`)
*   Modificar `ContentType` para incluir `"AUDIO"`:
    ```typescript
    export type ContentType = "READING" | "VIDEO" | "IMAGE" | "AUDIO" | "QUIZ";
    ```
*   Modificar las constantes de configuración de extensiones y etiquetas:
    ```typescript
    export const ACCEPTED_EXTENSIONS: Record<ContentType, string> = {
      READING: ".txt,.md,.pdf",
      IMAGE: ".jpg,.jpeg,.png,.webp,.gif",
      VIDEO: ".mp4,.mov,.webm",
      AUDIO: ".mp3,.wav,.m4a,.ogg",
      QUIZ: "",
    };

    export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
      READING: "Texto / Lectura / PDF",
      IMAGE: "Imagen",
      VIDEO: "Video",
      AUDIO: "Audio (Podcast/Instrucción)",
      QUIZ: "Evaluación (Quiz)",
    };
    ```

### 3.2 Componente del Editor (`frontend/src/components/dashboards/admin/module-content-item.tsx`)
*   **Restricciones de Pestaña:** Cuando `content.type === "AUDIO"`:
    *   La pestaña activa se forza a `"file"`.
    *   Se deshabilitan las pestañas `"text"` y `"url"`.
    *   Se muestra un mensaje informativo que explica que solo se admiten archivos locales de audio.
*   **Icono de Archivo:** Mostrar un icono de auriculares (`Headphones`) o bocina si el tipo es `AUDIO`.

### 3.3 Utilidades de Mapeo del Payload (`frontend/src/components/dashboards/admin/utils/course.utils.ts`)
*   Asegurar que `buildPayload` mapee correctamente el tipo `AUDIO` dentro del array `contents`:
    ```typescript
    contents: contentsOnly.map((c, cIdx) => ({
      type: c.type as "READING" | "VIDEO" | "IMAGE" | "AUDIO",
      title: c.title || null,
      content: c.content || null,
      url: c.url || null,
      order: cIdx,
    }))
    ```

---

## 4. Cambios en el Visor de Aprendizaje del Trabajador (`frontend/src/routes/module-learning.tsx`)

### 4.1 Split-View para Lectura (`READING`)
Modificar la lógica de renderizado del slide `READING`:
*   **Sin URL (Solo Texto):** Renderiza el panel actual a una columna de ancho completo.
*   **Con URL:** Renderiza una vista dividida (`flex flex-col md:flex-row gap-6`):
    *   **Panel Izquierdo (40% de ancho):** Título, texto descriptivo y botón destacado de acción ("Descargar PDF" o "Abrir Recurso").
    *   **Panel Derecho (60% de ancho):**
        *   Si termina en `.pdf` o contiene `.pdf`: Se embebe interactivo mediante `<iframe src={slide.url} className="w-full h-[500px] border-0 rounded-lg shadow-sm" />`.
        *   Si es una URL externa de otro dominio (detección automática selectiva): Muestra una tarjeta premium de aviso de recurso externo y un botón destacado para abrir en pestaña nueva con `target="_blank"`.

### 4.2 Reproductor Premium de Audio (`AUDIO`)
Cuando `slide.type === 'AUDIO'`, renderizar un reproductor premium en el visor:
*   **Instancia de Control:** Crear una etiqueta `<audio>` oculta manejada con `useRef`.
*   **Controles:** Botones estilizados de Play/Pause y volumen.
*   **Deslizador de Progreso:** Un `<input type="range" className="w-full h-2 rounded-lg cursor-pointer" />` sincronizado bidireccionalmente con el `currentTime` del audio.
*   **Visualizador de Onda Sonora:** Contenedor con 7 barras verticales animadas por CSS `@keyframes` que oscilan al reproducir y se aplanan al pausar.
*   **Cleanup:** Parar el audio automáticamente al cambiar de diapositiva (`handleNext`/`handlePrev`) o al desmontar el componente (`useEffect` cleanup).

---

## 5. Plan de Pruebas y Validación (TDD)
*   **Pruebas Backend (TDD):**
    *   Agregar pruebas de integración en `modulo.integration.test.ts` verificando que un módulo se puede crear y recuperar exitosamente conteniendo contenidos de tipo `AUDIO`.
*   **Pruebas Frontend:**
    *   Verificar que el editor de módulos bloquea correctamente las URLs y el texto libre cuando el tipo se cambia a `AUDIO`.
    *   Verificar que al guardar y publicar, el archivo MP3 se sube a Supabase Storage (`module-content` bucket) y se guarda con la URL correcta.
    *   Verificar el correcto renderizado del Split-View ante PDFs y URLs externas, así como el funcionamiento del reproductor de audio y su apagado al cambiar de slide.
