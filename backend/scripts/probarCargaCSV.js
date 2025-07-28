const http = require('http');
const fs = require('fs');
const path = require('path');
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

// Crear archivo CSV de prueba
function crearCSVPrueba() {
  const csvContent = `nombre,descripcion
ROBOTICA EDUCATIVA 2024,Introduccion a la robotica para estudiantes
INTELIGENCIA ARTIFICIAL BASICA,Fundamentos de IA para principiantes
PROGRAMACION CREATIVA,Desarrollo de software con enfoque artistico`;
  
  fs.writeFileSync('test_cursos.csv', csvContent);
  console.log('📄 Archivo CSV de prueba creado');
}

// Función para hacer request multipart/form-data
function uploadCSV(token, filePath) {
  return new Promise((resolve, reject) => {
    const boundary = '----formdata-boundary-' + Math.random().toString(36);
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="csv"; filename="${fileName}"\r\n`;
    body += `Content-Type: text/csv\r\n\r\n`;
    body += fileContent;
    body += `\r\n--${boundary}--\r\n`;
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/cursos/cargar-csv',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        try {
          const data = JSON.parse(responseBody);
          resolve({ status: res.statusCode, data });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseBody });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(body);
    req.end();
  });
}

// Función para listar cursos
function listarCursos(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/cursos',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
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
          const data = JSON.parse(body);
          resolve({ status: res.statusCode, data });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

async function probarCargaCSV() {
  try {
    console.log('🧪 Probando carga masiva de CSV...');
    
    // Generar token
    const token = generarToken();
    console.log('🔑 Token generado para pruebas');
    
    // Crear archivo CSV
    crearCSVPrueba();
    
    // Listar cursos antes
    console.log('\n1. Listando cursos antes de la carga...');
    const cursosAntes = await listarCursos(token);
    console.log(`Status: ${cursosAntes.status}`);
    console.log(`Total cursos antes: ${cursosAntes.data.total || 0}`);
    
    // Cargar CSV
    console.log('\n2. Cargando archivo CSV...');
    const resultado = await uploadCSV(token, 'test_cursos.csv');
    console.log(`Status: ${resultado.status}`);
    console.log('Respuesta:', resultado.data);
    
    // Listar cursos después
    console.log('\n3. Listando cursos después de la carga...');
    const cursosDepues = await listarCursos(token);
    console.log(`Status: ${cursosDepues.status}`);
    console.log(`Total cursos después: ${cursosDepues.data.total || 0}`);
    
    // Mostrar diferencia
    const diferencia = (cursosDepues.data.total || 0) - (cursosAntes.data.total || 0);
    console.log(`\n📊 Diferencia: ${diferencia} cursos agregados`);
    
    // Limpiar archivo de prueba
    fs.unlinkSync('test_cursos.csv');
    console.log('\n🧹 Archivo de prueba eliminado');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

probarCargaCSV();