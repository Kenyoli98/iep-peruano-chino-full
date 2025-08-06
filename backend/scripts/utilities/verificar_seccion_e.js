const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarSeccionE() {
  try {
    console.log('🔍 Buscando sección E de INICIAL grado 3...');

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

    console.log('✅ Sección encontrada:');
    console.log(`   ID: ${seccion.id}`);
    console.log(`   Nombre: ${seccion.nombre}`);
    console.log(`   Nivel: ${seccion.nivel}`);
    console.log(`   Grado: ${seccion.grado}`);

    // Verificar asignaciones de profesores
    console.log('\n🔍 Verificando asignaciones de profesores...');
    const asignaciones = await prisma.asignacionProfesor.findMany({
      where: { seccionId: seccion.id },
      include: {
        profesor: {
          select: { nombre: true, apellido: true, email: true }
        },
        curso: {
          select: { nombre: true }
        }
      }
    });

    console.log(`📋 Asignaciones encontradas: ${asignaciones.length}`);

    if (asignaciones.length > 0) {
      console.log(
        '\n🚫 MOTIVO DE BLOQUEO: La sección tiene asignaciones de profesores'
      );
      console.log('📝 Detalles de asignaciones:');
      asignaciones.forEach((asignacion, index) => {
        console.log(
          `   ${index + 1}. Profesor: ${asignacion.profesor.nombre} ${asignacion.profesor.apellido}`
        );
        console.log(`      Curso: ${asignacion.curso.nombre}`);
        console.log(`      Año académico: ${asignacion.anioAcademico}`);
        console.log(`      ID asignación: ${asignacion.id}`);
      });

      console.log('\n💡 SOLUCIÓN: Para eliminar la sección, primero debes:');
      console.log('   1. Ir a la sección de "Asignaciones"');
      console.log(
        '   2. Eliminar todas las asignaciones de profesores a esta sección'
      );
      console.log('   3. Luego podrás eliminar la sección');
    } else {
      console.log('✅ No hay asignaciones que impidan la eliminación');

      // Verificar matrículas de estudiantes
      console.log('\n🔍 Verificando matrículas de estudiantes...');
      const matriculas = await prisma.matricula.findMany({
        where: { seccionId: seccion.id },
        include: {
          estudiante: {
            select: { nombre: true, apellido: true }
          }
        }
      });

      console.log(`📋 Matrículas encontradas: ${matriculas.length}`);

      if (matriculas.length > 0) {
        console.log(
          '\n🚫 MOTIVO DE BLOQUEO: La sección tiene estudiantes matriculados'
        );
        console.log('📝 Estudiantes matriculados:');
        matriculas.forEach((matricula, index) => {
          console.log(
            `   ${index + 1}. ${matricula.estudiante.nombre} ${matricula.estudiante.apellido}`
          );
        });

        console.log('\n💡 SOLUCIÓN: Para eliminar la sección, primero debes:');
        console.log('   1. Reasignar los estudiantes a otra sección');
        console.log('   2. O eliminar las matrículas (si es apropiado)');
        console.log('   3. Luego podrás eliminar la sección');
      } else {
        console.log('✅ No hay matrículas que impidan la eliminación');
        console.log(
          '\n🤔 Si aún no puedes eliminar la sección, puede haber otras restricciones.'
        );
      }
    }
  } catch (error) {
    console.error('❌ Error al verificar la sección:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarSeccionE();
