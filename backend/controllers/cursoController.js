const prisma = require('../prismaClient');
async function eliminarCurso(req, res) {
  const { id } = req.params;

  try {
    await prisma.curso.delete({
      where: { id: Number(id) },
    });
    res.json({ mensaje: 'Curso eliminado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el curso.' });
  }
}

async function listarCursos(req, res) {
  const { nombre, page = 1, limit = 10 } = req.query;
  const filtros = {};
  if (nombre) filtros.nombre = { contains: nombre };

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const [total, cursos] = await Promise.all([
      prisma.curso.count({ where: filtros }),
      prisma.curso.findMany({
        where: filtros,
        skip,
        take: Number(limit),
        orderBy: [{ nombre: 'asc' }],
      }),
    ]);
    res.json({ total, cursos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los cursos.' });
  }
}

async function crearCurso(req, res) {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del curso es obligatorio.' });
  }

  try {
    const nuevoCurso = await prisma.curso.create({
      data: { 
        nombre: nombre.toUpperCase(),
        descripcion 
      },
    });
    res.status(201).json({ mensaje: 'Curso creado.', curso: nuevoCurso });
  } catch (error) {
    console.error('Error en crearCurso:', {
      code: error.code,
      message: error.message,
      meta: error.meta,
      stack: error.stack
    });
    
    if (error.code === 'P2002') {
      console.log('Error P2002 detectado - Violación de restricción única');
      if (error.meta?.target?.includes('nombre') || error.meta?.target?.includes('Curso_nombre_key')) {
        return res.status(400).json({ error: 'Ya existe un curso con ese nombre.' });
      }
    }
    
    return res.status(500).json({ error: 'Error al crear el curso.' });
  }
}

async function actualizarCurso(req, res) {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del curso es obligatorio.' });
  }

  try {
    const cursoActualizado = await prisma.curso.update({
      where: { id: Number(id) },
      data: { 
        nombre: nombre.toUpperCase(),
        descripcion 
      },
    });
    res.json({ mensaje: 'Curso actualizado.', curso: cursoActualizado });
  } catch (error) {
    console.error('Error en actualizarCurso:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('nombre')) {
      return res.status(400).json({ error: 'Ya existe un curso con ese nombre.' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }
    return res.status(500).json({ error: 'Error al actualizar el curso.' });
  }
}

async function crearCursosMasivo(req, res) {
  const cursos = req.body;

  if (!Array.isArray(cursos) || cursos.length === 0) {
    return res.status(400).json({ error: 'Debe enviar un arreglo de cursos.' });
  }

  try {
    const nuevosCursos = await prisma.curso.createMany({
      data: cursos.map((curso) => ({
        nombre: curso.nombre,
      })),
      skipDuplicates: true,
    });

    res.status(201).json({ mensaje: 'Cursos creados.', cantidad: nuevosCursos.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear cursos masivamente.' });
  }
}

async function cargarCursosDesdeCSV(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Archivo CSV no proporcionado.' });
  }

  try {
    console.log('📄 Procesando archivo CSV...');
    const contenido = req.file.buffer.toString('utf-8');
    const filas = contenido.trim().split('\n');
    
    if (filas.length <= 1) {
      return res.status(400).json({ error: 'El archivo CSV debe contener al menos una fila de datos además de la cabecera.' });
    }
    
    const headers = filas[0].split(',').map((h) => h.trim());
    console.log('📋 Cabeceras encontradas:', headers);
    
    if (!headers.includes('nombre')) {
      return res.status(400).json({ error: 'El archivo CSV debe contener una columna "nombre".' });
    }
    
    const cursos = filas.slice(1)
      .map((fila) => {
        const datos = fila.split(',').map((v) => v.trim());
        const curso = {};
        headers.forEach((h, idx) => {
          curso[h] = datos[idx] || '';
        });
        return curso;
      })
      .filter((curso) => curso.nombre && curso.nombre.trim() !== ''); // Filtrar cursos sin nombre
    
    console.log(`📊 Cursos válidos encontrados: ${cursos.length}`);
    
    if (cursos.length === 0) {
      return res.status(400).json({ error: 'No se encontraron cursos válidos en el archivo CSV. Asegúrate de que la columna "nombre" contenga datos.' });
    }

    // SQLite no soporta skipDuplicates, así que manejamos duplicados manualmente
    let cursosCreados = 0;
    const erroresDuplicados = [];
    
    for (const curso of cursos) {
      try {
        await prisma.curso.create({
          data: {
            nombre: curso.nombre.toUpperCase(),
            descripcion: curso.descripcion || null,
          },
        });
        cursosCreados++;
      } catch (error) {
        if (error.code === 'P2002') {
          // Error de duplicado, lo ignoramos
          erroresDuplicados.push(curso.nombre);
        } else {
          throw error;
        }
      }
    }
    
    const resultado = { count: cursosCreados };

    const totalCursos = cursos.length;
    const cursosNuevos = resultado.count;
    const cursosDuplicados = totalCursos - cursosNuevos;
    
    let mensaje = `Cursos procesados: ${totalCursos}. Creados: ${cursosNuevos}`;
    if (cursosDuplicados > 0) {
      mensaje += `. Duplicados omitidos: ${cursosDuplicados}`;
    }
    
    console.log('✅ Resultado:', mensaje);
    res.json({ mensaje, cantidad: resultado.count });
  } catch (error) {
    console.error('❌ Error al procesar CSV:', error);
    res.status(500).json({ error: 'Error al procesar el archivo CSV.' });
  }
}

module.exports = {
  listarCursos,
  crearCurso,
  actualizarCurso,
  crearCursosMasivo,
  cargarCursosDesdeCSV,
  eliminarCurso,
};
