const axios = require('axios');

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

async function crearUsuarioAdmin() {
  try {
    console.log('🚀 Creando usuario administrador...');

    const response = await axios.post(
      'http://localhost:3001/usuarios',
      adminData
    );

    if (response.status === 201) {
      console.log('✅ Usuario administrador creado exitosamente!');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Contraseña:', adminData.password);
      console.log('👤 Rol:', adminData.rol);
      console.log('\n📋 Datos del usuario creado:');
      console.log(JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    if (error.response) {
      console.error('❌ Error al crear usuario:', error.response.data);
      if (error.response.status === 409) {
        console.log('ℹ️  El usuario ya existe. Puedes usar las credenciales:');
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Contraseña:', adminData.password);
      }
    } else {
      console.error('❌ Error de conexión:', error.message);
      console.log(
        '⚠️  Asegúrate de que el servidor backend esté ejecutándose en http://localhost:3001'
      );
    }
  }
}

// Ejecutar la función
crearUsuarioAdmin();
