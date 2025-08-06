# Multi-stage build para optimizar el tamaño de la imagen

# Etapa 1: Build del frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copiar archivos de configuración del frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copiar código fuente del frontend
COPY frontend/ ./

# Build del frontend
RUN npm run build

# Etapa 2: Setup del backend
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend

# Copiar archivos de configuración del backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Copiar código fuente del backend
COPY backend/ ./

# Generar cliente de Prisma
RUN npx prisma generate

# Etapa 3: Imagen final
FROM node:18-alpine AS production

# Instalar dependencias del sistema
RUN apk add --no-cache \
    sqlite \
    dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Crear directorios de trabajo
WORKDIR /app

# Copiar archivos del backend
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend ./backend

# Copiar archivos del frontend
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/public ./frontend/public
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/package*.json ./frontend/
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/next.config.js ./frontend/

# Instalar dependencias de producción del frontend
WORKDIR /app/frontend
RUN npm ci --only=production && npm cache clean --force

# Volver al directorio raíz
WORKDIR /app

# Crear directorios necesarios
RUN mkdir -p logs uploads data
RUN chown -R nextjs:nodejs logs uploads data

# Copiar scripts de inicio
COPY --chown=nextjs:nodejs docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Cambiar a usuario no-root
USER nextjs

# Exponer puertos
EXPOSE 3000 5000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Comando de inicio
ENTRYPOINT ["dumb-init", "--"]
CMD ["/usr/local/bin/docker-entrypoint.sh"]