const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db'); // Ajusta la ruta si es necesario
const db = new Database(dbPath);

const usuarios = db.prepare('SELECT id, fechaNacimiento FROM Usuario').all();

for (const usuario of usuarios) {
  const fecha = new Date(usuario.fechaNacimiento);
  if (isNaN(fecha.getTime()) || fecha.getFullYear() < 1900) {
    console.log(`🛑 Eliminando usuario ID ${usuario.id} con fecha dañada: ${usuario.fechaNacimiento}`);
    db.prepare('DELETE FROM Usuario WHERE id = ?').run(usuario.id);
  }
}

console.log('✅ Limpieza completada.');
db.close();
