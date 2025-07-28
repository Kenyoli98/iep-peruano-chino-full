const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:3001';

// Función para generar token de admin válido
function generarTokenAdmin() {
  const payload = {
    id: 1,
    email: 'admin@test.com',
    rol: 'admin'
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'tu_clave_jwt_super_secreta_y_larga_para_produccion_2024_cambiar_en_prod', { expiresIn: '1h' });
}

async function testSeguridad() {
  console.log('🔒 INICIANDO TESTS DE SEGURIDAD\n');
  
  // Test 1: Intentar crear usuario sin token
  console.log('📋 Test 1: Crear usuario sin autenticación');
  try {
    const response = await axios.post(`${BASE_URL}/usuarios`, {
      nombre: 'Test',
      apellido: 'Usuario',
      email: 'test@test.com',
      password: '123456',
      rol: 'admin',
      fechaNacimiento: '1990-01-01'
    });
    console.log('❌ FALLO: Se pudo crear usuario sin token');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ ÉXITO: Endpoint protegido correctamente');
    } else {
      console.log('⚠️  Error inesperado:', error.response?.status);
    }
  }
  
  // Test 2: Intentar listar usuarios sin token
  console.log('\n📋 Test 2: Listar usuarios sin autenticación');
  try {
    const response = await axios.get(`${BASE_URL}/usuarios`);
    console.log('❌ FALLO: Se pudo listar usuarios sin token');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ ÉXITO: Endpoint protegido correctamente');
    } else {
      console.log('⚠️  Error inesperado:', error.response?.status);
    }
  }
  
  // Test 3: Crear usuario con token de admin
  console.log('\n📋 Test 3: Crear usuario con token de admin');
  try {
    const token = generarTokenAdmin();
    const response = await axios.post(`${BASE_URL}/usuarios`, {
      nombre: 'Admin',
      apellido: 'Test',
      email: 'admintest@test.com',
      password: '123456',
      rol: 'profesor',
      fechaNacimiento: '1985-01-01',
      sexo: 'M',
      nacionalidad: 'Peruana',
      dni: '12345678',
      direccion: 'Test 123',
      telefono: '987654321'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ ÉXITO: Usuario creado con token de admin');
  } catch (error) {
    console.log('❌ Error al crear usuario con token:', error.response?.data?.error || error.message);
  }
  
  // Test 4: Login funcional
  console.log('\n📋 Test 4: Login de usuario');
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'li@gmail.com',
      password: '123456'
    });
    if (response.data.success) {
      console.log('✅ ÉXITO: Login funcional');
    } else {
      console.log('⚠️  Login no exitoso');
    }
  } catch (error) {
    console.log('⚠️  Error en login:', error.response?.data?.error || error.message);
  }
  
  console.log('\n🔒 TESTS DE SEGURIDAD COMPLETADOS');
}

// Ejecutar tests
testSeguridad().catch(console.error);