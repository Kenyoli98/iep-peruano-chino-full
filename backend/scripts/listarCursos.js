const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listarCursos() {
  try {
    const cursos = await prisma.curso.findMany({
      orderBy: { nombre: 'asc' }
    });
    
    console.log(`\n📚 Total de cursos en la base de datos: ${cursos.length}\n`);
    
    cursos.forEach((curso, index) => {
      console.log(`${index + 1}. ${curso.nombre}`);
    });
    
    console.log('\n');
  } catch (error) {
    console.error('Error al listar cursos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listarCursos();