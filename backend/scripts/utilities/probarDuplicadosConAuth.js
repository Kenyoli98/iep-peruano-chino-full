const http = require('http');
const jwt = require('jsonwebtoken');

// Generar token válido
function generarToken() {
  const payload = {
    id: 1,
    email: 'admin@test.com',
    rol: 'admin'
  };
  return jwt.sign(payload, 'CLAVE_SECRETA_SUPERSEGURA', { expiresIn: '1h' });
}

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsedBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', error => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function probarCreacionDuplicados() {
  console.log('🧪 Probando creación de cursos duplicados con autenticación...');

  const token = generarToken();
  console.log('🔑 Token generado para pruebas');

  try {
    // Primer intento - debería funcionar
    console.log('\n1. Creando curso "PRUEBA_DUPLICADO"...');
    const response1 = await makeRequest(
      'POST',
      '/cursos',
      {
        nombre: 'PRUEBA_DUPLICADO',
        descripcion: 'Curso de prueba para validar duplicados'
      },
      token
    );
    console.log(`Status: ${response1.status}`);

    if (response1.status === 201) {
      console.log('✅ Primer curso creado:', response1.data);
    } else {
      console.log('❌ Error al crear primer curso:', response1.data);
      return;
    }

    // Segundo intento - debería fallar con error 400
    console.log('\n2. Intentando crear curso duplicado "PRUEBA_DUPLICADO"...');
    const response2 = await makeRequest(
      'POST',
      '/cursos',
      {
        nombre: 'PRUEBA_DUPLICADO',
        descripcion: 'Curso duplicado'
      },
      token
    );

    console.log(`Status: ${response2.status}`);
    if (response2.status === 400) {
      console.log('✅ Error esperado - Status: 400');
      console.log('✅ Mensaje:', response2.data.error);
    } else if (response2.status === 500) {
      console.log('❌ ERROR 500 - Error interno del servidor:', response2.data);
    } else {
      console.log(
        '❌ ERROR: Se permitió crear curso duplicado:',
        response2.data
      );
    }

    // Limpiar - eliminar el curso de prueba
    console.log('\n3. Limpiando curso de prueba...');
    const cursosResponse = await makeRequest(
      'GET',
      '/cursos?nombre=PRUEBA_DUPLICADO',
      null,
      token
    );
    if (cursosResponse.data.cursos && cursosResponse.data.cursos.length > 0) {
      const cursoId = cursosResponse.data.cursos[0].id;
      const deleteResponse = await makeRequest(
        'DELETE',
        `/cursos/${cursoId}`,
        null,
        token
      );
      if (deleteResponse.status === 200) {
        console.log('✅ Curso de prueba eliminado');
      } else {
        console.log('⚠️ Error al eliminar curso:', deleteResponse.data);
      }
    }
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

probarCreacionDuplicados();
