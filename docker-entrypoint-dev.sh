#!/bin/sh
set -e

# Función para logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [DEV] $1"
}

# Función para verificar si un puerto está disponible
wait_for_port() {
    local host=$1
    local port=$2
    local timeout=${3:-30}
    
    log "Esperando que $host:$port esté disponible..."
    
    for i in $(seq 1 $timeout); do
        if nc -z $host $port 2>/dev/null; then
            log "$host:$port está disponible"
            return 0
        fi
        sleep 1
    done
    
    log "Timeout esperando $host:$port"
    return 1
}

# Configurar base de datos para desarrollo
setup_dev_database() {
    log "Configurando base de datos de desarrollo..."
    cd /app/backend
    
    # Generar cliente de Prisma
    log "Generando cliente de Prisma..."
    npx prisma generate
    
    if [ ! -f "prisma/dev.db" ]; then
        log "Creando base de datos de desarrollo..."
        npx prisma db push
        
        # Crear usuario administrador si existe el script
        if [ -f "scripts/database-setup/crear_admin.js" ]; then
            log "Creando usuario administrador de desarrollo..."
            node scripts/database-setup/crear_admin.js
        fi
    else
        log "Base de datos de desarrollo ya existe"
        # Aplicar cambios del esquema si los hay
        npx prisma db push
    fi
    
    cd /app
}

# Iniciar backend en modo desarrollo
start_dev_backend() {
    log "Iniciando backend en modo desarrollo..."
    cd /app/backend
    
    # Verificar si nodemon está disponible
    if command -v nodemon >/dev/null 2>&1; then
        nodemon index.js &
    else
        # Instalar nodemon si no está disponible
        npm install -g nodemon
        nodemon index.js &
    fi
    
    BACKEND_PID=$!
    cd /app
    
    # Esperar a que el backend esté listo
    wait_for_port localhost 5000 30
    
    if [ $? -ne 0 ]; then
        log "Error: Backend de desarrollo no pudo iniciarse"
        exit 1
    fi
    
    log "Backend de desarrollo iniciado correctamente (PID: $BACKEND_PID)"
}

# Iniciar frontend en modo desarrollo
start_dev_frontend() {
    log "Iniciando frontend en modo desarrollo..."
    cd /app/frontend
    
    # Limpiar caché de Next.js
    rm -rf .next
    
    # Iniciar Next.js en modo desarrollo
    exec npm run dev
}

# Función de limpieza
cleanup() {
    log "Recibida señal de terminación, cerrando servicios de desarrollo..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        log "Cerrando backend de desarrollo (PID: $BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
    fi
    
    log "Servicios de desarrollo cerrados"
    exit 0
}

# Configurar manejo de señales
trap cleanup TERM INT

# Configurar variables de entorno para desarrollo
if [ -z "$DATABASE_URL" ]; then
    export DATABASE_URL="file:./prisma/dev.db"
fi

if [ -z "$JWT_SECRET" ]; then
    export JWT_SECRET="dev-jwt-secret-not-for-production"
fi

export CORS_ORIGIN="http://localhost:3000"
export NEXT_PUBLIC_API_URL="http://localhost:5000"

# Crear directorios necesarios
mkdir -p /app/backend/prisma /app/backend/logs /app/backend/uploads

log "Iniciando I.E.P Peruano Chino - Entorno de Desarrollo"
log "Entorno: ${NODE_ENV:-development}"
log "Base de datos: $DATABASE_URL"
log "Hot reloading habilitado"

# Configurar base de datos
setup_dev_database

# Iniciar servicios en modo desarrollo
start_dev_backend
start_dev_frontend