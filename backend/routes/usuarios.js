const express = require('express');
const router = express.Router();
const { registrarUsuario, listarUsuarios, loginUsuario } = require('../controllers/usuariosController');
const verificarToken = require('../middlewares/authMiddleware');
const permitirRoles = require('../middlewares/roleMiddleware');

// 🔐 RUTAS PÚBLICAS (sin autenticación)
router.post('/login', loginUsuario);

// 🛡️ RUTAS PROTEGIDAS (requieren autenticación)
router.get('/', verificarToken, permitirRoles('admin'), listarUsuarios);
router.post('/', verificarToken, permitirRoles('admin'), registrarUsuario);

module.exports = router;

