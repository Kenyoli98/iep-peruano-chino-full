const express = require('express');
const router = express.Router();
const { registrarNota, listarNotas, misNotas } = require('../controllers/notaController');
const verificarToken = require('../middlewares/authMiddleware');
const permitirRoles = require('../middlewares/roleMiddleware');

router.post('/', verificarToken, permitirRoles('profesor'), registrarNota);
router.get('/', verificarToken, permitirRoles('admin'), listarNotas);
router.get('/mis-notas', verificarToken, permitirRoles('alumno'), misNotas);

module.exports = router;
