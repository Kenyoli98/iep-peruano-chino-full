const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:3001';

// Función para generar token de admin válido
function generarTokenAdmin() {
  const payload = {
    id: 1,
    email: 'li@gmail.com',
    rol: 'admin'
  };
  return jwt.sign(payload, 'CLAVE_SECRETA_SUPERSEGURA', { expiresIn: '24h' });
}

async function testLogoutIssue() {
  console.log('🔍 INVESTIGANDO PROBLEMA DE LOGOUT AUTOMÁTICO\n');
  
  // Test 1: Verificar login y token
  console.log('📋 Test 1: Login y verificación de token');
  try {
    const loginResponse = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'li@gmail.com',
      password: '123456'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login exitoso');
      console.log('📄 Token generado:', loginResponse.data.token.substring(0, 50) + '...');
      console.log('👤 Rol:', loginResponse.data.rol);
      console.log('📅 Fecha login:', new Date().toISOString());
      
      // Test 2: Verificar validez del token
      console.log('\n📋 Test 2: Verificación de validez del token');
      try {
        const decoded = jwt.verify(loginResponse.data.token, 'CLAVE_SECRETA_SUPERSEGURA');
        console.log('✅ Token válido');
        console.log('📄 Payload decodificado:', decoded);
        console.log('⏰ Expira en:', new Date(decoded.exp * 1000).toISOString());
      } catch (tokenError) {
        console.log('❌ Token inválido:', tokenError.message);
      }
      
      // Test 3: Probar endpoint protegido
      console.log('\n📋 Test 3: Acceso a endpoint protegido');
      try {
        const protectedResponse = await axios.get(`${BASE_URL}/usuarios`, {
          headers: {
            'Authorization': `Bearer ${loginResponse.data.token}`
          }
        });
        console.log('✅ Acceso a endpoint protegido exitoso');
        console.log('📊 Usuarios encontrados:', protectedResponse.data.length);
      } catch (protectedError) {
        console.log('❌ Error en endpoint protegido:', protectedError.response?.data || protectedError.message);
      }
      
    } else {
      console.log('❌ Login fallido:', loginResponse.data);
    }
  } catch (loginError) {
    console.log('❌ Error en login:', loginError.response?.data || loginError.message);
  }
  
  // Test 4: Verificar configuración del servidor
  console.log('\n📋 Test 4: Verificación de configuración del servidor');
  try {
    const healthResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Servidor respondiendo correctamente');
  } catch (healthError) {
    console.log('❌ Error de conectividad:', healthError.message);
  }
  
  console.log('\n🏁 TESTS COMPLETADOS');
  console.log('\n📝 RECOMENDACIONES:');
  console.log('1. Verificar que el frontend esté usando el token correcto');
  console.log('2. Revisar la configuración del hook useInactivityLogout');
  console.log('3. Verificar que no haya conflictos entre localStorage y sessionStorage');
  console.log('4. Comprobar que el hook useAuth no esté causando redirects innecesarios');
}

testLogoutIssue().catch(console.error);