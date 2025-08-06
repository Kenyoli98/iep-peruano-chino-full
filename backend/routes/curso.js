// Colocar en routes/cursoRoutes.js
const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const verificarToken = require('../middlewares/authMiddleware');
const permitirRoles = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get(
  '/',
  verificarToken,
  permitirRoles('admin'),
  cursoController.listarCursos
);
router.post(
  '/',
  verificarToken,
  permitirRoles('admin'),
  cursoController.crearCurso
);
router.put(
  '/:id',
  verificarToken,
  permitirRoles('admin'),
  cursoController.actualizarCurso
);
router.post(
  '/create-massive',
  verificarToken,
  permitirRoles('admin'),
  cursoController.crearCursosMasivo
);
router.post(
  '/cargar-csv',
  verificarToken,
  permitirRoles('admin'),
  upload.single('csv'),
  cursoController.cargarCursosDesdeCSV
);
router.delete(
  '/:id',
  verificarToken,
  permitirRoles('admin'),
  cursoController.eliminarCurso
);

module.exports = router;
