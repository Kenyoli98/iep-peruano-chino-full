import * as nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import * as path from 'path';
const { getConfig } = require('../config/emailConfig');
const logger = require('../utils/logger');

interface EmailOptions {
  to: string;
  template: string;
  data: Record<string, any>;
  subject: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  message: string;
  error?: string;
}

/**
 * Servicio centralizado para el manejo de emails
 * Implementa las mejores prácticas de desarrollo:
 * - Separación de responsabilidades
 * - Configuración centralizada
 * - Manejo de errores robusto
 * - Templates reutilizables
 * - Logging detallado
 */
class EmailService {
  private transporter: any = null;
  private isConfigured: boolean = false;

  constructor() {
    this.transporter = null;
    this.isConfigured = false;
  }

  /**
   * Inicializa el transportador de email
   * @returns {Promise<boolean>} - True si se configuró correctamente
   */
  async initialize() {
    try {
      const config = getConfig();

      if (!config.smtp.auth.user || !config.smtp.auth.pass) {
        logger.warn('Credenciales de email no configuradas');
        return false;
      }

      this.transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
          user: config.smtp.auth.user,
          pass: config.smtp.auth.pass
        },
        debug: config.development.debug,
        logger: config.development.debug
      });

      this.isConfigured = true;
      logger.info('Transportador de email inicializado');
      return true;
    } catch (error) {
      logger.error('Error al configurar servicio de email:', error);
      this.isConfigured = false;
      return false;
    }
  }

  /**
   * Envía un email usando un template
   * @param {Object} options - Opciones del email
   * @param {string} options.to - Destinatario
   * @param {string} options.template - Nombre del template
   * @param {Object} options.data - Datos para el template
   * @param {string} options.subject - Asunto del email
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendEmail({ to, template, data, subject }: EmailOptions): Promise<EmailResult> {
    try {
      if (!this.isConfigured) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Servicio de email no disponible');
        }
      }

      // Cargar y procesar template
      const htmlContent = await this.loadTemplate(template, data);

      const config = getConfig();
      const mailOptions = {
        from: `"${config.from.name}" <${config.from.address}>`,
        to,
        subject,
        html: htmlContent,
        replyTo: config.from.replyTo
      };

      const result = await this.transporter.sendMail(mailOptions);

      logger.info(`Email enviado exitosamente a ${to}`, {
        messageId: result.messageId,
        template,
        subject
      });

      return {
        success: true,
        messageId: result.messageId,
        message: 'Email enviado correctamente'
      };
    } catch (error: any) {
        logger.error('Error al enviar email:', {
          error: error.message,
          to,
          template,
          subject
        });

      return {
        success: false,
        error: error.message,
        message: 'Error al enviar email'
      };
    }
  }

  /**
   * Carga y procesa un template de email
   * @param {string} templateName - Nombre del template
   * @param {Object} data - Datos para reemplazar en el template
   * @returns {Promise<string>} - HTML procesado
   */
  async loadTemplate(templateName: string, data: Record<string, any> = {}): Promise<string> {
    try {
      const templatePath = path.join(
        __dirname,
        '../templates/emails',
        `${templateName}.html`
      );
      let htmlContent = await fs.readFile(templatePath, 'utf8');

      // Reemplazar variables en el template
      Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        htmlContent = htmlContent.replace(regex, data[key] || '');
      });

      return htmlContent;
    } catch (error: any) {
      logger.error(`Error al cargar template ${templateName}:`, error);
      throw new Error(`Template ${templateName} no encontrado`);
    }
  }

  /**
   * Envía email de recuperación de contraseña
   * @param {string} email - Email del usuario
   * @param {string} userName - Nombre del usuario
   * @param {string} resetToken - Token de recuperación
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendPasswordResetEmail(email: string, userName: string, resetToken: string): Promise<EmailResult> {
    const config = getConfig();
    const resetUrl = `${config.urls.resetPassword}?token=${resetToken}`;

    return await this.sendEmail({
      to: email,
      template: 'password-reset',
      subject: 'Recuperación de Contraseña - I.E.P Peruano Chino',
      data: {
        userName,
        resetUrl,
        expirationTime: '1 hora',
        supportEmail: config.from.replyTo,
        currentYear: new Date().getFullYear()
      }
    });
  }

  /**
   * Envía email de confirmación de cambio de contraseña
   * @param {string} email - Email del usuario
   * @param {string} userName - Nombre del usuario
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendPasswordChangedEmail(email: string, userName: string): Promise<EmailResult> {
    const config = getConfig();
    return await this.sendEmail({
      to: email,
      template: 'password-changed',
      subject: 'Contraseña Actualizada - I.E.P Peruano Chino',
      data: {
        userName,
        changeDate: new Date().toLocaleString('es-PE'),
        supportEmail: config.from.replyTo,
        currentYear: new Date().getFullYear()
      }
    });
  }

  /**
   * Envía email de verificación con código
   * @param {string} email - Email del usuario
   * @param {string} userName - Nombre del usuario
   * @param {string} verificationCode - Código de verificación
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendEmailVerification(email: string, userName: string, verificationCode: string): Promise<EmailResult> {
    const config = getConfig();
    return await this.sendEmail({
      to: email,
      template: 'email-verification',
      subject: 'Verificación de Email - I.E.P Peruano Chino',
      data: {
        userName,
        verificationCode,
        expirationTime: '15 minutos',
        supportEmail: config.from.replyTo,
        currentYear: new Date().getFullYear()
      }
    });
  }

  /**
   * Verifica si el servicio está disponible
   * @returns {boolean} - Estado del servicio
   */
  isAvailable() {
    const config = getConfig();
    return this.isConfigured && config.smtp.auth.user && config.smtp.auth.pass;
  }

  /**
   * Verifica la conexión SMTP
   * @returns {Promise<boolean>} - True si la conexión es exitosa
   */
  async verifyConnection() {
    try {
      if (!this.transporter) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('No se pudo inicializar el transportador de email');
        }
      }

      const verified = await this.transporter.verify();
      logger.info('Conexión SMTP verificada exitosamente');
      return verified;
    } catch (error) {
      logger.error('Error al verificar conexión SMTP:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export default new EmailService();
