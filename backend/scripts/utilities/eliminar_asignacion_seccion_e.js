const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function eliminarAsignacionSeccionE() {
  try {
    console.log(
      '🔍 Buscando la asignación que bloquea la eliminación de la sección E...'
    );

    // Buscar la sección E
    const seccion = await prisma.seccion.findFirst({
      where: {
        nombre: 'E',
        nivel: 'INICIAL',
        grado: 3
      }
    });

    if (!seccion) {
      console.log('❌ No se encontró la sección E de INICIAL grado 3');
      return;
    }

    // Buscar la asignación específica
    const asignacion = await prisma.asignacionProfesor.findFirst({
      where: { seccionId: seccion.id },
      include: {
        profesor: {
          select: { nombre: true, apellido: true }
        },
        curso: {
          select: { nombre: true }
        }
      }
    });

    if (!asignacion) {
      console.log('✅ No hay asignaciones que eliminar');
      return;
    }

    console.log('📋 Asignación encontrada:');
    console.log(`   ID: ${asignacion.id}`);
    console.log(
      `   Profesor: ${asignacion.profesor.nombre} ${asignacion.profesor.apellido}`
    );
    console.log(`   Curso: ${asignacion.curso.nombre}`);
    console.log(`   Año académico: ${asignacion.anioAcademico}`);

    console.log(
      '\n⚠️  ¿Deseas eliminar esta asignación? (Esto permitirá eliminar la sección E)'
    );
    console.log('\n🔄 Eliminando asignación...');

    // Eliminar la asignación
    await prisma.asignacionProfesor.delete({
      where: { id: asignacion.id }
    });

    console.log('✅ Asignación eliminada exitosamente');
    console.log(
      '\n🎉 Ahora puedes eliminar la sección E de INICIAL grado 3 desde la interfaz web'
    );

    // Verificar que ya no hay asignaciones
    const asignacionesRestantes = await prisma.asignacionProfesor.findMany({
      where: { seccionId: seccion.id }
    });

    console.log(`\n🔍 Asignaciones restantes: ${asignacionesRestantes.length}`);

    if (asignacionesRestantes.length === 0) {
      console.log('✅ La sección E está lista para ser eliminada');
    }
  } catch (error) {
    console.error('❌ Error al eliminar la asignación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

eliminarAsignacionSeccionE();
