const express = require('express');
const router = express.Router();
const { listarAsignaciones, crearAsignacion, editarAsignacion, eliminarAsignacion, obtenerAsignacionesPorProfesor, agregarHorario, eliminarHorario } = require('../controllers/asignacionController');
const verificarToken = require('../middlewares/authMiddleware');
const permitirRoles = require('../middlewares/roleMiddleware');

router.get('/', verificarToken, permitirRoles('admin'), listarAsignaciones);
router.get('/profesor/:profesorId', verificarToken, permitirRoles('admin'), obtenerAsignacionesPorProfesor);
router.post('/', verificarToken, permitirRoles('admin'), crearAsignacion);
router.put('/:id', verificarToken, permitirRoles('admin'), editarAsignacion);
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarAsignacion);

// Rutas para horarios
router.post('/:asignacionId/horarios', verificarToken, permitirRoles('admin'), agregarHorario);
router.delete('/:asignacionId/horarios/:horarioId', verificarToken, permitirRoles('admin'), eliminarHorario);

module.exports = router;
