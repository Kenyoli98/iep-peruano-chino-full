const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarDuplicados() {
  try {
    console.log('Verificando cursos duplicados...');
    
    // Obtener todos los cursos
    const cursos = await prisma.curso.findMany({
      orderBy: { id: 'asc' }
    });
    
    console.log(`Total de cursos: ${cursos.length}`);
    
    // Agrupar por nombre
    const cursosAgrupados = {};
    cursos.forEach(curso => {
      if (!cursosAgrupados[curso.nombre]) {
        cursosAgrupados[curso.nombre] = [];
      }
      cursosAgrupados[curso.nombre].push(curso);
    });
    
    // Mostrar duplicados
    let duplicadosEncontrados = false;
    for (const [nombre, gruposCursos] of Object.entries(cursosAgrupados)) {
      if (gruposCursos.length > 1) {
        duplicadosEncontrados = true;
        console.log(`\n❌ DUPLICADO: "${nombre}" (${gruposCursos.length} veces)`);
        gruposCursos.forEach(curso => {
          console.log(`   - ID: ${curso.id}, Descripción: ${curso.descripcion || 'Sin descripción'}`);
        });
      }
    }
    
    if (!duplicadosEncontrados) {
      console.log('\n✅ No se encontraron cursos duplicados.');
    }
    
    // Verificar restricción de unicidad
    console.log('\n--- Verificando restricción de unicidad ---');
    try {
      await prisma.curso.create({
        data: {
          nombre: 'TEST_DUPLICADO_TEMP',
          descripcion: 'Prueba 1'
        }
      });
      
      // Intentar crear otro con el mismo nombre
      await prisma.curso.create({
        data: {
          nombre: 'TEST_DUPLICADO_TEMP',
          descripcion: 'Prueba 2'
        }
      });
      
      console.log('❌ La restricción de unicidad NO está funcionando');
      
      // Limpiar cursos de prueba
      await prisma.curso.deleteMany({
        where: { nombre: 'TEST_DUPLICADO_TEMP' }
      });
      
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('✅ La restricción de unicidad está funcionando correctamente');
        
        // Limpiar el primer curso de prueba
        await prisma.curso.deleteMany({
          where: { nombre: 'TEST_DUPLICADO_TEMP' }
        });
      } else {
        console.log('❓ Error inesperado:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarDuplicados();