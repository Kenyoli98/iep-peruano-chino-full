const express = require('express');
const router = express.Router();
const {
  registrarPension,
  listarPensiones,
  misPensiones,
  pagarPension
} = require('../controllers/pensionController');
const verificarToken = require('../middlewares/authMiddleware');
const permitirRoles = require('../middlewares/roleMiddleware');

router.post('/', verificarToken, permitirRoles('admin'), registrarPension);
router.get('/', verificarToken, permitirRoles('admin'), listarPensiones);
router.get(
  '/mis-pensiones',
  verificarToken,
  permitirRoles('alumno'),
  misPensiones
);
router.post('/pagar', verificarToken, permitirRoles('alumno'), pagarPension);

module.exports = router;
