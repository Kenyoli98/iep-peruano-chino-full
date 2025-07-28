const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cargaMasivaSecciones() {
  try {
    console.log('🚀 Iniciando carga masiva de secciones...');
    
    const secciones = [
      // Inicial - 3 años
      { nombre: 'Sección A', nivel: 'Inicial', grado: 3 },
      { nombre: 'Sección B', nivel: 'Inicial', grado: 3 },
      { nombre: 'Sección C', nivel: 'Inicial', grado: 3 },
      
      // Inicial - 4 años
      { nombre: 'Sección A', nivel: 'Inicial', grado: 4 },
      { nombre: 'Sección B', nivel: 'Inicial', grado: 4 },
      { nombre: 'Sección C', nivel: 'Inicial', grado: 4 },
      { nombre: 'Sección D', nivel: 'Inicial', grado: 4 },
      
      // Inicial - 5 años
      { nombre: 'Sección A', nivel: 'Inicial', grado: 5 },
      { nombre: 'Sección B', nivel: 'Inicial', grado: 5 },
      { nombre: 'Sección C', nivel: 'Inicial', grado: 5 },
      { nombre: 'Sección D', nivel: 'Inicial', grado: 5 },
      { nombre: 'Sección E', nivel: 'Inicial', grado: 5 },
      
      // Primaria - 1° grado
      { nombre: 'Sección A', nivel: 'Primaria', grado: 1 },
      { nombre: 'Sección B', nivel: 'Primaria', grado: 1 },
      { nombre: 'Sección C', nivel: 'Primaria', grado: 1 },
      { nombre: 'Sección D', nivel: 'Primaria', grado: 1 },
      { nombre: 'Sección E', nivel: 'Primaria', grado: 1 },
      { nombre: 'Sección F', nivel: 'Primaria', grado: 1 },
      
      // Primaria - 2° grado
      { nombre: 'Sección A', nivel: 'Primaria', grado: 2 },
      { nombre: 'Sección B', nivel: 'Primaria', grado: 2 },
      { nombre: 'Sección C', nivel: 'Primaria', grado: 2 },
      { nombre: 'Sección D', nivel: 'Primaria', grado: 2 },
      { nombre: 'Sección E', nivel: 'Primaria', grado: 2 },
      { nombre: 'Sección F', nivel: 'Primaria', grado: 2 },
      
      // Primaria - 3° grado
      { nombre: 'Sección A', nivel: 'Primaria', grado: 3 },
      { nombre: 'Sección B', nivel: 'Primaria', grado: 3 },
      { nombre: 'Sección C', nivel: 'Primaria', grado: 3 },
      { nombre: 'Sección D', nivel: 'Primaria', grado: 3 },
      { nombre: 'Sección E', nivel: 'Primaria', grado: 3 },
      { nombre: 'Sección F', nivel: 'Primaria', grado: 3 },
      
      // Primaria - 4° grado
      { nombre: 'Sección A', nivel: 'Primaria', grado: 4 },
      { nombre: 'Sección B', nivel: 'Primaria', grado: 4 },
      { nombre: 'Sección C', nivel: 'Primaria', grado: 4 },
      { nombre: 'Sección D', nivel: 'Primaria', grado: 4 },
      { nombre: 'Sección E', nivel: 'Primaria', grado: 4 },
      { nombre: 'Sección F', nivel: 'Primaria', grado: 4 },
      
      // Primaria - 5° grado
      { nombre: 'Sección A', nivel: 'Primaria', grado: 5 },
      { nombre: 'Sección B', nivel: 'Primaria', grado: 5 },
      { nombre: 'Sección C', nivel: 'Primaria', grado: 5 },
      { nombre: 'Sección D', nivel: 'Primaria', grado: 5 },
      { nombre: 'Sección E', nivel: 'Primaria', grado: 5 },
      { nombre: 'Sección F', nivel: 'Primaria', grado: 5 },
      
      // Primaria - 6° grado
      { nombre: 'Sección A', nivel: 'Primaria', grado: 6 },
      { nombre: 'Sección B', nivel: 'Primaria', grado: 6 },
      { nombre: 'Sección C', nivel: 'Primaria', grado: 6 },
      { nombre: 'Sección D', nivel: 'Primaria', grado: 6 },
      { nombre: 'Sección E', nivel: 'Primaria', grado: 6 },
      { nombre: 'Sección F', nivel: 'Primaria', grado: 6 },
      
      // Secundaria - 1° grado
      { nombre: 'Sección A', nivel: 'Secundaria', grado: 1 },
      { nombre: 'Sección B', nivel: 'Secundaria', grado: 1 },
      { nombre: 'Sección C', nivel: 'Secundaria', grado: 1 },
      { nombre: 'Sección D', nivel: 'Secundaria', grado: 1 },
      { nombre: 'Sección E', nivel: 'Secundaria', grado: 1 },
      
      // Secundaria - 2° grado
      { nombre: 'Sección A', nivel: 'Secundaria', grado: 2 },
      { nombre: 'Sección B', nivel: 'Secundaria', grado: 2 },
      { nombre: 'Sección C', nivel: 'Secundaria', grado: 2 },
      { nombre: 'Sección D', nivel: 'Secundaria', grado: 2 },
      { nombre: 'Sección E', nivel: 'Secundaria', grado: 2 },
      
      // Secundaria - 3° grado
      { nombre: 'Sección A', nivel: 'Secundaria', grado: 3 },
      { nombre: 'Sección B', nivel: 'Secundaria', grado: 3 },
      { nombre: 'Sección C', nivel: 'Secundaria', grado: 3 },
      { nombre: 'Sección D', nivel: 'Secundaria', grado: 3 },
      { nombre: 'Sección E', nivel: 'Secundaria', grado: 3 },
      
      // Secundaria - 4° grado
      { nombre: 'Sección A', nivel: 'Secundaria', grado: 4 },
      { nombre: 'Sección B', nivel: 'Secundaria', grado: 4 },
      { nombre: 'Sección C', nivel: 'Secundaria', grado: 4 },
      { nombre: 'Sección D', nivel: 'Secundaria', grado: 4 },
      { nombre: 'Sección E', nivel: 'Secundaria', grado: 4 },
      
      // Secundaria - 5° grado
      { nombre: 'Sección A', nivel: 'Secundaria', grado: 5 },
      { nombre: 'Sección B', nivel: 'Secundaria', grado: 5 },
      { nombre: 'Sección C', nivel: 'Secundaria', grado: 5 },
      { nombre: 'Sección D', nivel: 'Secundaria', grado: 5 },
      { nombre: 'Sección E', nivel: 'Secundaria', grado: 5 }
    ];

    console.log(`📊 Total de secciones a crear: ${secciones.length}`);
    
    let creadas = 0;
    let duplicadas = 0;
    let errores = 0;

    for (const seccion of secciones) {
      try {
        // Verificar si ya existe
        const existente = await prisma.seccion.findFirst({
          where: {
            nombre: seccion.nombre,
            nivel: seccion.nivel,
            grado: seccion.grado
          }
        });

        if (existente) {
          console.log(`⚠️  Ya existe: ${seccion.nombre} - ${seccion.nivel} ${seccion.grado}°`);
          duplicadas++;
          continue;
        }

        // Crear la sección
        await prisma.seccion.create({
          data: seccion
        });
        
        console.log(`✅ Creada: ${seccion.nombre} - ${seccion.nivel} ${seccion.grado}°`);
        creadas++;
        
      } catch (error) {
        console.error(`❌ Error creando ${seccion.nombre} - ${seccion.nivel} ${seccion.grado}°:`, error.message);
        errores++;
      }
    }

    console.log('\n📈 RESUMEN DE CARGA MASIVA:');
    console.log(`✅ Secciones creadas: ${creadas}`);
    console.log(`⚠️  Secciones duplicadas (omitidas): ${duplicadas}`);
    console.log(`❌ Errores: ${errores}`);
    console.log(`📊 Total procesadas: ${creadas + duplicadas + errores}`);
    
    // Mostrar estadísticas por nivel
    const estadisticas = await prisma.seccion.groupBy({
      by: ['nivel'],
      _count: {
        id: true
      }
    });
    
    console.log('\n📊 ESTADÍSTICAS POR NIVEL:');
    for (const stat of estadisticas) {
      console.log(`${stat.nivel}: ${stat._count.id} secciones`);
    }
    
    console.log('\n🎉 Carga masiva completada exitosamente!');
    
  } catch (error) {
    console.error('💥 Error en la carga masiva:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
cargaMasivaSecciones();