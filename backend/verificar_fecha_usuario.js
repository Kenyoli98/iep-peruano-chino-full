const fs = require('fs');
const path = require('path');

const ruta = path.join(__dirname, 'controllers', 'usuariosController.js');

if (!fs.existsSync(ruta)) {
  console.error('❌ El archivo usuariosController.js no existe en la carpeta controllers.');
  process.exit(1);
}

const contenido = fs.readFileSync(ruta, 'utf-8');

if (contenido.includes('fechaNacimiento: new Date(fechaNacimientoConvertida)')) {
  console.log('✅ Cambio CORRECTO detectado: estás guardando la fecha como objeto Date.');
} else if (contenido.includes('fechaNacimiento: fechaNacimientoConvertida')) {
  console.log('❌ Error detectado: AÚN estás guardando la fecha como string ISO. Debes cambiarlo así:');
  console.log('   fechaNacimiento: new Date(fechaNacimientoConvertida)');
} else {
  console.log('⚠️ No se encontró ninguna asignación clara de fechaNacimiento en el archivo. Revisa manualmente.');
}
