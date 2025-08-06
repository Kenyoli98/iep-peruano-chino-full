const prisma = require('../prismaClient');
// Listar asignaciones
async function listarAsignaciones(req, res) {
  try {
    const asignaciones = await prisma.asignacionProfesor.findMany({
      include: {
        profesor: {
          select: { id: true, nombre: true, apellido: true, email: true }
        },
        curso: true,
        seccion: true
      },
      orderBy: { anioAcademico: 'desc' }
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
    console.log('Datos recibidos:', {
      profesorId,
      cursoId,
      seccionId,
      anioAcademico
    });

    // Validar que todos los campos estén presentes
    if (!profesorId || !cursoId || !seccionId || !anioAcademico) {
      return res
        .status(400)
        .json({ error: 'Todos los campos son obligatorios.' });
    }

    // Convertir IDs y año académico a números
    const profesorIdNum = parseInt(profesorId);
    const cursoIdNum = parseInt(cursoId);
    const seccionIdNum = parseInt(seccionId);
    const anioAcademicoNum = parseInt(anioAcademico);

    // Validar que los IDs y el año sean números válidos
    if (
      isNaN(profesorIdNum) ||
      isNaN(cursoIdNum) ||
      isNaN(seccionIdNum) ||
      isNaN(anioAcademicoNum)
    ) {
      return res
        .status(400)
        .json({
          error: 'Los IDs y el año académico deben ser números válidos.'
        });
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
      where: { id: profesorIdNum }
    });
    if (!profesor || profesor.rol?.toLowerCase() !== 'profesor') {
      return res
        .status(404)
        .json({ error: 'Profesor no encontrado o no tiene el rol correcto.' });
    }

    // Verificar que el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: cursoIdNum }
    });
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }

    // Verificar que la sección existe
    const seccion = await prisma.seccion.findUnique({
      where: { id: seccionIdNum }
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
        anioAcademico: anioAcademicoNum // Usar el número directamente
      }
    });

    if (asignacionExistente) {
      return res.status(409).json({
        error:
          'Ya existe una asignación para este profesor, curso y sección en el año académico especificado.'
      });
    }

    // Crear la asignación
    const nuevaAsignacion = await prisma.asignacionProfesor.create({
      data: {
        profesorId: profesorIdNum,
        cursoId: cursoIdNum,
        seccionId: seccionIdNum,
        anioAcademico: anioAcademicoNum // Usar el número directamente
      },
      include: {
        profesor: {
          select: { id: true, nombre: true, apellido: true, email: true }
        },
        curso: true,
        seccion: true
      }
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
      error:
        'Error al crear la asignación. Por favor, verifique los datos e intente nuevamente.',
      detalles:
        process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Editar asignación
async function editarAsignacion(req, res) {
  const { id } = req.params;
  const { profesorId, cursoId, seccionId, anioAcademico } = req.body;

  if (!profesorId || !cursoId || !seccionId || !anioAcademico) {
    return res
      .status(400)
      .json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const asignacionActualizada = await prisma.asignacionProfesor.update({
      where: { id: parseInt(id) },
      data: { profesorId, cursoId, seccionId, anioAcademico }
    });
    res.json({
      mensaje: 'Asignación actualizada.',
      asignacion: asignacionActualizada
    });
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
          select: { id: true, nombre: true, apellido: true, email: true }
        },
        curso: true,
        seccion: true,
        horarios: true
      },
      orderBy: { anioAcademico: 'desc' }
    });
    res.json(asignaciones);
  } catch (error) {
    console.error('Error al obtener asignaciones del profesor:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener las asignaciones del profesor.' });
  }
}

// Función auxiliar para convertir hora a minutos
function horaAMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

// Función auxiliar para validar formato de hora
function validarFormatoHora(hora) {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(hora);
}

// Función auxiliar para validar rango de horario escolar
function validarRangoHorarioEscolar(horaInicio, horaFin) {
  const inicioMinutos = horaAMinutos(horaInicio);
  const finMinutos = horaAMinutos(horaFin);
  const limiteInicio = horaAMinutos('07:30'); // 7:30 AM
  const limiteFin = horaAMinutos('14:00'); // 2:00 PM

  return (
    inicioMinutos >= limiteInicio &&
    finMinutos <= limiteFin &&
    inicioMinutos < finMinutos
  );
}

// Función auxiliar para verificar solapamiento de horarios
function verificarSolapamiento(inicio1, fin1, inicio2, fin2) {
  const inicio1Min = horaAMinutos(inicio1);
  const fin1Min = horaAMinutos(fin1);
  const inicio2Min = horaAMinutos(inicio2);
  const fin2Min = horaAMinutos(fin2);

  return inicio1Min < fin2Min && inicio2Min < fin1Min;
}

