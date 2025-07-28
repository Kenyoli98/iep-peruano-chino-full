const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugSeccionDuplicada() {
  try {
    console.log('🔍 Investigando problema de sección duplicada...');
    
    // Buscar sección A de inicial grado 3 con diferentes variaciones
    console.log('\n1. Buscando sección "A" de inicial grado 3 (case sensitive):');
    const seccionA1 = await prisma.seccion.findMany({
      where: {
        nombre: 'A',
        nivel: 'inicial',
        grado: 3
      }
    });
    console.log(`   Encontradas: ${seccionA1.length}`);
    if (seccionA1.length > 0) {
      console.log('   Datos:', seccionA1);
    }
    
    console.log('\n2. Buscando sección "A" de Inicial grado 3 (nivel capitalizado):');
    const seccionA2 = await prisma.seccion.findMany({
      where: {
        nombre: 'A',
        nivel: 'Inicial',
        grado: 3
      }
    });
    console.log(`   Encontradas: ${seccionA2.length}`);
    if (seccionA2.length > 0) {
      console.log('   Datos:', seccionA2);
    }
    
    console.log('\n3. Buscando sección "A" de INICIAL grado 3 (nivel mayúsculas):');
    const seccionA3 = await prisma.seccion.findMany({
      where: {
        nombre: 'A',
        nivel: 'INICIAL',
        grado: 3
      }
    });
    console.log(`   Encontradas: ${seccionA3.length}`);
    if (seccionA3.length > 0) {
      console.log('   Datos:', seccionA3);
    }
    
    console.log('\n4. Buscando todas las secciones de grado 3 (cualquier nivel):');
    const todasGrado3 = await prisma.seccion.findMany({
      where: {
        grado: 3
      },
      orderBy: {
        nivel: 'asc'
      }
    });
    console.log(`   Total encontradas: ${todasGrado3.length}`);
    todasGrado3.forEach((seccion, index) => {
      console.log(`   ${index + 1}. ${seccion.nombre} - ${seccion.nivel} ${seccion.grado}° (ID: ${seccion.id})`);
    });
    
    console.log('\n5. Verificando si existe alguna sección "A" con nivel que contenga "inicial":');
    const seccionesConInicial = await prisma.seccion.findMany({
      where: {
        nombre: 'A',
        grado: 3,
        nivel: {
          contains: 'inicial',
          mode: 'insensitive'
        }
      }
    });
    console.log(`   Encontradas: ${seccionesConInicial.length}`);
    if (seccionesConInicial.length > 0) {
      console.log('   Datos:', seccionesConInicial);
    }
    
    console.log('\n6. Verificando todas las variaciones de nivel para entender el problema:');
    const nivelesUnicos = await prisma.seccion.findMany({
      select: {
        nivel: true
      },
      distinct: ['nivel']
    });
    console.log('   Niveles únicos en la base de datos:');
    nivelesUnicos.forEach((item, index) => {
      console.log(`   ${index + 1}. "${item.nivel}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSeccionDuplicada();