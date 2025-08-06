const prisma = require('../prismaClient');
// Registrar pensión (solo admin)
async function registrarPension(req, res) {
  const { alumnoId, mes, anio } = req.body;

  if (!alumnoId || !mes || !anio) {
    return res
      .status(400)
      .json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const nuevaPension = await prisma.pension.create({
      data: {
        alumnoId,
        mes,
        anio
      }
    });

    res
      .status(201)
      .json({ mensaje: 'Pensión registrada.', pension: nuevaPension });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la pensión.' });
  }
}

// Listar todas las pensiones (solo admin)
async function listarPensiones(req, res) {
  try {
    const pensiones = await prisma.pension.findMany({
      include: { alumno: true }
    });
    res.json(pensiones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las pensiones.' });
  }
}

// Consultar pensiones del alumno autenticado
async function misPensiones(req, res) {
  const alumnoId = req.usuario.id;

  try {
    const pensiones = await prisma.pension.findMany({
      where: { alumnoId }
    });
    res.json(pensiones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tus pensiones.' });
  }
}

// Registrar pago simulado (solo alumno)
async function pagarPension(req, res) {
  const alumnoId = req.usuario.id;
  const { pensionId } = req.body;

  try {
    const pension = await prisma.pension.findFirst({
      where: { id: pensionId, alumnoId }
    });

    if (!pension) {
      return res.status(404).json({ error: 'Pensión no encontrada.' });
    }

    const pensionPagada = await prisma.pension.update({
      where: { id: pensionId },
      data: { estadoPago: true }
    });

    res.json({
      mensaje: 'Pago registrado exitosamente.',
      pension: pensionPagada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el pago.' });
  }
}

module.exports = {
  registrarPension,
  listarPensiones,
  misPensiones,
  pagarPension
};
