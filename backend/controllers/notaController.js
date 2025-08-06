const prisma = require('../prismaClient');
// Registrar nota (solo profesores con asignación válida)
async function registrarNota(req, res) {
  const { alumnoId, curso, bimestre, calificacion, anioAcademico } = req.body;
  const profesorId = req.usuario.id; // Sacamos el id del profesor desde el token

  if (!alumnoId || !curso || !bimestre || !calificacion || !anioAcademico) {
    return res
      .status(400)
      .json({ error: 'Todos los campos son obligatorios.' });
  }

  // Validar asignación del profesor al curso en el año académico indicado
  const asignacion = await prisma.asignacionProfesor.findFirst({
    where: {
      profesorId,
      cursoId: parseInt(curso),
      anioAcademico
    }
  });

  if (!asignacion) {
    return res
      .status(403)
      .json({
        error:
          'No tienes asignación para este curso en el año académico indicado.'
      });
  }

  try {
    const nuevaNota = await prisma.nota.create({
      data: {
        alumnoId,
        curso,
        bimestre,
        calificacion,
        profesorId
      }
    });

    res.status(201).json({ mensaje: 'Nota registrada.', nota: nuevaNota });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la nota.' });
  }
}

// Listar todas las notas (solo admin)
async function listarNotas(req, res) {
  try {
    const notas = await prisma.nota.findMany({
      include: { alumno: true, profesor: true }
    });
    res.json(notas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las notas.' });
  }
}

// Consultar notas del alumno autenticado (solo alumno)
async function misNotas(req, res) {
  const alumnoId = req.usuario.id;

  try {
    const notas = await prisma.nota.findMany({
      where: { alumnoId },
      include: { profesor: true }
    });
    res.json(notas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tus notas.' });
  }
}

module.exports = {
  registrarNota,
  listarNotas,
  misNotas
};
