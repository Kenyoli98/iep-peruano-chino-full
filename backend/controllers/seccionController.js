// controllers/seccionController.js
const prisma = require('../prismaClient');
const fs = require('fs');
const csv = require('csv-parser');
const { Readable } = require('stream');
async function importarSecciones(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No se envió ningún archivo CSV.' });
  }

  const bufferStream = new Readable();
  bufferStream.push(req.file.buffer);
  bufferStream.push(null);

  const secciones = [];
  bufferStream
    .pipe(csv())
    .on('data', (row) => {
      secciones.push({
        nombre: row.nombre.toUpperCase(),
        nivel: row.nivel,
        grado: Number(row.grado),
      });
    })
    .on('end', async () => {
      try {
        await prisma.seccion.createMany({ data: secciones, skipDuplicates: true });
        res.json({ message: 'Secciones importadas correctamente.', cantidad: secciones.length });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al importar las secciones.' });
      }
    });
}
// Listar secciones (todos pueden)
async function listarSecciones(req, res) {
  const { nombre, nivel,grado, page = 1, limit = 20 } = req.query;
  const filtros = {};
if (nombre) filtros.nombre = { contains: nombre };
if (nivel) filtros.nivel = nivel;
if (grado !== undefined && grado !== '' && !isNaN(Number(grado))) {
  filtros.grado = Number(grado);
}
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  try {
    const [secciones, total] = await Promise.all([
      prisma.seccion.findMany({
        where: filtros,
        skip,
        take,
        orderBy: [{ nivel: 'asc' }, { grado: 'asc' }, { nombre: 'asc' }]
      }),
      prisma.seccion.count({ where: filtros })
    ]);

    res.json({ secciones, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las secciones.' });
  }
}


// Crear sección (solo admin)
async function crearSeccion(req, res) {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permisos para crear secciones.' });
  }

  const { nombre, nivel, grado } = req.body;
  
  // Validación de tipos de datos
  if (typeof nombre !== 'string' || typeof nivel !== 'string') {
    return res.status(400).json({ error: 'El nombre y nivel deben ser de tipo string.' });
  }
  
  if (!nombre || !nivel || !grado) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Convertir grado a número si viene como string
    let gradoNumero;
    if (typeof grado === 'string') {
      // Si es string, intentar convertir a número
      const gradoParseado = parseInt(grado, 10);
      if (isNaN(gradoParseado)) {
        return res.status(400).json({ error: 'El grado debe ser un número válido.' });
      }
      gradoNumero = gradoParseado;
    } else {
      gradoNumero = Number(grado);
    }
    
    // Convertir el nombre a mayúsculas
    const nombreMayuscula = nombre.toUpperCase();
    
    const existe = await prisma.seccion.findFirst({
      where: { nombre: nombreMayuscula, nivel, grado: gradoNumero }
    });

    if (existe) {
      return res.status(409).json({ error: 'Ya existe esa sección para ese grado y nivel.' });
    }

    const nuevaSeccion = await prisma.seccion.create({ data: { nombre: nombreMayuscula, nivel, grado: gradoNumero } });
    res.status(201).json(nuevaSeccion);
  } catch (error) {
    console.error('Error al crear sección:', error.message);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'Ya existe una sección con esos datos. Verifique nombre, nivel y grado.' 
      });
    }
    
    res.status(500).json({ error: 'Error interno al crear la sección.' });
  }
}

// Editar sección (solo admin)
async function editarSeccion(req, res) {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permisos para editar secciones.' });
  }

  const { id } = req.params;
  const { nombre, nivel, grado } = req.body;

  if (!nombre || !nivel || !grado) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Convertir grado a número si viene como string
    let gradoNumero;
    if (typeof grado === 'string') {
      // Si es string, intentar convertir a número
      const gradoParseado = parseInt(grado, 10);
      if (isNaN(gradoParseado)) {
        return res.status(400).json({ error: 'El grado debe ser un número válido.' });
      }
      gradoNumero = gradoParseado;
    } else {
      gradoNumero = Number(grado);
    }
    
    // Convertir el nombre a mayúsculas
    const nombreMayuscula = nombre.toUpperCase();
    
    const existe = await prisma.seccion.findFirst({
      where: {
        nombre: nombreMayuscula,
        nivel,
        grado: gradoNumero,
        NOT: { id: Number(id) }
      }
    });

    if (existe) {
      return res.status(409).json({ error: 'Ya existe esa sección para ese grado y nivel.' });
    }

    const seccionActualizada = await prisma.seccion.update({
      where: { id: Number(id) },
      data: { nombre: nombreMayuscula, nivel, grado: gradoNumero }
    });

    res.json(seccionActualizada);
  } catch (error) {
    console.error('Error al editar sección:', error);
    res.status(500).json({ error: 'Error al editar la sección.' });
  }
}

// Eliminar sección (solo admin)
async function eliminarSeccion(req, res) {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permisos para eliminar secciones.' });
  }

  const { id } = req.params;

  try {
    // Verificar si la sección tiene asignaciones
    const asignaciones = await prisma.asignacionProfesor.findMany({
      where: { seccionId: Number(id) }
    });

    if (asignaciones.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la sección porque tiene asignaciones de profesores asociadas. Primero elimine las asignaciones.' 
      });
    }

    await prisma.seccion.delete({ where: { id: Number(id) } });
    res.json({ message: 'Sección eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar sección:', error);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'No se puede eliminar la sección porque tiene datos relacionados. Verifique que no tenga asignaciones, matrículas u otros registros asociados.' 
      });
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'La sección no existe.' });
    }
    
    res.status(500).json({ error: 'Error interno al eliminar la sección.' });
  }
}

module.exports = {
  listarSecciones,
  crearSeccion,
  editarSeccion,
  eliminarSeccion,
  importarSecciones   // ✅ Agrega aquí la función CSV
};

