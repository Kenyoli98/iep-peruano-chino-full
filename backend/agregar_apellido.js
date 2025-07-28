const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

try {
  db.prepare(`ALTER TABLE Usuario ADD COLUMN apellido TEXT DEFAULT 'SIN APELLIDO'`).run();
  console.log('✅ Campo "apellido" agregado correctamente.');
} catch (err) {
  console.error('❌ Error:', err.message);
}

db.close();
