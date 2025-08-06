// Colocar en app.js
const express = require('express');
const app = express();

// Importar todas las rutas
const cursosRoutes = require('./routes/curso');
const asignacionesRoutes = require('./routes/asignacion');
const matriculasRoutes = require('./routes/matricula');
const notasRoutes = require('./routes/nota');
const pensionesRoutes = require('./routes/pension');
const seccionesRoutes = require('./routes/seccion');
const usuariosRoutes = require('./routes/usuarios');
const estadisticasRoutes = require('./routes/estadisticas');
const preRegistroRoutes = require('./routes/preRegistro');

// Middlewares globales
app.use(express.json());

// Registrar todas las rutas
app.use('/cursos', cursosRoutes);
app.use('/asignaciones', asignacionesRoutes);
app.use('/matriculas', matriculasRoutes);
app.use('/notas', notasRoutes);
app.use('/pensiones', pensionesRoutes);
app.use('/secciones', seccionesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/estadisticas', estadisticasRoutes);
app.use('/pre-registro', preRegistroRoutes);

module.exports = app;
