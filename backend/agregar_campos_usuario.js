const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

try {
  db.prepare(`ALTER TABLE Usuario ADD COLUMN fechaNacimiento TEXT`).run();
  db.prepare(`ALTER TABLE Usuario ADD COLUMN sexo TEXT`).run();
  db.prepare(`ALTER TABLE Usuario ADD COLUMN nacionalidad TEXT`).run();
  db.prepare(`ALTER TABLE Usuario ADD COLUMN dni TEXT`).run();
  db.prepare(`ALTER TABLE Usuario ADD COLUMN direccion TEXT`).run();
  db.prepare(`ALTER TABLE Usuario ADD COLUMN telefono TEXT`).run();
  db.prepare(`ALTER TABLE Usuario ADD COLUMN nombreApoderado TEXT`).run();
  db.prepare(`ALTER TABLE Usuario ADD COLUMN telefonoApoderado TEXT`).run();

  console.log('✅ Campos agregados correctamente a la tabla Usuario.');
} catch (err) {
  console.error('❌ Error:', err.message);
}

db.close();
