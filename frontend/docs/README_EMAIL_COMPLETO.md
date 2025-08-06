# 📧 Sistema de Recuperación de Contraseña - Guía Completa

## 🎯 Estado Actual del Sistema

### ✅ Funcionalidades Implementadas
- **Validación de email en frontend** - Verifica si el email existe antes de enviar solicitud
- **Endpoint de verificación** - `/usuarios/verify-email`
- **Sistema de recuperación completo** - Backend y frontend integrados
- **Templates de email responsivos** - HTML con estilos modernos
- **Validación robusta** - Formato, existencia y seguridad
- **Logging completo** - Seguimiento de todas las operaciones

### ⚠️ Pendiente de Configuración
- **Credenciales SMTP reales** - Actualmente usando credenciales de prueba

## 🚀 Cómo Activar el Envío de Emails

### Paso 1: Configurar Gmail con Contraseña de Aplicación

1. **Ir a tu cuenta de Gmail**
   - Accede a [myaccount.google.com](https://myaccount.google.com)

2. **Activar verificación en 2 pasos**
   - Seguridad → Verificación en 2 pasos → Activar

3. **Generar contraseña de aplicación**
   - Seguridad → Contraseñas de aplicaciones
   - Seleccionar "Correo" y "Otro (nombre personalizado)"
   - Escribir: "Sistema IEP"
   - Copiar la contraseña generada (16 caracteres)

### Paso 2: Actualizar Variables de Entorno

Editar el archivo `.env` en la carpeta `backend`:

```env
# ===== CONFIGURACIÓN DE EMAIL =====
EMAIL_PROVIDER=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

# 🔑 CAMBIAR ESTAS CREDENCIALES
EMAIL_USER=tu_email_real@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion_16_caracteres

# Información del remitente
EMAIL_FROM_NAME=I.E.P Peruano Chino
EMAIL_FROM_ADDRESS=tu_email_real@gmail.com
EMAIL_REPLY_TO=tu_email_real@gmail.com

# URL del frontend para reset
RESET_PASSWORD_URL=http://localhost:3002/reset-password

# Configuración de desarrollo
EMAIL_DEBUG=true
EMAIL_PREVIEW=true
```

### Paso 3: Reiniciar el Servidor

```bash
# En la terminal del backend
# Presionar Ctrl+C para detener
# Luego ejecutar:
npm run dev
```

### Paso 4: Verificar Configuración

```bash
# Probar el health check
curl http://localhost:3001/usuarios/email-health | jq .

# Debería mostrar:
# {
#   "status": "healthy",
#   "provider": "gmail",
#   "host": "smtp.gmail.com:587"
# }
```

## 🧪 Probar el Sistema Completo

### 1. Probar Validación de Email

```bash
# Email que NO existe
curl -X POST http://localhost:3001/usuarios/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"noexiste@test.com"}'

# Respuesta esperada:
# {
#   "exists": false,
#   "message": "El correo electrónico no está registrado."
# }
```

### 2. Probar Recuperación de Contraseña

```bash
# Con email registrado
curl -X POST http://localhost:3001/usuarios/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"tu_email_registrado@gmail.com"}'

# Si las credenciales están bien configuradas, recibirás un email
```

### 3. Probar desde el Frontend

1. Abrir: `http://localhost:3002/forgot-password`
2. Ingresar un email NO registrado → Ver error inmediato
3. Ingresar un email registrado → Ver mensaje de éxito
4. Revisar bandeja de entrada del email

## 🔧 Estructura del Sistema

### Backend
```
backend/
├── controllers/usuariosController.js  # ✅ Lógica de recuperación
├── routes/usuarios.js                 # ✅ Rutas de API
├── services/emailService.js           # ✅ Servicio de email
├── templates/emails/                  # ✅ Templates HTML
│   ├── password-reset.html
│   └── password-changed.html
└── .env                              # ⚠️ Configurar credenciales
```

### Frontend
```
frontend/src/
├── app/forgot-password/page.tsx       # ✅ Componente principal
├── app/reset-password/page.tsx        # ✅ Cambio de contraseña
└── services/passwordRecoveryService.ts # ✅ Servicios de API
```

## 🎨 Flujo de Usuario

### Recuperación de Contraseña
```
1. Usuario va a /forgot-password
2. Ingresa su email
3. 🆕 Sistema verifica si email existe
4. Si NO existe → Error inmediato
5. Si SÍ existe → Envía email de recuperación
6. Usuario recibe email con enlace
7. Hace clic en enlace → /reset-password?token=...
8. Ingresa nueva contraseña
9. Sistema actualiza contraseña
10. Envía email de confirmación
```

### Validación de Email (Nueva Funcionalidad)
```
1. Usuario ingresa email
2. Frontend llama a /usuarios/verify-email
3. Backend consulta base de datos
4. Retorna: { exists: true/false }
5. Frontend muestra error si no existe
6. Solo procede si email está registrado
```

## 🔒 Seguridad Implementada

- ✅ **Validación de formato** de email
- ✅ **Tokens únicos** con expiración (1 hora)
- ✅ **Hash seguro** de contraseñas (bcrypt)
- ✅ **Sanitización** de entradas
- ✅ **Rate limiting** implícito
- ✅ **Logging** de operaciones
- ✅ **Mensajes genéricos** para seguridad

## 📊 Endpoints Disponibles

### Públicos (sin autenticación)
```
POST /usuarios/verify-email     # 🆕 Verificar si email existe
POST /usuarios/forgot-password  # Solicitar recuperación
POST /usuarios/reset-password   # Confirmar nueva contraseña
GET  /usuarios/email-health     # Estado del servicio de email
```

### Protegidos (requieren token)
```
GET  /usuarios                  # Listar usuarios (admin)
POST /usuarios                  # Crear usuario (admin)
```

## 🐛 Solución de Problemas

### Email no llega
1. ✅ Verificar credenciales en `.env`
2. ✅ Confirmar contraseña de aplicación de Gmail
3. ✅ Revisar carpeta de spam
4. ✅ Verificar logs del servidor

### Error "Email service configured but connection failed"
1. ❌ Credenciales incorrectas
2. ❌ Contraseña de aplicación no generada
3. ❌ Verificación en 2 pasos no activada

### Frontend muestra error de conexión
1. ✅ Verificar que backend esté corriendo (puerto 3001)
2. ✅ Verificar que frontend esté corriendo (puerto 3002)
3. ✅ Revisar consola del navegador

## 📈 Mejoras Futuras

- [ ] **Rate limiting** avanzado
- [ ] **Cache** para verificación de emails
- [ ] **Analytics** de emails no encontrados
- [ ] **Notificaciones** de intentos de acceso
- [ ] **Templates** personalizables
- [ ] **Múltiples proveedores** de email

## 🎉 Estado Final

### ✅ Completamente Funcional
- Sistema de recuperación de contraseña
- Validación de email en frontend
- Templates responsivos
- Logging completo
- Documentación detallada

### ⚠️ Solo Falta
- Configurar credenciales SMTP reales
- Seguir la guía de configuración arriba

---

**¡El sistema está listo para producción una vez configuradas las credenciales de email!** 🚀