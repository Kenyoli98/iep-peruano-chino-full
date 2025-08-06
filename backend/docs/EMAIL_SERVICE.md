# 📧 Servicio de Email - I.E.P Peruano Chino

## Descripción

El servicio de email del sistema I.E.P Peruano Chino proporciona una solución robusta y escalable para el envío de correos electrónicos automatizados, incluyendo recuperación de contraseñas, confirmaciones y notificaciones del sistema.

## 🏗️ Arquitectura

### Estructura de Archivos

```
backend/
├── services/
│   └── emailService.js          # Servicio principal de email
├── config/
│   └── emailConfig.js           # Configuración centralizada
├── utils/
│   └── logger.js                # Sistema de logging
├── templates/emails/
│   ├── password-reset.html      # Template de recuperación
│   └── password-changed.html    # Template de confirmación
└── docs/
    └── EMAIL_SERVICE.md         # Esta documentación
```

### Componentes

1. **EmailService**: Clase principal que maneja el envío de emails
2. **EmailConfig**: Configuración centralizada y validación
3. **Logger**: Sistema de logging para auditoría y debugging
4. **Templates**: Plantillas HTML responsivas para diferentes tipos de email

## ⚙️ Configuración

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```env
# Proveedor de email
EMAIL_PROVIDER=gmail

# Configuración SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

# Credenciales
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# Información del remitente
EMAIL_FROM_NAME="I.E.P Peruano Chino"
EMAIL_FROM_ADDRESS=noreply@iepperuanochino.edu.pe

# URLs del frontend
FRONTEND_URL=http://localhost:3002
RESET_PASSWORD_URL=http://localhost:3002/reset-password
```

### 2. Configuración por Proveedor

#### Gmail
1. Habilita la verificación en 2 pasos
2. Genera una "Contraseña de aplicación"
3. Usa esa contraseña en `EMAIL_PASS`

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

#### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

#### SMTP Personalizado
```env
EMAIL_PROVIDER=smtp
EMAIL_HOST=tu_servidor_smtp.com
EMAIL_PORT=587
EMAIL_USER=tu_usuario
EMAIL_PASS=tu_contraseña
```

## 🚀 Uso

### Inicialización

```javascript
const EmailService = require('./services/emailService');

// El servicio se inicializa automáticamente
// Verifica la configuración al importar
```

### Envío de Emails

#### Recuperación de Contraseña

```javascript
try {
  await EmailService.sendPasswordResetEmail(
    'usuario@email.com',
    'Juan Pérez',
    'token_de_reset_123'
  );
  console.log('Email de recuperación enviado');
} catch (error) {
  console.error('Error enviando email:', error);
}
```

#### Confirmación de Cambio de Contraseña

```javascript
try {
  await EmailService.sendPasswordChangedEmail(
    'usuario@email.com',
    'Juan Pérez'
  );
  console.log('Email de confirmación enviado');
} catch (error) {
  console.error('Error enviando email:', error);
}
```

#### Email Genérico

```javascript
try {
  await EmailService.sendEmail({
    to: 'destinatario@email.com',
    subject: 'Asunto del email',
    html: '<h1>Contenido HTML</h1>',
    text: 'Contenido en texto plano'
  });
} catch (error) {
  console.error('Error enviando email:', error);
}
```

## 🎨 Templates

### Características

- **Responsivos**: Se adaptan a dispositivos móviles
- **Profesionales**: Diseño moderno y limpio
- **Personalizables**: Variables dinámicas con `{{variable}}`
- **Accesibles**: Cumple estándares de accesibilidad

### Variables Disponibles

#### Password Reset Template
- `{{userName}}`: Nombre del usuario
- `{{resetUrl}}`: URL completa de reset
- `{{expiryTime}}`: Tiempo de expiración
- `{{supportEmail}}`: Email de soporte
- `{{currentYear}}`: Año actual

#### Password Changed Template
- `{{userName}}`: Nombre del usuario
- `{{changeDate}}`: Fecha y hora del cambio
- `{{supportEmail}}`: Email de soporte
- `{{currentYear}}`: Año actual

