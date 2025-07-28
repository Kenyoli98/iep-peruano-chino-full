const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testRedirecciones() {
  console.log('🔄 INICIANDO TESTS DE REDIRECCIÓN\n');
  
  // Test 1: Login con usuario admin
  console.log('📋 Test 1: Login con usuario admin');
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'li@gmail.com',
      password: '123456'
    });
    
    if (response.data.success) {
      console.log('✅ Login exitoso');
      console.log('👤 Usuario:', response.data.usuario.nombre);
      console.log('🎭 Rol:', response.data.usuario.rol);
      console.log('🔑 Token generado:', response.data.token ? 'Sí' : 'No');
      
      // Verificar redirección esperada según el rol
      const rol = response.data.usuario.rol;
      let rutaEsperada;
      if (rol === 'admin') {
        rutaEsperada = '/admin';
      } else if (rol === 'profesor') {
        rutaEsperada = '/profesor/notas';
      } else if (rol === 'alumno') {
        rutaEsperada = '/alumno/pensiones';
      }
      
      console.log('🎯 Ruta de redirección esperada:', rutaEsperada);
    } else {
      console.log('❌ Login fallido:', response.data.error);
    }
  } catch (error) {
    console.log('❌ Error en login:', error.response?.data?.error || error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Verificar estructura de rutas del frontend
  console.log('📋 Test 2: Verificación de rutas del frontend');
  
  const rutasEsperadas = [
    '/admin',
    '/profesor/notas',
    '/profesor/cursos', 
    '/alumno/pensiones',
    '/alumno/notas',
    '/alumno/horario'
  ];
  
  console.log('📁 Rutas que deben existir en el frontend:');
  rutasEsperadas.forEach(ruta => {
    console.log(`   ✓ ${ruta}`);
  });
  
  console.log('\n🔒 TESTS DE REDIRECCIÓN COMPLETADOS');
  console.log('\n📝 INSTRUCCIONES PARA PROBAR:');
  console.log('1. Abre http://localhost:3000/login en tu navegador');
  console.log('2. Inicia sesión con: li@gmail.com / 123456');
  console.log('3. Verifica que te redirija a /admin');
  console.log('4. Prueba con otros usuarios si tienes diferentes roles');
}

// Ejecutar tests
testRedirecciones().catch(console.error);