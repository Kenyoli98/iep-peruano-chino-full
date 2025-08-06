# 📧 Guía de Configuración de Email

## ¿Por qué no llegan los emails?

Actualmente el servicio de email está configurado pero **no tiene credenciales válidas**. Para que los emails funcionen, necesitas configurar una cuenta de email real.

## 🔧 Configuración Rápida con Gmail

### Paso 1: Preparar tu cuenta de Gmail

1. **Habilitar autenticación de 2 factores** en tu cuenta de Gmail
   - Ve a [myaccount.google.com](https://myaccount.google.com)
   - Seguridad → Verificación en 2 pasos
   - Sigue las instrucciones para habilitarla

2. **Crear una contraseña de aplicación**
   - Ve a [myaccount.google.com](https://myaccount.google.com)
   - Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe "IEP Sistema" como nombre
   - **Guarda la contraseña generada** (16 caracteres)

### Paso 2: Configurar las variables de entorno

Edita el archivo `.env` y reemplaza:

```bash
# Cambia estos valores:
EMAIL_USER=tu_email@gmail.com          # Tu email de Gmail
EMAIL_PASSWORD=tu_contraseña_de_aplicacion  # La contraseña de 16 caracteres
EMAIL_FROM_ADDRESS=tu_email@gmail.com  # El mismo email
```

### Paso 3: Reiniciar el servidor

Después de configurar las credenciales:

```bash
# El servidor se reiniciará automáticamente con nodemon
# Verás en los logs: "✅ Servicio de email inicializado correctamente"
```

### Paso 4: Probar el servicio

```bash
# Verificar estado del servicio
curl http://localhost:3001/usuarios/email-health

# Probar recuperación de contraseña (con un email real en la BD)
curl -X POST http://localhost:3001/usuarios/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario_real@ejemplo.com"}'
```

## 🔍 Solución de Problemas

### Error: "Credenciales de email no configuradas"
- ✅ Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` estén configurados
- ✅ Asegúrate de no tener espacios extra en las variables

### Error: "Invalid login"
- ✅ Verifica que la autenticación de 2 factores esté habilitada
- ✅ Usa la contraseña de aplicación, NO tu contraseña normal
- ✅ Verifica que el email sea correcto

### Error: "Connection timeout"
- ✅ Verifica tu conexión a internet
- ✅ Algunos firewalls corporativos bloquean SMTP

## 📋 Configuración Alternativa (Outlook)

Si prefieres usar Outlook:

```bash
EMAIL_PROVIDER=outlook
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@outlook.com
EMAIL_PASSWORD=tu_contraseña
```

## 🚀 Verificación Final

Cuando todo esté configurado correctamente verás:

```
✅ Servicio de email inicializado correctamente
🔐 Usuario SMTP: ***configurado***
🔑 Contraseña SMTP: ***configurado***
```

Y el endpoint de salud mostrará:
```json
{
  "status": "healthy",
  "message": "Email service is fully operational"
}
```

## 📞 ¿Necesitas ayuda?

Si sigues teniendo problemas:
1. Revisa los logs del servidor para errores específicos
2. Verifica que el usuario existe en la base de datos
3. Prueba con un email de prueba primero

---

**Nota:** En producción, usa variables de entorno del servidor y nunca commits credenciales al repositorio.