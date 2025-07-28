const http = require('http');

function makeRequest(method, path, data = null) {
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

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
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

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function probarCreacionDuplicados() {
  console.log('🧪 Probando creación de cursos duplicados...');
  
  try {
    // Primer intento - debería funcionar
    console.log('\n1. Creando curso "PRUEBA_DUPLICADO"...');
    const response1 = await makeRequest('POST', '/cursos', {
      nombre: 'PRUEBA_DUPLICADO',
      descripcion: 'Curso de prueba para validar duplicados'
    });
    console.log(`Status: ${response1.status}`);
    console.log('✅ Primer curso creado:', response1.data);
    
    // Segundo intento - debería fallar con error 400
    console.log('\n2. Intentando crear curso duplicado "PRUEBA_DUPLICADO"...');
    const response2 = await makeRequest('POST', '/cursos', {
      nombre: 'PRUEBA_DUPLICADO',
      descripcion: 'Curso duplicado'
    });
    
    console.log(`Status: ${response2.status}`);
    if (response2.status === 400) {
      console.log('✅ Error esperado - Status: 400');
      console.log('✅ Mensaje:', response2.data.error);
    } else {
      console.log('❌ ERROR: Se permitió crear curso duplicado:', response2.data);
    }
    
    // Limpiar - eliminar el curso de prueba
    console.log('\n3. Limpiando curso de prueba...');
    const cursosResponse = await makeRequest('GET', '/cursos?nombre=PRUEBA_DUPLICADO');
    if (cursosResponse.data.cursos && cursosResponse.data.cursos.length > 0) {
      const cursoId = cursosResponse.data.cursos[0].id;
      await makeRequest('DELETE', `/cursos/${cursoId}`);
      console.log('✅ Curso de prueba eliminado');
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

probarCreacionDuplicados();