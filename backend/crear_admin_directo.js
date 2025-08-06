const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

// Configuración del usuario administrador
const adminData = {
  nombre: 'Admin',
  apellido: 'Sistema',
  email: 'li@gmail.com',
  password: '123456',
  rol: 'admin',
  fechaNacimiento: '1990-01-01',
  sexo: 'M',
  nacionalidad: 'Peruana',
  dni: '12345678',
  direccion: 'Dirección del administrador',
  telefono: '999999999'
};

async function crearUsuarioAdminDirecto() {
  try {
    console.log('🚀 Creando usuario administrador directamente en la base de datos...');

    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: adminData.email }
    });

    if (usuarioExistente) {
      console.log('ℹ️  El usuario administrador ya existe:');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Contraseña:', adminData.password);
      console.log('👤 Rol:', usuarioExistente.rol);
      console.log('🆔 DNI:', usuarioExistente.dni);
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Crear el usuario administrador
    const nuevoAdmin = await prisma.usuario.create({
      data: {
        nombre: adminData.nombre,
        apellido: adminData.apellido,
        email: adminData.email,
        password: hashedPassword,
        rol: adminData.rol,
        fechaNacimiento: new Date(adminData.fechaNacimiento).toISOString(),
        sexo: adminData.sexo,
        nacionalidad: adminData.nacionalidad,
        dni: adminData.dni,
        direccion: adminData.direccion,
        telefono: adminData.telefono
      }
    });

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Contraseña:', adminData.password);
    console.log('👤 Rol:', nuevoAdmin.rol);
    console.log('🆔 DNI:', nuevoAdmin.dni);
    console.log('\n📋 Datos del usuario creado:');
    console.log({
      id: nuevoAdmin.id,
      nombre: nuevoAdmin.nombre,
      apellido: nuevoAdmin.apellido,
      email: nuevoAdmin.email,
      rol: nuevoAdmin.rol,
      dni: nuevoAdmin.dni
    });

  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    if (error.code === 'P2002') {
      console.log('ℹ️  El usuario ya existe con ese email o DNI.');
      console.log('📧 Email para acceder:', adminData.email);
      console.log('🔑 Contraseña:', adminData.password);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
crearUsuarioAdminDirecto();