const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function aplicarRestriccionUnica() {
  try {
    console.log('Aplicando restricción de unicidad manualmente...');

    // Primero eliminar duplicados existentes
    console.log('\n1. Eliminando duplicados existentes...');

    // Obtener todos los cursos
    const cursos = await prisma.curso.findMany({
      orderBy: { id: 'asc' }
    });

    // Agrupar por nombre
    const cursosAgrupados = {};
    cursos.forEach(curso => {
      if (!cursosAgrupados[curso.nombre]) {
        cursosAgrupados[curso.nombre] = [];
      }
      cursosAgrupados[curso.nombre].push(curso);
    });

    // Eliminar duplicados
    let eliminados = 0;
    for (const [nombre, gruposCursos] of Object.entries(cursosAgrupados)) {
      if (gruposCursos.length > 1) {
        console.log(`Procesando duplicados de "${nombre}"...`);

        // Mantener el primero, eliminar los demás
        const cursosAEliminar = gruposCursos.slice(1);
        const cursoAMantener = gruposCursos[0];

        for (const curso of cursosAEliminar) {
          // Verificar asignaciones
          const asignaciones = await prisma.asignacionProfesor.findMany({
            where: { cursoId: curso.id }
          });

          if (asignaciones.length > 0) {
            console.log(
              `  - Moviendo ${asignaciones.length} asignaciones del curso ${curso.id} al ${cursoAMantener.id}`
            );
            await prisma.asignacionProfesor.updateMany({
              where: { cursoId: curso.id },
              data: { cursoId: cursoAMantener.id }
            });
          }

          console.log(`  - Eliminando curso duplicado ID: ${curso.id}`);
          await prisma.curso.delete({
            where: { id: curso.id }
          });
          eliminados++;
        }
      }
    }

    console.log(`Duplicados eliminados: ${eliminados}`);

    // Aplicar restricción de unicidad usando SQL directo
    console.log('\n2. Aplicando restricción de unicidad...');

    try {
      await prisma.$executeRaw`ALTER TABLE Curso ADD UNIQUE INDEX Curso_nombre_key (nombre)`;
      console.log('✅ Restricción de unicidad aplicada exitosamente');
    } catch (error) {
      if (
        error.message.includes('Duplicate entry') ||
        error.message.includes('already exists')
      ) {
        console.log('⚠️  La restricción ya existe o hay duplicados restantes');
        console.log('Error:', error.message);
      } else {
        console.log('❌ Error al aplicar restricción:', error.message);
      }
    }

    // Verificar que funciona
    console.log('\n3. Verificando restricción...');
    try {
      await prisma.curso.create({
        data: {
          nombre: 'TEST_VERIFICACION',
          descripcion: 'Prueba 1'
        }
      });

      await prisma.curso.create({
        data: {
          nombre: 'TEST_VERIFICACION',
          descripcion: 'Prueba 2'
        }
      });

      console.log('❌ La restricción aún no funciona');

      // Limpiar
      await prisma.curso.deleteMany({
        where: { nombre: 'TEST_VERIFICACION' }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('✅ Restricción funcionando correctamente');

        // Limpiar
        await prisma.curso.deleteMany({
          where: { nombre: 'TEST_VERIFICACION' }
        });
      } else {
        console.log('Error inesperado:', error.message);
      }
    }
  } catch (error) {
    console.error('Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

aplicarRestriccionUnica();
