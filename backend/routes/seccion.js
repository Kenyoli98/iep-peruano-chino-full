const express = require('express');
const router = express.Router();
const {
  listarSecciones,
  crearSeccion,
  editarSeccion,
  eliminarSeccion,
  importarSecciones
} = require('../controllers/seccionController');

const verificarToken = require('../middlewares/authMiddleware');
const permitirRoles = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', verificarToken, permitirRoles('admin'), listarSecciones);
router.post('/', verificarToken, permitirRoles('admin'), crearSeccion);
router.put('/:id', verificarToken, permitirRoles('admin'), editarSeccion); // ✅ Ruta para editar sección
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarSeccion); // ✅ Ruta para eliminar sección
router.post(
  '/importar',
  verificarToken,
  permitirRoles('admin'),
  upload.single('archivo'),
  importarSecciones
);

module.exports = router;
