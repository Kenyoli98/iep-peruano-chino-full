const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function eliminarCursosDuplicados() {
  try {
    console.log('Iniciando eliminación de cursos duplicados...');

    // Obtener todos los cursos
    const cursos = await prisma.curso.findMany({
      orderBy: { id: 'asc' }
    });

    console.log(`Total de cursos encontrados: ${cursos.length}`);

    // Agrupar por nombre
    const cursosAgrupados = {};
    cursos.forEach(curso => {
      if (!cursosAgrupados[curso.nombre]) {
        cursosAgrupados[curso.nombre] = [];
      }
      cursosAgrupados[curso.nombre].push(curso);
    });

    // Identificar y eliminar duplicados
    let eliminados = 0;
    for (const [nombre, gruposCursos] of Object.entries(cursosAgrupados)) {
      if (gruposCursos.length > 1) {
        console.log(
          `Encontrados ${gruposCursos.length} cursos con nombre "${nombre}"`
        );

        // Mantener el primer curso (más antiguo) y eliminar los demás
        const cursosAEliminar = gruposCursos.slice(1);
        const cursoAMantener = gruposCursos[0];

        for (const curso of cursosAEliminar) {
          console.log(
            `Procesando curso duplicado: ID ${curso.id}, Nombre: "${curso.nombre}"`
          );

          // Verificar si tiene asignaciones
          const asignaciones = await prisma.asignacionProfesor.findMany({
            where: { cursoId: curso.id }
          });

          if (asignaciones.length > 0) {
            console.log(
              `  - Moviendo ${asignaciones.length} asignaciones al curso principal (ID: ${cursoAMantener.id})`
            );

            // Mover las asignaciones al curso que se va a mantener
            await prisma.asignacionProfesor.updateMany({
              where: { cursoId: curso.id },
              data: { cursoId: cursoAMantener.id }
            });
          }

          console.log(`  - Eliminando curso duplicado: ID ${curso.id}`);
          await prisma.curso.delete({
            where: { id: curso.id }
          });
          eliminados++;
        }
      }
    }

    console.log(
      `\nProceso completado. Cursos duplicados eliminados: ${eliminados}`
    );
  } catch (error) {
    console.error('Error al eliminar cursos duplicados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

eliminarCursosDuplicados();
