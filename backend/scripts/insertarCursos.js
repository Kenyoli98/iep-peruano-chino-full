const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function insertarCursos() {
  const cursos = [
    // Nivel Inicial
    { nombre: 'Comunicación' },
    { nombre: 'Personal Social' },
    { nombre: 'Psicomotriz' },
    { nombre: 'Educación Artística' },

    // Nivel Primaria
    { nombre: 'Matemática' },
    { nombre: 'Ciencia y Tecnología' },
    { nombre: 'Educación Religiosa' },
    { nombre: 'Educación Física' },
    { nombre: 'Inglés' },
    { nombre: 'Computación' },

    // Nivel Secundaria
    { nombre: 'Ciencia, Tecnología y Ambiente (CTA)' },
    { nombre: 'Educación Cívica y Ciudadanía' },
    { nombre: 'Educación para el Trabajo (EPT)' },
    { nombre: 'Historia, Geografía y Economía (HGE)' },
    { nombre: 'Religión' },
    { nombre: 'TICs' }
  ];

  for (const curso of cursos) {
    await prisma.curso.create({ data: curso });
  }

  console.log('✅ Cursos insertados correctamente.');
}

insertarCursos()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
