const express = require('express');
const cors = require('cors');
const app = express();

// ✅ Middlewares Globales (SIEMPRE VAN PRIMERO)
app.use(cors());
app.use(express.json());

// ✅ Rutas (mantenemos tu orden actual)
app.use('/usuarios', require('./routes/usuarios'));
app.use('/matricula', require('./routes/matricula'));
app.use('/notas', require('./routes/nota'));
app.use('/pensiones', require('./routes/pension'));
app.use('/cursos', require('./routes/curso'));  // Aquí ya incluyes la carga masiva protegida
app.use('/asignaciones', require('./routes/asignacion'));
app.use('/secciones', require('./routes/seccion'));
app.use('/estadisticas', require('./routes/estadisticas'));

// ✅ Ruta Base (opcional)
app.get('/', (req, res) => {
  res.send('API del IEP Peruano Chino lista');
});

// ✅ Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor API corriendo en puerto ${PORT}`);
});
