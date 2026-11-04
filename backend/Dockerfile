# ==========================================
# ETAPA 1: BUILDER (Taller de Compilación)
# ==========================================
FROM node:22-alpine AS builder

# Instalar openssl (requerido por los binarios del motor de Prisma en Alpine Linux)
RUN apk add --no-cache openssl

WORKDIR /app

# 1. Copiamos solo los manifiestos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies para poder compilar con tsc)
RUN npm ci

# 2. Copiamos el esquema de Prisma y generamos el cliente fuertemente tipado
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npx prisma generate

# 3. Copiamos el código fuente y el tsconfig
COPY tsconfig.json ./
COPY src ./src

# 4. Compilamos TypeScript a JavaScript en /app/dist
RUN npm run build


# ==========================================
# ETAPA 2: RUNNER (Contenedor de Producción)
# ==========================================
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Cambiamos de usuario ANTES de instalar dependencias para que todo pertenezca a 'node'
# y limpiamos la caché de npm en el mismo comando
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiamos los artefactos compilados ya con el dueño correcto
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/generated ./generated
COPY --chown=node:node --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --chown=node:node --from=builder /app/prisma ./prisma

# Usamos el usuario seguro
USER node

EXPOSE 4000

CMD ["node", "dist/server.js"]