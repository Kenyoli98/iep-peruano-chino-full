const express = require('express');
const prisma = require('../prismaClient');
const verificarToken = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /estadisticas - Obtener estadísticas del dashboard
router.get('/', verificarToken, async (req, res) => {
  try {
    console.log('🔍 Obteniendo estadísticas del dashboard...');

    // Contar total de usuarios
    const totalUsuarios = await prisma.usuario.count();

    // Contar estudiantes (usuarios con rol 'alumno')
    const totalEstudiantes = await prisma.usuario.count({
      where: {
        rol: 'alumno'
      }
    });

    // Contar docentes (usuarios con rol 'profesor')
    const totalDocentes = await prisma.usuario.count({
      where: {
        rol: 'profesor'
      }
    });

    // Contar total de cursos
    const totalCursos = await prisma.curso.count();

    // Contar total de secciones
    const totalSecciones = await prisma.seccion.count();

    // Contar matrículas activas (del año actual)
    const anioActual = new Date().getFullYear();
    const matriculasActivas = await prisma.matricula.count({
      where: {
        anioAcademico: anioActual
      }
    });

    // Contar asignaciones activas
    const asignacionesActivas = await prisma.asignacionProfesor.count({
      where: {
        anioAcademico: anioActual
      }
    });

    // Preparar respuesta
    const estadisticas = {
      totalUsuarios,
      totalEstudiantes,
      totalDocentes,
      totalCursos,
      totalSecciones,
      matriculasActivas,
      asignacionesActivas,
      anioAcademico: anioActual,
      fechaActualizacion: new Date().toISOString()
    };

    console.log('✅ Estadísticas obtenidas exitosamente:', estadisticas);

    res.status(200).json({
      success: true,
      data: estadisticas,
      mensaje: 'Estadísticas obtenidas exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor al obtener estadísticas',
      error: error.message
    });
  }
});

module.exports = router;
