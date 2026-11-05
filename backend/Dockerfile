# ==========================================
# STAGE 1: BUILDER (Build environment)
# ==========================================
FROM node:22-alpine AS builder

# Install openssl (required by Prisma engine binaries on Alpine Linux)
RUN apk add --no-cache openssl

WORKDIR /app

# 1. Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies required for tsc compilation)
RUN npm ci

# 2. Copy Prisma schema and generate strongly-typed client
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npx prisma generate

# 3. Copy source code and tsconfig
COPY tsconfig.json ./
COPY src ./src

# 4. Compile TypeScript to JavaScript in /app/dist
RUN npm run build


# ==========================================
# STAGE 2: RUNNER (Production runtime container)
# ==========================================
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Set ownership to non-root 'node' user before installing production dependencies and purge npm cache
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built artifacts and generated Prisma client with correct ownership
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/generated ./generated
COPY --chown=node:node --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --chown=node:node --from=builder /app/prisma ./prisma

# Run under non-privileged user
USER node

EXPOSE 4000

CMD ["node", "dist/server.js"]
