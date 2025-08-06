const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function normalizarNiveles() {
  try {
    console.log('🔍 Verificando niveles actuales en la base de datos...');

    // Obtener todos los niveles únicos
    const nivelesUnicos = await prisma.seccion.findMany({
      select: { nivel: true },
      distinct: ['nivel']
    });

    console.log(
      'Niveles encontrados:',
      nivelesUnicos.map(n => `"${n.nivel}"`)
    );

    // Normalizar niveles a mayúsculas
    const actualizaciones = [];

    // Actualizar 'inicial' o 'Inicial' a 'INICIAL'
    const inicialResult = await prisma.seccion.updateMany({
      where: {
        nivel: {
          in: ['inicial', 'Inicial']
        }
      },
      data: {
        nivel: 'INICIAL'
      }
    });
    if (inicialResult.count > 0) {
      actualizaciones.push(
        `${inicialResult.count} secciones de nivel inicial normalizadas a INICIAL`
      );
    }

    // Actualizar 'primaria' o 'Primaria' a 'PRIMARIA'
    const primariaResult = await prisma.seccion.updateMany({
      where: {
        nivel: {
          in: ['primaria', 'Primaria']
        }
      },
      data: {
        nivel: 'PRIMARIA'
      }
    });
    if (primariaResult.count > 0) {
      actualizaciones.push(
        `${primariaResult.count} secciones de nivel primaria normalizadas a PRIMARIA`
      );
    }

    // Actualizar 'secundaria' o 'Secundaria' a 'SECUNDARIA'
    const secundariaResult = await prisma.seccion.updateMany({
      where: {
        nivel: {
          in: ['secundaria', 'Secundaria']
        }
      },
      data: {
        nivel: 'SECUNDARIA'
      }
    });
    if (secundariaResult.count > 0) {
      actualizaciones.push(
        `${secundariaResult.count} secciones de nivel secundaria normalizadas a SECUNDARIA`
      );
    }

    console.log('\n✅ Normalización completada:');
    if (actualizaciones.length > 0) {
      actualizaciones.forEach(update => console.log(`  - ${update}`));
    } else {
      console.log('  - No se requirieron actualizaciones');
    }

    // Verificar niveles después de la normalización
    const nivelesFinales = await prisma.seccion.findMany({
      select: { nivel: true },
      distinct: ['nivel']
    });

    console.log(
      '\n🔍 Niveles después de la normalización:',
      nivelesFinales.map(n => `"${n.nivel}"`)
    );

    // Buscar la sección específica que está causando el problema
    console.log('\n🔍 Buscando sección A de INICIAL grado 3...');
    const seccionProblematica = await prisma.seccion.findFirst({
      where: {
        nombre: 'A',
        nivel: 'INICIAL',
        grado: 3
      }
    });

    if (seccionProblematica) {
      console.log('✅ Sección encontrada:', seccionProblematica);
    } else {
      console.log('❌ No se encontró la sección A de INICIAL grado 3');
    }
  } catch (error) {
    console.error('❌ Error al normalizar niveles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

normalizarNiveles();
