import express from 'express';
import { body, param } from 'express-validator';
import * as dniController from '../controllers/dniController';
const authMiddleware = require('../middlewares/authMiddleware');
// const rateLimitMiddleware = require('../middleware/rateLimitMiddleware'); // Comentado temporalmente

const router = express.Router();

// Middleware de validación para DNI
const validarDNIParam = [
  param('dni')
    .isLength({ min: 8, max: 8 })
    .withMessage('El DNI debe tener exactamente 8 dígitos')
    .isNumeric()
    .withMessage('El DNI debe contener solo números')
];

// Rate limiting específico para consultas de DNI (comentado temporalmente)
// const dniRateLimit = rateLimitMiddleware({
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 50, // máximo 50 consultas por IP cada 15 minutos
//   message: {
//     success: false,
//     message: 'Demasiadas consultas de DNI. Intente nuevamente en 15 minutos.',
//     retryAfter: 15 * 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

/**
 * @route GET /api/dni/health
 * @desc Verificar estado del servicio de DNI
 * @access Public
 */
router.get('/health', dniController.healthCheck);

/**
 * @route GET /api/dni/estadisticas
 * @desc Obtener estadísticas del servicio de DNI
 * @access Private (requiere autenticación)
 */
router.get('/estadisticas', 
  authMiddleware, 
  dniController.obtenerEstadisticas
);

/**
 * @route GET /api/dni/validar/:dni
 * @desc Validar formato de DNI
 * @access Private (requiere autenticación)
 */
router.get('/validar/:dni', 
  authMiddleware,
  // dniRateLimit, // Comentado temporalmente
  validarDNIParam,
  dniController.validarDNI
);

/**
 * @route GET /api/dni/consultar/:dni
 * @desc Consultar datos de persona por DNI
 * @access Private (requiere autenticación)
 */
router.get('/consultar/:dni', 
  authMiddleware,
  // dniRateLimit, // Comentado temporalmente
  validarDNIParam,
  dniController.consultarDNI
);

export default router;