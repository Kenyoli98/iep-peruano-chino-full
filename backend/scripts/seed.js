const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { generarCodigoUnico } = require('../utils/codigoEstudiante');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuarios administradores
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@iep.edu.pe' },
    update: {},
    create: {
      dni: '12345678',
      nombre: 'Administrador',
      apellido: 'Sistema',
      email: 'admin@iep.edu.pe',
      password: adminPassword,
      rol: 'ADMIN',
      telefono: '987654321',
      direccion: 'Av. Principal 123',
      fechaNacimiento: '1980-01-01',
      estadoRegistro: 'activo'
    }
  });

  // Crear profesores
  const profesorPassword = await bcrypt.hash('profesor123', 10);
  
  const profesor1 = await prisma.usuario.upsert({
    where: { email: 'maria.garcia@iep.edu.pe' },
    update: {},
    create: {
      dni: '87654321',
      nombre: 'María',
      apellido: 'García',
      email: 'maria.garcia@iep.edu.pe',
      password: profesorPassword,
      rol: 'PROFESOR',
      telefono: '987654322',
      direccion: 'Av. Secundaria 456',
      fechaNacimiento: '1985-05-15',
      estadoRegistro: 'activo'
    }
  });

  const profesor2 = await prisma.usuario.upsert({
    where: { email: 'carlos.lopez@iep.edu.pe' },
    update: {},
    create: {
      dni: '11223344',
      nombre: 'Carlos',
      apellido: 'López',
      email: 'carlos.lopez@iep.edu.pe',
      password: profesorPassword,
      rol: 'PROFESOR',
      telefono: '987654323',
      direccion: 'Jr. Educación 789',
      fechaNacimiento: '1982-09-20',
      estadoRegistro: 'activo'
    }
  });

  // Crear estudiantes pre-registrados
  const estudiantePassword = await bcrypt.hash('estudiante123', 10);
  
  // Estudiante completamente registrado
  const codigoEstudiante1 = await generarCodigoUnico('76543210', prisma);
  const estudiante1 = await prisma.usuario.upsert({
    where: { email: 'ana.rodriguez@estudiante.iep.edu.pe' },
    update: {},
    create: {
      dni: '76543210',
      nombre: 'Ana',
      apellido: 'Rodríguez',
      email: 'ana.rodriguez@estudiante.iep.edu.pe',
      password: estudiantePassword,
      rol: 'ESTUDIANTE',
      telefono: '987654324',
      direccion: 'Av. Estudiantes 321',
      fechaNacimiento: '2008-03-10',
      codigoEstudiante: codigoEstudiante1,
      estadoRegistro: 'activo',
      fechaPreRegistro: new Date(),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      nombreApoderado: 'Luis Rodríguez',
      telefonoApoderado: '987654325'
    }
  });

  // Estudiantes pre-registrados (pendientes)
  const codigoEstudiante2 = await generarCodigoUnico('65432109', prisma);
  const preRegistro1 = await prisma.usuario.upsert({
    where: { codigoEstudiante: codigoEstudiante2 },
    update: {},
    create: {
      dni: '65432109',
      nombre: 'Pedro',
      apellido: 'Martínez',
      rol: 'ESTUDIANTE',
      codigoEstudiante: codigoEstudiante2,
      estadoRegistro: 'PRE_REGISTRADO',
      fechaPreRegistro: new Date(),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      nombreApoderado: 'Carmen Martínez',
      telefonoApoderado: '987654326'
    }
  });

  const codigoEstudiante3 = await generarCodigoUnico('54321098', prisma);
  const preRegistro2 = await prisma.usuario.upsert({
    where: { codigoEstudiante: codigoEstudiante3 },
    update: {},
    create: {
      dni: '54321098',
      nombre: 'Sofía',
      apellido: 'Hernández',
      rol: 'ESTUDIANTE',
      codigoEstudiante: codigoEstudiante3,
      estadoRegistro: 'PRE_REGISTRADO',
      fechaPreRegistro: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
      fechaVencimiento: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      nombreApoderado: 'Roberto Hernández',
      telefonoApoderado: '987654327'
    }
  });

  // Crear cursos
  const matematicas = await prisma.curso.upsert({
    where: { nombre: 'Matemáticas' },
    update: {},
    create: {
      nombre: 'Matemáticas',
      descripcion: 'Curso de matemáticas básicas'
    }
  });

  const comunicacion = await prisma.curso.upsert({
    where: { nombre: 'Comunicación' },
    update: {},
    create: {
      nombre: 'Comunicación',
      descripcion: 'Curso de comunicación integral'
    }
  });

  const ciencias = await prisma.curso.upsert({
    where: { nombre: 'Ciencia y Tecnología' },
    update: {},
    create: {
      nombre: 'Ciencia y Tecnología',
      descripcion: 'Curso de ciencias naturales'
    }
  });

  // Crear secciones
  const seccion1A = await prisma.seccion.upsert({
    where: {
      nombre_grado_nivel: {
        nombre: 'A',
        grado: 1,
        nivel: 'Primaria'
      }
    },
    update: {},
    create: {
      nombre: 'A',
      grado: 1,
      nivel: 'Primaria'
    }
  });

  const seccion1B = await prisma.seccion.upsert({
    where: {
      nombre_grado_nivel: {
        nombre: 'B',
        grado: 1,
        nivel: 'Primaria'
      }
    },
    update: {},
    create: {
      nombre: 'B',
      grado: 1,
      nivel: 'Primaria'
    }
  });

  // Asignar profesores a cursos
  const asignacion1 = await prisma.asignacionProfesor.create({
    data: {
      profesorId: profesor1.id,
      cursoId: matematicas.id,
      seccionId: seccion1A.id,
      anioAcademico: 2025
    }
  });

  const asignacion2 = await prisma.asignacionProfesor.create({
    data: {
      profesorId: profesor2.id,
      cursoId: comunicacion.id,
      seccionId: seccion1A.id,
      anioAcademico: 2025
    }
  });

  // Matricular estudiante
  if (estudiante1) {
    await prisma.matricula.create({
      data: {
        alumnoId: estudiante1.id,
        grado: '1ro',
        seccion: 'A',
        anioAcademico: 2025,
        creadoPorId: admin.id
      }
    });
  }

  console.log('✅ Seed completado exitosamente!');
  console.log('\n📊 Datos creados:');
  console.log('👤 Usuarios:');
  console.log(`   - Admin: DNI 12345678, Email: admin@iep.edu.pe, Password: admin123`);
  console.log(`   - Profesor 1: DNI 87654321, Email: maria.garcia@iep.edu.pe, Password: profesor123`);
  console.log(`   - Profesor 2: DNI 11223344, Email: carlos.lopez@iep.edu.pe, Password: profesor123`);
  console.log(`   - Estudiante: DNI 76543210, Email: ana.rodriguez@estudiante.iep.edu.pe, Password: estudiante123`);
  console.log(`   - Pre-registro 1: DNI 65432109, Código: ${codigoEstudiante2}`);
  console.log(`   - Pre-registro 2: DNI 54321098, Código: ${codigoEstudiante3}`);
  console.log('\n📚 Cursos: Matemáticas, Comunicación, Ciencia y Tecnología');
  console.log('🏫 Secciones: 1ro A, 1ro B');
  console.log('\n🔗 Para acceder al sistema:');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Backend: http://localhost:3001');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });