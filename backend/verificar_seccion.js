const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarSeccion() {
  try {
    console.log('🔍 Verificando sección "A" de inicial grado 3...');
    
    const secciones = await prisma.seccion.findMany({
      where: {
        nombre: 'A',
        nivel: 'inicial',
        grado: 3
      }
    });
    
    console.log('📊 Secciones encontradas:', secciones.length);
    
    if (secciones.length > 0) {
      console.log('📋 Detalles de las secciones:');
      secciones.forEach((seccion, index) => {
        console.log(`${index + 1}. ID: ${seccion.id}, Nombre: ${seccion.nombre}, Nivel: ${seccion.nivel}, Grado: ${seccion.grado}`);
      });
    } else {
      console.log('✅ No se encontraron secciones con esos datos.');
    }
    
    // También verificar todas las secciones de inicial
    console.log('\n🔍 Todas las secciones de inicial:');
    const todasIniciales = await prisma.seccion.findMany({
      where: {
        nivel: 'inicial'
      },
      orderBy: [
        { grado: 'asc' },
        { nombre: 'asc' }
      ]
    });
    
    console.log(`📊 Total secciones de inicial: ${todasIniciales.length}`);
    todasIniciales.forEach((seccion, index) => {
      console.log(`${index + 1}. ID: ${seccion.id}, Nombre: ${seccion.nombre}, Nivel: ${seccion.nivel}, Grado: ${seccion.grado}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarSeccion();