const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarSecciones() {
  try {
    console.log('🔍 Verificando secciones en la base de datos...');

    const secciones = await prisma.seccion.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`📊 Total de secciones encontradas: ${secciones.length}`);

    if (secciones.length > 0) {
      console.log('\n📋 Primeras 10 secciones:');
      secciones.slice(0, 10).forEach((seccion, index) => {
        console.log(
          `${index + 1}. ${seccion.nombre} - ${seccion.nivel} ${seccion.grado}°`
        );
      });

      // Estadísticas por nivel
      const estadisticas = secciones.reduce((acc, seccion) => {
        acc[seccion.nivel] = (acc[seccion.nivel] || 0) + 1;
        return acc;
      }, {});

      console.log('\n📈 Estadísticas por nivel:');
      Object.entries(estadisticas).forEach(([nivel, cantidad]) => {
        console.log(`${nivel}: ${cantidad} secciones`);
      });
    } else {
      console.log('❌ No se encontraron secciones en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error al verificar secciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarSecciones();
