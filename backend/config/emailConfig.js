/**
 * Configuración centralizada para el servicio de emails
 * Maneja todas las variables de entorno y configuraciones relacionadas con email
 */

const emailConfig = {
  // Configuración general
  isEnabled: process.env.EMAIL_ENABLED === 'true' || false,

  // Configuración del proveedor de email
  service: process.env.EMAIL_SERVICE || 'gmail', // 'gmail', 'outlook', 'yahoo', etc.
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false, // true para 465, false para otros puertos

  // Credenciales de autenticación
  user: process.env.EMAIL_USER || '',
  password: process.env.EMAIL_PASSWORD || '', // App password para Gmail

  // Configuración del remitente
  fromEmail: process.env.EMAIL_FROM || process.env.EMAIL_USER || '',
  fromName: process.env.EMAIL_FROM_NAME || 'I.E.P Peruano Chino',

  // Email de soporte
  supportEmail:
    process.env.EMAIL_SUPPORT ||
    process.env.EMAIL_USER ||
    'soporte@iepperuanochino.edu.pe',

  // Configuración de seguridad
  rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== 'false', // true por defecto

  // Configuración de desarrollo
  isDevelopment: process.env.NODE_ENV === 'development',

  // Configuración de rate limiting
  rateLimit: {
    maxEmails: parseInt(process.env.EMAIL_RATE_LIMIT_MAX) || 100, // emails por hora
    windowMs: parseInt(process.env.EMAIL_RATE_LIMIT_WINDOW) || 3600000 // 1 hora en ms
  },

  // Templates por defecto
  defaultTemplates: {
    passwordReset: 'password-reset',
    passwordChanged: 'password-changed',
    welcome: 'welcome',
    notification: 'notification'
  }
};

/**
 * Valida la configuración de email
 * @returns {Object} - Resultado de la validación
 */
function validateEmailConfig() {
  const errors = [];
  const warnings = [];

  if (!emailConfig.isEnabled) {
    warnings.push('Servicio de email deshabilitado');
    return { isValid: true, errors, warnings };
  }

  if (!emailConfig.user) {
    errors.push('EMAIL_USER no está configurado');
  }

  if (!emailConfig.password) {
    errors.push('EMAIL_PASSWORD no está configurado');
  }

  if (!emailConfig.fromEmail) {
    errors.push('EMAIL_FROM no está configurado');
  }

  if (emailConfig.service === 'gmail' && !emailConfig.password.includes(' ')) {
    warnings.push(
      'Para Gmail, se recomienda usar App Passwords en lugar de la contraseña normal'
    );
  }

  if (emailConfig.port === 465 && !emailConfig.secure) {
    warnings.push('Puerto 465 requiere secure: true');
  }

  if (emailConfig.port !== 465 && emailConfig.secure) {
    warnings.push('secure: true solo se recomienda para puerto 465');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Obtiene la configuración para diferentes proveedores de email
 * @param {string} provider - Proveedor de email
 * @returns {Object} - Configuración específica del proveedor
 */
function getProviderConfig(provider) {
  const configs = {
    gmail: {
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false
    },
    outlook: {
      service: 'hotmail',
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false
    },
    yahoo: {
      service: 'yahoo',
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false
    },
    sendgrid: {
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false
    },
    mailgun: {
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false
    }
  };

  return configs[provider.toLowerCase()] || configs.gmail;
}

/**
 * Obtiene la configuración completa de email
 * @returns {Object} - Configuración de email
 */
function getConfig() {
  return {
    provider: process.env.EMAIL_PROVIDER || 'gmail',
    smtp: {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true' || false,
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      }
    },
    from: {
      name: process.env.EMAIL_FROM_NAME || 'I.E.P Peruano Chino',
      address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || '',
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER || ''
    },
    urls: {
      frontend: process.env.FRONTEND_URL || 'http://localhost:3002',
      resetPassword:
        process.env.RESET_PASSWORD_URL || 'http://localhost:3002/reset-password'
    },
    development: {
      debug: process.env.EMAIL_DEBUG === 'true' || false,
      preview: process.env.EMAIL_PREVIEW === 'true' || false
    },
    rateLimit: {
      maxEmails: parseInt(process.env.EMAIL_RATE_LIMIT) || 50
    }
  };
}

/**
 * Genera configuración de ejemplo para el archivo .env
 * @returns {string} - Configuración de ejemplo
 */
function generateEnvExample() {
  return `
# 📧 CONFIGURACIÓN DE EMAIL
# Habilitar/deshabilitar servicio de email
EMAIL_ENABLED=true

# Proveedor de email (gmail, outlook, yahoo, sendgrid, mailgun)
EMAIL_SERVICE=gmail

# Configuración SMTP (opcional si usas un servicio conocido)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

# Credenciales de autenticación
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password

# Configuración del remitente
EMAIL_FROM=tu-email@gmail.com
EMAIL_FROM_NAME="I.E.P Peruano Chino"

# Email de soporte
EMAIL_SUPPORT=soporte@iepperuanochino.edu.pe

# Configuración de seguridad
EMAIL_REJECT_UNAUTHORIZED=true

# Rate limiting (opcional)
EMAIL_RATE_LIMIT_MAX=100
EMAIL_RATE_LIMIT_WINDOW=3600000
`;
}

module.exports = {
  getConfig,
  validateConfig: validateEmailConfig,
  getProviderConfig,
  generateEnvExample,
  isEnabled: () =>
    process.env.EMAIL_PROVIDER &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
};
