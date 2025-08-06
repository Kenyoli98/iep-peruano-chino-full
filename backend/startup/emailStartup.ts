/**
 * Email Service Startup Module
 *
 * Este módulo se encarga de inicializar y verificar el servicio de email
 * al arrancar el servidor, asegurando que todo esté configurado correctamente.
 */

import EmailService from '../services/emailService';
const { validateConfig, getConfig } = require('../config/emailConfig');
const logger = require('../utils/logger');

interface EmailServiceStatus {
  isConfigured: boolean;
  provider?: string;
  host?: string;
  port?: number;
  fromAddress?: string;
  environment?: string;
  errors?: string[];
  error?: string;
}

interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'degraded' | 'error' | 'configured';
  message: string;
  details?: EmailServiceStatus & { connectionError?: string };
  error?: string;
}

/**
 * Inicializa el servicio de email al arrancar el servidor
 */
export async function initializeEmailService(): Promise<boolean> {
  try {
    logger.info('🚀 Inicializando servicio de email...');

    // Validar configuración
    const configValidation = validateConfig();

    if (!configValidation.isValid) {
      logger.warn('⚠️  Configuración de email incompleta:');
      configValidation.errors.forEach((error: string) => {
        logger.warn(`   - ${error}`);
      });

      if (process.env.NODE_ENV === 'production') {
        logger.error(
          '❌ El servicio de email no puede iniciarse en producción sin configuración válida'
        );
        throw new Error(
          'Email service configuration is invalid for production'
        );
      } else {
        logger.warn('⚠️  Continuando en modo desarrollo sin email configurado');
        return false;
      }
    }

    // Test de conectividad (solo en desarrollo)
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.EMAIL_TEST_ON_STARTUP === 'true'
    ) {
      logger.info('🔍 Probando conectividad del servicio de email...');

      try {
        // Intentar verificar la conexión SMTP
        await EmailService.verifyConnection();
        logger.info('✅ Conexión SMTP verificada exitosamente');
      } catch (testError: any) {
        logger.warn(
          '⚠️  No se pudo verificar la conexión SMTP:',
          testError.message
        );
        logger.warn('   El servicio funcionará pero los emails podrían fallar');
      }
    }

    // Mostrar configuración (sin credenciales sensibles)
    const config = getConfig();
    const safeConfig = {
      provider: config.provider,
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      fromName: config.from.name,
      fromAddress: config.from.address,
      environment: process.env.NODE_ENV || 'development'
    };

    logger.info('📧 Servicio de email configurado:', safeConfig);

    // Configurar manejadores de eventos del servicio
    setupEmailEventHandlers();

    logger.info('✅ Servicio de email inicializado correctamente');
    return true;
  } catch (error: any) {
    logger.error('❌ Error inicializando servicio de email:', error);

    if (process.env.NODE_ENV === 'production') {
      throw error; // Fallar en producción si no se puede inicializar
    }

    logger.warn('⚠️  Continuando sin servicio de email en desarrollo');
    return false;
  }
}

/**
 * Configura manejadores de eventos para el servicio de email
 */
function setupEmailEventHandlers(): void {
  // Manejar errores no capturados del servicio de email
  process.on('emailServiceError', (error: Error) => {
    logger.error('Error en servicio de email:', error);
  });

  // Manejar estadísticas de email (si se implementa)
  process.on('emailSent', (info: any) => {
    logger.info(`Email enviado exitosamente: ${info.to}`);
  });
}

/**
 * Obtiene el estado del servicio de email
 */
export function getEmailServiceStatus(): EmailServiceStatus {
  try {
    const config = getConfig();
    const validation = validateConfig();

    return {
      isConfigured: validation.isValid,
      provider: config.provider,
      host: config.smtp.host,
      port: config.smtp.port,
      fromAddress: config.from.address,
      environment: process.env.NODE_ENV || 'development',
      errors: validation.errors
    };
  } catch (error: any) {
    return {
      isConfigured: false,
      error: error.message
    };
  }
}

/**
 * Endpoint de salud para el servicio de email
 */
export async function healthCheck(): Promise<HealthCheckResult> {
  try {
    const status = getEmailServiceStatus();

    if (!status.isConfigured) {
      return {
        status: 'warning',
        message: 'Email service not configured',
        details: status
      };
    }

    // En desarrollo, intentar verificar conexión
    if (process.env.NODE_ENV === 'development') {
      try {
        await EmailService.verifyConnection();
        return {
          status: 'healthy',
          message: 'Email service is working correctly',
          details: status
        };
      } catch (error: any) {
        return {
          status: 'degraded',
          message: 'Email service configured but connection failed',
          details: { ...status, connectionError: error.message }
        };
      }
    }

    return {
      status: 'configured',
      message: 'Email service is configured',
      details: status
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: 'Email service health check failed',
      error: error.message
    };
  }
}

/**
 * Función para mostrar información de configuración de email
 */
export function showEmailConfigInfo(): void {
  console.log('\n' + '='.repeat(60));
  console.log('📧 CONFIGURACIÓN DEL SERVICIO DE EMAIL');
  console.log('='.repeat(60));

  const status = getEmailServiceStatus();

  if (status.isConfigured) {
    console.log('✅ Estado: Configurado');
    console.log(`📡 Proveedor: ${status.provider}`);
    console.log(`🌐 Host: ${status.host}:${status.port}`);
    console.log(`📮 Remitente: ${status.fromAddress}`);
    console.log(`🔧 Entorno: ${status.environment}`);

    try {
      const config = getConfig();
      console.log(
        `🔐 Usuario SMTP: ${config.smtp.auth.user ? '***configurado***' : 'No configurado'}`
      );
      console.log(
        `🔑 Contraseña SMTP: ${config.smtp.auth.pass ? '***configurado***' : 'No configurado'}`
      );
      console.log(
        `🐛 Debug: ${config.development.debug ? 'Activado' : 'Desactivado'}`
      );
    } catch (error) {
      console.log(
        '⚠️  No se pudo obtener información detallada de configuración'
      );
    }
  } else {
    console.log('❌ Estado: No configurado');
    if (status.errors && status.errors.length > 0) {
      console.log('\n🚨 Errores de configuración:');
      status.errors.forEach((error: string) => {
        console.log(`   • ${error}`);
      });
    }
    console.log('\n💡 Para configurar el servicio de email:');
    console.log('   1. Copia .env.example a .env');
    console.log('   2. Configura las variables EMAIL_*');
    console.log('   3. Reinicia el servidor');
  }

  console.log('\n📚 Documentación: /docs/EMAIL_SERVICE.md');
  console.log('='.repeat(60) + '\n');
}

export default {
  initializeEmailService,
  getEmailServiceStatus,
  healthCheck,
  showEmailConfigInfo
};