// Agregar horario a una asignación
async function agregarHorario(req, res) {
  const { asignacionId } = req.params;
  const { dia, horaInicio, horaFin } = req.body;

  try {
    // Validar campos requeridos
    if (!dia || !horaInicio || !horaFin) {
      return res
        .status(400)
        .json({ error: 'Todos los campos son obligatorios.' });
    }

    // Validar formato de horas
    if (!validarFormatoHora(horaInicio) || !validarFormatoHora(horaFin)) {
      return res
        .status(400)
        .json({ error: 'Formato de hora inválido. Use HH:MM (24 horas).' });
    }

    // Validar que la hora de inicio sea menor que la hora de fin
    if (horaAMinutos(horaInicio) >= horaAMinutos(horaFin)) {
      return res
        .status(400)
        .json({
          error: 'La hora de inicio debe ser menor que la hora de fin.'
        });
    }

    // Validar rango de horario escolar (7:30 AM - 2:00 PM)
    if (!validarRangoHorarioEscolar(horaInicio, horaFin)) {
      return res.status(400).json({
        error:
          'El horario debe estar dentro del rango escolar (7:30 AM - 2:00 PM).'
      });
    }

    // Validar duración mínima (30 minutos)
    const duracionMinutos = horaAMinutos(horaFin) - horaAMinutos(horaInicio);
    if (duracionMinutos < 30) {
      return res
        .status(400)
        .json({
          error: 'La duración mínima de una clase debe ser de 30 minutos.'
        });
    }

    // Validar días de la semana válidos
    const diasValidos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    if (!diasValidos.includes(dia)) {
      return res.status(400).json({ error: 'Día de la semana inválido.' });
    }

    // Verificar que la asignación existe
    const asignacion = await prisma.asignacionProfesor.findUnique({
      where: { id: parseInt(asignacionId) },
      include: { curso: true, profesor: true, seccion: true }
    });

    if (!asignacion) {
      return res.status(404).json({ error: 'Asignación no encontrada.' });
    }

    // Verificar si ya existe un horario exacto para el mismo curso
    const horarioExacto = await prisma.horario.findFirst({
      where: {
        dia: dia,
        horaInicio: horaInicio,
        horaFin: horaFin,
        asignacion: {
          cursoId: asignacion.cursoId
        }
      },
      include: {
        asignacion: {
          include: {
            curso: true,
            seccion: true
          }
        }
      }
    });

    if (horarioExacto) {
      return res.status(409).json({
        error: `Ya existe un horario idéntico para el curso "${asignacion.curso.nombre}" el día ${dia} de ${horaInicio} a ${horaFin} en la sección ${horarioExacto.asignacion.seccion.nivel} ${horarioExacto.asignacion.seccion.grado}° "${horarioExacto.asignacion.seccion.nombre}".`
      });
    }

    // Verificar solapamiento de horarios para el mismo profesor
    const horariosProfesor = await prisma.horario.findMany({
      where: {
        dia: dia,
        asignacion: {
          profesorId: asignacion.profesorId
        }
      },
      include: {
        asignacion: {
          include: {
            curso: true,
            seccion: true
          }
        }
      }
    });

    for (const horarioExistente of horariosProfesor) {
      if (
        verificarSolapamiento(
          horaInicio,
          horaFin,
          horarioExistente.horaInicio,
          horarioExistente.horaFin
        )
      ) {
        return res.status(409).json({
          error: `El profesor ${asignacion.profesor.nombre} ${asignacion.profesor.apellido} ya tiene una clase el día ${dia} de ${horarioExistente.horaInicio} a ${horarioExistente.horaFin} (${horarioExistente.asignacion.curso.nombre} - ${horarioExistente.asignacion.seccion.nivel} ${horarioExistente.asignacion.seccion.grado}° "${horarioExistente.asignacion.seccion.nombre}") que se solapa con el horario propuesto.`
        });
      }
    }

    // Verificar solapamiento de horarios para la misma sección
    const horariosSeccion = await prisma.horario.findMany({
      where: {
        dia: dia,
        asignacion: {
          seccionId: asignacion.seccionId
        }
      },
      include: {
        asignacion: {
          include: {
            curso: true,
            profesor: true
          }
        }
      }
    });

    for (const horarioExistente of horariosSeccion) {
      if (
        verificarSolapamiento(
          horaInicio,
          horaFin,
          horarioExistente.horaInicio,
          horarioExistente.horaFin
        )
      ) {
        return res.status(409).json({
          error: `La sección ${asignacion.seccion.nivel} ${asignacion.seccion.grado}° "${asignacion.seccion.nombre}" ya tiene una clase el día ${dia} de ${horarioExistente.horaInicio} a ${horarioExistente.horaFin} (${horarioExistente.asignacion.curso.nombre} con ${horarioExistente.asignacion.profesor.nombre} ${horarioExistente.asignacion.profesor.apellido}) que se solapa con el horario propuesto.`
        });
      }
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
  eliminarHorario
};
