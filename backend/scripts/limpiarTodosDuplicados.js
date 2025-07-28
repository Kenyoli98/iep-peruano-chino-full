const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function limpiarTodosDuplicados() {
  try {
    console.log('Limpiando TODOS los duplicados...');
    
    // Usar SQL directo para encontrar duplicados
    const duplicados = await prisma.$queryRaw`
      SELECT nombre, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM Curso 
      GROUP BY nombre 
      HAVING COUNT(*) > 1
    `;
    
    console.log(`Grupos de duplicados encontrados: ${duplicados.length}`);
    
    for (const grupo of duplicados) {
      const ids = grupo.ids.split(',').map(id => parseInt(id));
      const nombre = grupo.nombre;
      const count = grupo.count;
      
      console.log(`\nProcesando "${nombre}" (${count} duplicados): IDs [${ids.join(', ')}]`);
      
      // Mantener el ID más pequeño (más antiguo)
      const idAMantener = Math.min(...ids);
      const idsAEliminar = ids.filter(id => id !== idAMantener);
      
      console.log(`  - Manteniendo ID: ${idAMantener}`);
      console.log(`  - Eliminando IDs: [${idsAEliminar.join(', ')}]`);
      
      // Para cada ID a eliminar, mover sus asignaciones al ID que se mantiene
      for (const idAEliminar of idsAEliminar) {
        // Verificar asignaciones
        const asignaciones = await prisma.asignacionProfesor.findMany({
          where: { cursoId: idAEliminar }
        });
        
        if (asignaciones.length > 0) {
          console.log(`    - Moviendo ${asignaciones.length} asignaciones de ID ${idAEliminar} a ID ${idAMantener}`);
          
          // Verificar si ya existe una asignación similar en el curso destino
          for (const asignacion of asignaciones) {
            const existeAsignacion = await prisma.asignacionProfesor.findFirst({
              where: {
                profesorId: asignacion.profesorId,
                cursoId: idAMantener,
                seccionId: asignacion.seccionId,
                anioAcademico: asignacion.anioAcademico
              }
            });
            
            if (existeAsignacion) {
              console.log(`      - Eliminando asignación duplicada ID ${asignacion.id}`);
              await prisma.asignacionProfesor.delete({
                where: { id: asignacion.id }
              });
            } else {
              console.log(`      - Moviendo asignación ID ${asignacion.id}`);
              await prisma.asignacionProfesor.update({
                where: { id: asignacion.id },
                data: { cursoId: idAMantener }
              });
            }
          }
        }
        
        // Eliminar el curso duplicado
        console.log(`    - Eliminando curso ID ${idAEliminar}`);
        await prisma.curso.delete({
          where: { id: idAEliminar }
        });
      }
    }
    
    console.log('\n✅ Todos los duplicados han sido eliminados');
    
    // Verificar que no quedan duplicados
    const verificacion = await prisma.$queryRaw`
      SELECT nombre, COUNT(*) as count
      FROM Curso 
      GROUP BY nombre 
      HAVING COUNT(*) > 1
    `;
    
    if (verificacion.length === 0) {
      console.log('✅ Verificación: No quedan duplicados');
      
      // Ahora aplicar la restricción
      console.log('\nAplicando restricción de unicidad...');
      try {
        await prisma.$executeRaw`ALTER TABLE Curso ADD UNIQUE INDEX Curso_nombre_key (nombre)`;
        console.log('✅ Restricción de unicidad aplicada');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('✅ La restricción ya existe');
        } else {
          console.log('❌ Error al aplicar restricción:', error.message);
        }
      }
    } else {
      console.log('❌ Aún quedan duplicados:', verificacion);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

limpiarTodosDuplicados();