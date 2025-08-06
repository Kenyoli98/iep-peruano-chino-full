// Rutas para el sistema de pre-registro de estudiantes

const express = require('express');
const router = express.Router();
const {
  preRegistrarEstudiante,
  validarCodigoYDNI,
  iniciarCompletarRegistro,
  verificarEmailYCompletarRegistro,
  reenviarCodigoVerificacion,
  listarPreRegistros,
  obtenerEstadisticas,
  cambiarEstadoEstudiante,
  importarPreRegistrosCSV,
  reactivarPreRegistro
} = require('../controllers/preRegistroController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Rutas públicas (sin autenticación)
// Validar código y DNI antes de completar registro
router.post('/validar', validarCodigoYDNI);

// Iniciar proceso de completar registro (envía código de verificación)
router.post('/completar', iniciarCompletarRegistro);

// Verificar código de email y completar registro
router.post('/verificar-email', verificarEmailYCompletarRegistro);

// Reenviar código de verificación
router.post('/reenviar-codigo', reenviarCodigoVerificacion);

// Rutas protegidas para administradores
// Pre-registrar estudiante (solo admin)
router.post('/admin/crear', authMiddleware, roleMiddleware('admin'), preRegistrarEstudiante);

// Listar pre-registros con filtros (solo admin)
router.get('/admin/listar', authMiddleware, roleMiddleware('admin'), listarPreRegistros);

// Obtener estadísticas (solo admin)
router.get('/admin/estadisticas', authMiddleware, roleMiddleware('admin'), obtenerEstadisticas);

// Cambiar estado de estudiante (activar/suspender) (solo admin)
router.patch('/admin/:id/estado', authMiddleware, roleMiddleware('admin'), cambiarEstadoEstudiante);

// Importar pre-registros desde CSV (solo admin)
router.post('/admin/importar-csv', 
  authMiddleware, 
  roleMiddleware('admin'), 
  upload.single('csv'), 
  importarPreRegistrosCSV
);

// Reactivar pre-registro expirado (solo admin)
router.patch('/admin/:id/reactivar', authMiddleware, roleMiddleware('admin'), reactivarPreRegistro);

module.exports = router;