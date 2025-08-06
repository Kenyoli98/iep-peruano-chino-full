const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  listarUsuarios,
  loginUsuario,
  solicitarResetPassword,
  confirmarResetPassword,
  verificarEmail,
  verificarTelefono,
  verificarDNI
} = require('../controllers/usuariosController');
const { healthCheck } = require('../startup/emailStartup');
const verificarToken = require('../middlewares/authMiddleware');
const permitirRoles = require('../middlewares/roleMiddleware');

// 🔐 RUTAS PÚBLICAS (sin autenticación)
router.post('/login', loginUsuario);

// Rutas para recuperación de contraseña
router.post('/forgot-password', solicitarResetPassword);
router.post('/reset-password', confirmarResetPassword);

// Ruta para verificar si un email existe
router.post('/verify-email', verificarEmail);

// Ruta para verificar si un teléfono existe
router.post('/verify-phone', verificarTelefono);

// Ruta para verificar DNI y obtener información del usuario
router.post('/verify-dni', verificarDNI);

// Endpoint de salud del servicio de email
router.get('/email-health', async (req, res) => {
  try {
    const health = await healthCheck();
    const statusCode =
      health.status === 'healthy'
        ? 200
        : health.status === 'configured'
          ? 200
          : health.status === 'warning'
            ? 200
            : health.status === 'degraded'
              ? 503
              : 500;

    res.status(statusCode).json({
      service: 'email',
      timestamp: new Date().toISOString(),
      ...health
    });
  } catch (error) {
    res.status(500).json({
      service: 'email',
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 🛡️ RUTAS PROTEGIDAS (requieren autenticación)
router.get('/', verificarToken, permitirRoles('admin'), listarUsuarios);
router.post('/', verificarToken, permitirRoles('admin'), registrarUsuario);

module.exports = router;
