const prisma = require('../prismaClient');
// Listar asignaciones
async function listarAsignaciones(req, res) {
  try {
    const asignaciones = await prisma.asignacionProfesor.findMany({
      include: {
        profesor: {
          select: { id: true, nombre: true, apellido: true, email: true },
        },
        curso: true,
        seccion: true,
      },
      orderBy: { anioAcademico: 'desc' },
    });
    res.json(asignaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las asignaciones.' });
  }
}

// Crear asignación
async function crearAsignacion(req, res) {
  const { profesorId, cursoId, seccionId, anioAcademico } = req.body;

  try {
    // Log para depuración
    console.log('Datos recibidos:', { profesorId, cursoId, seccionId, anioAcademico });

    // Validar que todos los campos estén presentes
  if (!profesorId || !cursoId || !seccionId || !anioAcademico) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

    // Convertir IDs y año académico a números
    const profesorIdNum = parseInt(profesorId);
    const cursoIdNum = parseInt(cursoId);
    const seccionIdNum = parseInt(seccionId);
    const anioAcademicoNum = parseInt(anioAcademico);

    // Validar que los IDs y el año sean números válidos
    if (isNaN(profesorIdNum) || isNaN(cursoIdNum) || isNaN(seccionIdNum) || isNaN(anioAcademicoNum)) {
      return res.status(400).json({ error: 'Los IDs y el año académico deben ser números válidos.' });
    }

    // Validar rango del año académico
    const currentYear = new Date().getFullYear();
    if (anioAcademicoNum < 2000 || anioAcademicoNum > currentYear + 1) {
      return res.status(400).json({ 
        error: `El año académico debe estar entre 2000 y ${currentYear + 1}.` 
      });
    }

    // Verificar que el profesor existe y tiene rol 'profesor'
    const profesor = await prisma.usuario.findUnique({
      where: { id: profesorIdNum },
    });
    if (!profesor || profesor.rol !== 'profesor') {
      return res.status(404).json({ error: 'Profesor no encontrado o no tiene el rol correcto.' });
    }

    // Verificar que el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: cursoIdNum },
    });
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }

    // Verificar que la sección existe
    const seccion = await prisma.seccion.findUnique({
      where: { id: seccionIdNum },
    });
    if (!seccion) {
      return res.status(404).json({ error: 'Sección no encontrada.' });
    }

    // Verificar si ya existe una asignación igual
    const asignacionExistente = await prisma.asignacionProfesor.findFirst({
      where: {
        profesorId: profesorIdNum,
        cursoId: cursoIdNum,
        seccionId: seccionIdNum,
        anioAcademico: anioAcademicoNum, // Usar el número directamente
      },
    });

    if (asignacionExistente) {
      return res.status(409).json({ 
        error: 'Ya existe una asignación para este profesor, curso y sección en el año académico especificado.' 
      });
    }

    // Crear la asignación
    const nuevaAsignacion = await prisma.asignacionProfesor.create({
      data: {
        profesorId: profesorIdNum,
        cursoId: cursoIdNum,
        seccionId: seccionIdNum,
        anioAcademico: anioAcademicoNum, // Usar el número directamente
      },
      include: {
        profesor: {
          select: { id: true, nombre: true, apellido: true, email: true },
        },
        curso: true,
        seccion: true,
      },
    });

    res.status(201).json({
      mensaje: 'Asignación creada exitosamente.',
      asignacion: nuevaAsignacion
    });
  } catch (error) {
    console.error('Error al crear asignación:', error);
    // Log detallado del error para depuración
    if (error.code) {
      console.error('Código de error Prisma:', error.code);
    }
    if (error.meta) {
      console.error('Metadatos del error:', error.meta);
    }
    res.status(500).json({ 
      error: 'Error al crear la asignación. Por favor, verifique los datos e intente nuevamente.',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Editar asignación
async function editarAsignacion(req, res) {
  const { id } = req.params;
  const { profesorId, cursoId, seccionId, anioAcademico } = req.body;

  if (!profesorId || !cursoId || !seccionId || !anioAcademico) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const asignacionActualizada = await prisma.asignacionProfesor.update({
      where: { id: parseInt(id) },
      data: { profesorId, cursoId, seccionId, anioAcademico },
    });
    res.json({ mensaje: 'Asignación actualizada.', asignacion: asignacionActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la asignación.' });
  }
}

// Eliminar asignación
async function eliminarAsignacion(req, res) {
  const { id } = req.params;

  try {
    await prisma.asignacionProfesor.delete({ where: { id: parseInt(id) } });
    res.json({ mensaje: 'Asignación eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la asignación.' });
  }
}

// Obtener asignaciones por profesor
async function obtenerAsignacionesPorProfesor(req, res) {
  const { profesorId } = req.params;

  try {
    const asignaciones = await prisma.asignacionProfesor.findMany({
      where: { profesorId: parseInt(profesorId) },
      include: {
        profesor: {
          select: { id: true, nombre: true, apellido: true, email: true },
        },
        curso: true,
        seccion: true,
        horarios: true,
      },
      orderBy: { anioAcademico: 'desc' },
    });
    res.json(asignaciones);
  } catch (error) {
    console.error('Error al obtener asignaciones del profesor:', error);
    res.status(500).json({ error: 'Error al obtener las asignaciones del profesor.' });
  }
}

// Agregar horario a una asignación
async function agregarHorario(req, res) {
  const { asignacionId } = req.params;
  const { dia, horaInicio, horaFin } = req.body;

  try {
    // Validar campos requeridos
    if (!dia || !horaInicio || !horaFin) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Verificar que la asignación existe
    const asignacion = await prisma.asignacionProfesor.findUnique({
      where: { id: parseInt(asignacionId) }
    });

    if (!asignacion) {
      return res.status(404).json({ error: 'Asignación no encontrada.' });
    }

    // Crear el horario en la base de datos
    const nuevoHorario = await prisma.horario.create({
      data: {
        asignacionId: parseInt(asignacionId),
        dia,
        horaInicio,
        horaFin
      }
    });

    res.status(201).json({ 
      mensaje: 'Horario agregado exitosamente.',
      horario: nuevoHorario
    });
  } catch (error) {
    console.error('Error al agregar horario:', error);
    res.status(500).json({ error: 'Error al agregar el horario.' });
  }
}

// Eliminar horario de una asignación
async function eliminarHorario(req, res) {
  const { asignacionId, horarioId } = req.params;

  try {
    // Verificar que el horario existe y pertenece a la asignación
    const horario = await prisma.horario.findFirst({
      where: {
        id: parseInt(horarioId),
        asignacionId: parseInt(asignacionId)
      }
    });

    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado.' });
    }

    // Eliminar el horario
    await prisma.horario.delete({
      where: { id: parseInt(horarioId) }
    });

    res.json({ mensaje: 'Horario eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ error: 'Error al eliminar el horario.' });
  }
}

module.exports = {
  listarAsignaciones,
  crearAsignacion,
  editarAsignacion,
  eliminarAsignacion,
  obtenerAsignacionesPorProfesor,
  agregarHorario,
  eliminarHorario,
};
