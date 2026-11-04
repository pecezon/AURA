# ==========================================
# ETAPA 1: BUILDER (Compilación con Node)
# ==========================================
FROM --platform=linux/amd64 node:22-alpine AS builder

WORKDIR /app

# Argumentos de compilación que Vite necesita inyectar en el JS
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_AURA_BACKEND_URL=http://localhost:4000
ARG VITE_AURA_FRONTEND_URL=http://localhost:3000

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_AURA_BACKEND_URL=$VITE_AURA_BACKEND_URL
ENV VITE_AURA_FRONTEND_URL=$VITE_AURA_FRONTEND_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ==========================================
# ETAPA 2: RUNNER (Servidor Nginx Ultra Ligero)
# ==========================================
FROM --platform=linux/amd64 nginx:1.27-alpine

# Reemplazamos la configuración default de Nginx con la nuestra
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos SOLO los archivos estáticos generados por Vite desde la etapa builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto estándar HTTP
EXPOSE 80

# Arrancamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]