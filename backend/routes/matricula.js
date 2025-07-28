const express = require('express');
const router = express.Router();
const { 
  registrarMatricula, 
  listarMatriculas, 
  editarMatricula, 
  eliminarMatricula 
} = require('../controllers/matriculaController');
const verificarToken = require('../middlewares/authMiddleware');
const permitirRoles = require('../middlewares/roleMiddleware');

// Crear matrícula
router.post('/', verificarToken, permitirRoles('admin'), registrarMatricula);

// Listar matrículas
router.get('/', verificarToken, permitirRoles('admin'), listarMatriculas);

// Editar matrícula
router.put('/:id', verificarToken, permitirRoles('admin'), editarMatricula);

// Eliminar matrícula
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarMatricula);

module.exports = router;
