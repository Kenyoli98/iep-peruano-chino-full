const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function obtenerEstadisticas() {
  try {
    console.log('🔍 Obteniendo estadísticas de la base de datos...');

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

    console.log('\n📊 ESTADÍSTICAS DEL SISTEMA EDUCATIVO');
    console.log('=====================================');
    console.log(`👥 Total de Usuarios: ${totalUsuarios}`);
    console.log(`🎓 Total de Estudiantes: ${totalEstudiantes}`);
    console.log(`👨‍🏫 Total de Docentes: ${totalDocentes}`);
    console.log(`📚 Total de Cursos: ${totalCursos}`);
    console.log(`🏫 Total de Secciones: ${totalSecciones}`);
    console.log(`📝 Matrículas Activas (${anioActual}): ${matriculasActivas}`);
    console.log(
      `📋 Asignaciones Activas (${anioActual}): ${asignacionesActivas}`
    );

    // Retornar los datos en formato JSON
    const estadisticas = {
      totalUsuarios,
      totalEstudiantes,
      totalDocentes,
      totalCursos,
      totalSecciones,
      matriculasActivas,
      asignacionesActivas,
      anioAcademico: anioActual
    };

    console.log('\n📄 Datos en formato JSON:');
    console.log(JSON.stringify(estadisticas, null, 2));

    return estadisticas;
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
obtenerEstadisticas();
