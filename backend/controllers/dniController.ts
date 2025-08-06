import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as dniService from '../services/dniService';
const logger = require('../utils/logger');

/**
 * Consulta los datos de una persona por su DNI
 * @param req - Request object
 * @param res - Response object
 */
export const consultarDNI = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
      return;
    }

    const { dni } = req.params;
    
    if (!dni) {
      res.status(400).json({
        success: false,
        message: 'DNI es requerido'
      });
      return;
    }
    
    logger.info(`Solicitud de consulta DNI: ${dni} desde IP: ${req.ip}`);

    // Consultar DNI usando el servicio
    const resultado = await dniService.consultarDNI(dni);

    if (resultado.success) {
      logger.info(`Consulta DNI exitosa: ${dni}`);
      res.status(200).json({
        success: true,
        message: resultado.message,
        data: resultado.data,
        source: resultado.source || 'unknown',
        isSimulated: resultado.isSimulated || false
      });
    } else {
      logger.warn(`Consulta DNI fallida: ${dni} - ${resultado.message}`);
      res.status(404).json({
        success: false,
        message: resultado.message,
        data: null
      });
    }
  } catch (error: any) {
    logger.error('Error en consultarDNI controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Valida el formato de un DNI
 * @param req - Request object
 * @param res - Response object
 */
export const validarDNI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dni } = req.params;
    
    if (!dni) {
      res.status(400).json({
        success: false,
        message: 'DNI es requerido'
      });
      return;
    }
    
    const esValido = dniService.validarFormatoDNI(dni);
    
    res.status(200).json({
      success: true,
      data: {
        dni: dni,
        esValido: esValido,
        mensaje: esValido ? 'DNI válido' : 'DNI inválido - debe tener 8 dígitos'
      }
    });
  } catch (error: any) {
    logger.error('Error en validarDNI controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtiene estadísticas del servicio de DNI
 * @param req - Request object
 * @param res - Response object
 */
export const obtenerEstadisticas = async (req: Request, res: Response): Promise<void> => {
  try {
    const estadisticas = dniService.obtenerEstadisticas();
    
    res.status(200).json({
      success: true,
      data: estadisticas,
      message: 'Estadísticas obtenidas exitosamente'
    });
  } catch (error: any) {
    logger.error('Error en obtenerEstadisticas controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Endpoint de prueba para verificar que el servicio está funcionando
 * @param req - Request object
 * @param res - Response object
 */
export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: 'Servicio de DNI funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error: any) {
    logger.error('Error en healthCheck controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Exportación por defecto para compatibilidad
export default {
  consultarDNI,
  validarDNI,
  obtenerEstadisticas,
  healthCheck
};