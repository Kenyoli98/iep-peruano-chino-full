const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function limpiarRegistros() {
  try {
    console.log('🔍 Verificando estado de la base de datos...');
    
    // Verificar todas las secciones
    const todasSecciones = await prisma.seccion.findMany({
      orderBy: [{ nivel: 'asc' }, { grado: 'asc' }, { nombre: 'asc' }]
    });
    
    console.log('\n📋 Todas las secciones en la base de datos:');
    console.table(todasSecciones);
    
    // Buscar específicamente secciones de inicial grado 3
    const seccionesInicial3 = await prisma.seccion.findMany({
      where: {
        nivel: 'inicial',
        grado: 3
      }
    });
    
    console.log('\n🎯 Secciones de Inicial Grado 3:');
    console.table(seccionesInicial3);
    
    // Verificar todas las asignaciones
    const todasAsignaciones = await prisma.asignacionProfesor.findMany({
      include: {
        seccion: true,
        profesor: true
      }
    });
    
    console.log('\n📋 Todas las asignaciones:');
    console.table(todasAsignaciones.map(a => ({
      id: a.id,
      profesorId: a.profesorId,
      seccionId: a.seccionId,
      seccionNombre: a.seccion?.nombre || 'SIN SECCIÓN',
      profesorNombre: a.profesor?.nombre || 'SIN PROFESOR'
    })));
    
    // Verificar todas las matrículas
    const todasMatriculas = await prisma.matricula.findMany({
      include: {
        alumno: true
      }
    });
    
    console.log('\n📋 Todas las matrículas:');
    console.table(todasMatriculas.map(m => ({
      id: m.id,
      alumnoId: m.alumnoId,
      grado: m.grado,
      seccion: m.seccion,
      anioAcademico: m.anioAcademico,
      alumnoNombre: m.alumno?.nombre || 'SIN ALUMNO'
    })));
    
    // Buscar asignaciones con secciones que no existen
    const asignacionesProblematicas = todasAsignaciones.filter(a => !a.seccion);
    
    if (asignacionesProblematicas.length > 0) {
      console.log('\n🧹 Limpiando asignaciones problemáticas...');
      for (const asignacion of asignacionesProblematicas) {
        await prisma.asignacionProfesor.delete({
          where: { id: asignacion.id }
        });
      }
      console.log(`✅ ${asignacionesProblematicas.length} asignaciones problemáticas eliminadas`);
    } else {
      console.log('\n✅ No se encontraron asignaciones problemáticas');
    }
    
    // Las matrículas no tienen relación directa con secciones en este esquema
    console.log('\n📝 Nota: Las matrículas usan campos de texto para grado y sección, no relaciones FK');
    
    console.log('\n✅ Verificación y limpieza completada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

limpiarRegistros();