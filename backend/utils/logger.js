const fs = require('fs');
const path = require('path');

/**
 * Sistema de logging profesional
 * Implementa diferentes niveles de log y rotación de archivos
 */
class Logger {
  constructor() {
    this.logLevels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };

    this.currentLevel =
      this.logLevels[process.env.LOG_LEVEL?.toUpperCase()] ||
      this.logLevels.INFO;
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  /**
   * Asegura que el directorio de logs exista
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Formatea el mensaje de log
   * @param {string} level - Nivel del log
   * @param {string} message - Mensaje
   * @param {Object} meta - Metadatos adicionales
   * @returns {string} - Mensaje formateado
   */
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString =
      Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaString}`;
  }

  /**
   * Escribe el log en archivo
   * @param {string} level - Nivel del log
   * @param {string} formattedMessage - Mensaje formateado
   */
  writeToFile(level, formattedMessage) {
    try {
      const date = new Date().toISOString().split('T')[0];
      const filename = `${date}.log`;
      const filepath = path.join(this.logDir, filename);

      fs.appendFileSync(filepath, formattedMessage + '\n');

      // Si es un error, también escribir en archivo de errores
      if (level === 'ERROR') {
        const errorFilepath = path.join(this.logDir, `${date}-errors.log`);
        fs.appendFileSync(errorFilepath, formattedMessage + '\n');
      }
    } catch (error) {
      console.error('Error escribiendo log:', error);
    }
  }

  /**
   * Método genérico de logging
   * @param {string} level - Nivel del log
   * @param {string} message - Mensaje
   * @param {Object} meta - Metadatos adicionales
   */
  log(level, message, meta = {}) {
    const levelValue = this.logLevels[level];

    if (levelValue <= this.currentLevel) {
      const formattedMessage = this.formatMessage(level, message, meta);

      // Escribir en consola con colores
      this.writeToConsole(level, formattedMessage);

      // Escribir en archivo si no estamos en modo test
      if (process.env.NODE_ENV !== 'test') {
        this.writeToFile(level, formattedMessage);
      }
    }
  }

  /**
   * Escribe en consola con colores
   * @param {string} level - Nivel del log
   * @param {string} message - Mensaje formateado
   */
  writeToConsole(level, message) {
    const colors = {
      ERROR: '\x1b[31m', // Rojo
      WARN: '\x1b[33m', // Amarillo
      INFO: '\x1b[36m', // Cian
      DEBUG: '\x1b[37m' // Blanco
    };

    const reset = '\x1b[0m';
    const color = colors[level] || colors.INFO;

    console.log(`${color}${message}${reset}`);
  }

  /**
   * Log de error
   * @param {string} message - Mensaje
   * @param {Object|Error} meta - Metadatos o error
   */
  error(message, meta = {}) {
    if (meta instanceof Error) {
      meta = {
        name: meta.name,
        message: meta.message,
        stack: meta.stack
      };
    }
    this.log('ERROR', message, meta);
  }

  /**
   * Log de advertencia
   * @param {string} message - Mensaje
   * @param {Object} meta - Metadatos
   */
  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  /**
   * Log de información
   * @param {string} message - Mensaje
   * @param {Object} meta - Metadatos
   */
  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  /**
   * Log de debug
   * @param {string} message - Mensaje
   * @param {Object} meta - Metadatos
   */
  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  /**
   * Limpia logs antiguos
   * @param {number} daysToKeep - Días a mantener
   */
  cleanOldLogs(daysToKeep = 30) {
    try {
      const files = fs.readdirSync(this.logDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);

        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          this.info(`Log antiguo eliminado: ${file}`);
        }
      });
    } catch (error) {
      this.error('Error limpiando logs antiguos:', error);
    }
  }

  /**
   * Obtiene estadísticas de logs
   * @returns {Object} - Estadísticas
   */
  getStats() {
    try {
      const files = fs.readdirSync(this.logDir);
      const stats = {
        totalFiles: files.length,
        totalSize: 0,
        oldestFile: null,
        newestFile: null
      };

      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const fileStats = fs.statSync(filePath);
        stats.totalSize += fileStats.size;

        if (!stats.oldestFile || fileStats.mtime < stats.oldestFile.mtime) {
          stats.oldestFile = { name: file, mtime: fileStats.mtime };
        }

        if (!stats.newestFile || fileStats.mtime > stats.newestFile.mtime) {
          stats.newestFile = { name: file, mtime: fileStats.mtime };
        }
      });

      return stats;
    } catch (error) {
      this.error('Error obteniendo estadísticas de logs:', error);
      return null;
    }
  }
}

// Exportar instancia singleton
module.exports = new Logger();
