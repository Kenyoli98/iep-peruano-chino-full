#!/bin/sh
set -e

# Función para logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
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

# Configurar base de datos si no existe
setup_database() {
    log "Configurando base de datos..."
    cd /app/backend
    
    if [ ! -f "prisma/dev.db" ]; then
        log "Creando base de datos..."
        npx prisma db push
        
        # Crear usuario administrador si no existe
        if [ -f "scripts/database-setup/crear_admin.js" ]; then
            log "Creando usuario administrador..."
            node scripts/database-setup/crear_admin.js
        fi
    else
        log "Base de datos ya existe"
    fi
    
    cd /app
}

# Iniciar backend en segundo plano
start_backend() {
    log "Iniciando backend..."
    cd /app/backend
    node index.js &
    BACKEND_PID=$!
    cd /app
    
    # Esperar a que el backend esté listo
    wait_for_port localhost 5000 30
    
    if [ $? -ne 0 ]; then
        log "Error: Backend no pudo iniciarse"
        exit 1
    fi
    
    log "Backend iniciado correctamente (PID: $BACKEND_PID)"
}

# Iniciar frontend
start_frontend() {
    log "Iniciando frontend..."
    cd /app/frontend
    exec npm start
}

# Función de limpieza al recibir señales
cleanup() {
    log "Recibida señal de terminación, cerrando servicios..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        log "Cerrando backend (PID: $BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
    fi
    
    log "Servicios cerrados"
    exit 0
}

# Configurar manejo de señales
trap cleanup TERM INT

# Verificar variables de entorno requeridas
if [ -z "$DATABASE_URL" ]; then
    export DATABASE_URL="file:./prisma/dev.db"
fi

if [ -z "$JWT_SECRET" ]; then
    log "Advertencia: JWT_SECRET no está configurado, usando valor por defecto"
    export JWT_SECRET="default-jwt-secret-change-in-production"
fi

# Crear directorios necesarios
mkdir -p /app/backend/prisma /app/backend/logs /app/backend/uploads

log "Iniciando I.E.P Peruano Chino - Sistema de Gestión Educativa"
log "Entorno: ${NODE_ENV:-production}"
log "Base de datos: $DATABASE_URL"

# Configurar base de datos
setup_database

# Iniciar servicios
start_backend
start_frontend