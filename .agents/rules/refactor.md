---
trigger: manual
---

---
name: refactor
description: >
  Refactoriza código JavaScript/TypeScript existente sin cambiar su comportamiento.
  Úsala ÚNICAMENTE cuando el usuario invoque explícitamente /refactor seguido de
  instrucciones claras de qué y cómo refactorizar. Por ejemplo:
  "/refactor extrae la lógica de validación a una función separada",
  "/refactor renombra las variables para que sean más descriptivas",
  "/refactor convierte los callbacks a async/await".
  NO la actives si el usuario solo dice "refactoriza esto" sin más contexto,
  ni ante frases vagas como "mejora el código" o "límpialo" — en esos casos
  pide primero qué quiere hacer y cómo.
  Esta skill es distinta de /fix-bug (no hay bug) y /new-feature (no hay funcionalidad nueva).
---

# /refactor [instrucción]

Refactoriza código JavaScript/TypeScript siguiendo **exactamente la instrucción del usuario**.

---

## Regla de oro

> El código antes y después debe hacer exactamente lo mismo.
> Sigue la instrucción dada — no hagas refactors adicionales no pedidos.
> Si encuentras un bug de paso, **repórtalo al final** sin tocarlo.
> Si detectas una mejora posible, **menciónala** — no la implementes.

---

## Proceso

### 1. Validar que hay instrucción clara
Si el usuario escribió `/refactor` sin contexto suficiente (sin decir qué cambiar ni cómo), **no procedas**. Pregunta:

```
¿Qué quieres refactorizar y cómo? Por ejemplo:
- /refactor extrae la validación a una función aparte
- /refactor renombra las variables del loop a nombres descriptivos
- /refactor simplifica los ifs anidados con early returns
```

### 2. Confirmar alcance si hay ambigüedad
Si la instrucción es clara pero el alcance no (ej: "extrae funciones" en un archivo de 300 líneas), pregunta brevemente qué parte aplica. Si es obvio, procede directo.

### 3. Aplicar el refactor
- Muestra el código **antes** y **después** con diff claro, o entrega el código completo refactorizado
- Usa comentarios solo si el código lo necesita — no comentes lo obvio
- Mantén el estilo existente del proyecto (comillas, punto y coma, indentación)
- Prefiere TypeScript explícito: tipos, interfaces, no `any`

### 4. Explicar los cambios
Después del código, da un resumen conciso de **qué cambiaste y por qué**:
```
### Cambios aplicados
- **Extraje `validateUser()`**: tenía 3 responsabilidades mezcladas; ahora cada función hace una sola cosa
- **Renombré `d` → `dueDate`**: el nombre anterior no comunicaba su propósito
- **Eliminé duplicación**: las líneas 12 y 34 hacían lo mismo; ahora usan `formatDate()` compartida
```

### 5. Reportar hallazgos colaterales (si los hay)
Si durante el refactor detectas bugs o posibles mejoras de funcionalidad, repórtalos **después** del refactor en una sección separada:
```
### ⚠️ Encontré esto de paso (no lo modifiqué)
- **Posible bug**: `getUserById()` no maneja el caso `undefined` — si el usuario no existe, lanza un error no controlado
- **Mejora posible**: podrías cachear el resultado de `fetchConfig()` si se llama frecuentemente
```

---

## Tipos de refactor

### Renombrar
- Variables, funciones, clases, tipos, interfaces, archivos
- Usa nombres que expresen **intención**, no implementación
- Prefiere verbos para funciones (`getUserById` no `user`), sustantivos para datos

### Extraer
- **Funciones**: cuando un bloque de código hace una tarea identificable
- **Componentes React**: cuando JSX supera ~50 líneas o se repite
- **Hooks**: cuando la lógica de estado/efecto se puede aislar
- **Módulos**: cuando un archivo tiene más de una responsabilidad clara

### Simplificar lógica
- Early returns para reducir anidación
- Operadores lógicos (`??`, `?.`, `||`) para simplificar guards
- Array methods (`map`, `filter`, `reduce`) en lugar de loops imperativos cuando mejora la claridad
- Eliminar lógica muerta o condiciones siempre verdaderas/falsas

### Reestructurar módulos
- Propón una estructura de archivos más clara
- Mueve funciones al módulo donde conceptualmente pertenecen
- Separa concerns: lógica de negocio vs. presentación vs. acceso a datos

---

## Lo que NO hace esta skill

- ❌ Corregir bugs (usa `/fix-bug`)
- ❌ Agregar funcionalidad nueva (usa `/new-feature`)
- ❌ Cambiar la API pública de una función sin avisar
- ❌ Cambiar el comportamiento aunque "parezca mejor"
- ❌ Reescribir todo desde cero sin pedirlo explícitamente