const prisma = require('../prismaClient');
// Registrar Matrícula (con auditoría)
async function registrarMatricula(req, res) {
  const { alumnoId, grado, seccion, anioAcademico } = req.body;
  const creadoPorId = req.usuario.id;  // ID del usuario que crea la matrícula

  if (!alumnoId || !grado || !seccion || !anioAcademico) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const nuevaMatricula = await prisma.matricula.create({
      data: {
        alumnoId,
        grado,
        seccion,
        anioAcademico,
        creadoPorId
      }
    });

    res.status(201).json({ mensaje: 'Matrícula registrada.', matricula: nuevaMatricula });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la matrícula.' });
  }
}

// Editar Matrícula (con auditoría)
async function editarMatricula(req, res) {
  const { id } = req.params;
  const { grado, seccion, anioAcademico } = req.body;
  const modificadoPorId = req.usuario.id;

  try {
    const matriculaActualizada = await prisma.matricula.update({
      where: { id: parseInt(id) },
      data: {
        grado,
        seccion,
        anioAcademico,
        modificadoPorId
      }
    });

    res.json({ mensaje: 'Matrícula actualizada.', matricula: matriculaActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la matrícula.' });
  }
}

// Eliminar Matrícula (con auditoría)
async function eliminarMatricula(req, res) {
  const { id } = req.params;
  const eliminadoPorId = req.usuario.id;

  try {
    const matricula = await prisma.matricula.update({
      where: { id: parseInt(id) },
      data: { eliminadoPorId }
    });

    await prisma.matricula.delete({ where: { id: parseInt(id) } });

    res.json({ mensaje: 'Matrícula eliminada.', matricula });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la matrícula.' });
  }
}

// Listar Matrículas (todas)
async function listarMatriculas(req, res) {
  try {
    const matriculas = await prisma.matricula.findMany({
      include: {
        alumno: true,
        creadoPor: true,
        modificadoPor: true,
        eliminadoPor: true
      }
    });
    res.json(matriculas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las matrículas.' });
  }
}

module.exports = {
  registrarMatricula,
  editarMatricula,
  eliminarMatricula,
  listarMatriculas
};