### Personalización

Para crear nuevos templates:

1. Crea un archivo HTML en `templates/emails/`
2. Usa variables con formato `{{variable}}`
3. Agrega el método correspondiente en `EmailService`

## 🔧 Desarrollo

### Modo Debug

En desarrollo, configura:

```env
EMAIL_DEBUG=true
EMAIL_PREVIEW=true
NODE_ENV=development
```

Esto habilitará:
- Logs detallados de SMTP
- Preview de emails en consola
- Fallback a console.log si falla el envío

### Testing

Para probar el servicio:

```javascript
// Test básico de configuración
const EmailService = require('./services/emailService');
console.log('Servicio inicializado correctamente');

// Test de envío
EmailService.sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'Este es un email de prueba'
}).then(() => {
  console.log('Email enviado exitosamente');
}).catch(error => {
  console.error('Error:', error);
});
```

## 📊 Logging

### Niveles de Log

- **ERROR**: Errores críticos de envío
- **WARN**: Advertencias de configuración
- **INFO**: Emails enviados exitosamente
- **DEBUG**: Información detallada de SMTP

### Archivos de Log

Los logs se guardan en:
- `logs/app-YYYY-MM-DD.log`: Log principal
- `logs/error-YYYY-MM-DD.log`: Solo errores

### Rotación

- Archivos diarios
- Máximo 30 días de retención
- Máximo 10MB por archivo

## 🔒 Seguridad

### Mejores Prácticas

1. **Nunca** hardcodees credenciales en el código
2. Usa contraseñas de aplicación, no contraseñas principales
3. Habilita 2FA en cuentas de email
4. Limita la tasa de envío para prevenir spam
5. Valida todas las direcciones de email
6. Usa HTTPS en URLs de reset

### Rate Limiting

El servicio incluye protección contra spam:

```env
EMAIL_RATE_LIMIT=50  # Máximo 50 emails por hora
```

## 🚨 Troubleshooting

### Errores Comunes

#### "Invalid login"
- Verifica credenciales
- Asegúrate de usar contraseña de aplicación
- Verifica que 2FA esté habilitado

#### "Connection timeout"
- Verifica configuración de host y puerto
- Revisa firewall/proxy
- Confirma conectividad a internet

#### "Template not found"
- Verifica que el archivo de template existe
- Confirma la ruta del archivo
- Revisa permisos de lectura

### Debug Steps

1. Verifica configuración:
   ```javascript
   const config = require('./config/emailConfig');
   console.log(config.validateConfig());
   ```

2. Test de conectividad:
   ```bash
   telnet smtp.gmail.com 587
   ```

3. Revisa logs:
   ```bash
   tail -f logs/app-$(date +%Y-%m-%d).log
   ```

## 📈 Monitoreo

### Métricas Importantes

- Tasa de éxito de envío
- Tiempo de respuesta SMTP
- Errores por tipo
- Volumen de emails por hora

### Alertas Recomendadas

- Tasa de error > 5%
- Tiempo de respuesta > 10s
- Fallos de autenticación
- Límites de rate limiting alcanzados

## 🔄 Mantenimiento

### Tareas Regulares

1. **Diario**: Revisar logs de errores
2. **Semanal**: Verificar métricas de envío
3. **Mensual**: Limpiar logs antiguos
4. **Trimestral**: Rotar credenciales

### Actualizaciones

Para actualizar el servicio:

1. Backup de configuración actual
2. Test en ambiente de desarrollo
3. Deploy gradual en producción
4. Monitoreo post-deploy

## 📞 Soporte

Para soporte técnico:

- **Logs**: Revisa `logs/` para errores detallados
- **Configuración**: Usa `emailConfig.validateConfig()`
- **Testing**: Ejecuta tests de conectividad
- **Documentación**: Consulta esta guía

---

**Versión**: 1.0.0  
**Última actualización**: $(date +%Y-%m-%d)  
**Mantenido por**: Equipo de Desarrollo I.E.P Peruano Chino