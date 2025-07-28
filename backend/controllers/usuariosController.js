const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para calcular edad
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

// Controlador: Registrar usuario (con solución definitiva guardando fecha como string ISO)
async function registrarUsuario(req, res) {
  const {
    nombre,
    apellido,
    email,
    password,
    rol,
    fechaNacimiento,
    sexo,
    nacionalidad,
    dni,
    direccion,
    telefono,
    nombreApoderado,
    telefonoApoderado,
  } = req.body;

  console.log('\n==============================');
  console.log('⚡ CONTROLADOR EN EJECUCIÓN:', __filename);
  console.log('Valor recibido en fechaNacimiento:', fechaNacimiento);
  console.log('Tipo de dato recibido:', typeof fechaNacimiento);
  console.log('==============================');

  if (!nombre || !apellido || !email || !password || !rol) {
    return res.status(400).json({ error: 'Faltan datos obligatorios generales.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'El correo electrónico no es válido.' });
  }

  const rolesPermitidos = ['admin', 'profesor', 'alumno'];
  if (!rolesPermitidos.includes(rol.toLowerCase())) {
    return res.status(400).json({ error: 'Rol no válido. Debe ser admin, profesor o alumno.' });
  }
// Validación obligatoria para todos los roles
if (!fechaNacimiento) {
  return res.status(400).json({ error: 'La fecha de nacimiento es obligatoria.' });
}

let fechaNacimientoConvertida;
try {
  const fecha = new Date(fechaNacimiento);
  if (isNaN(fecha.getTime()) || fecha.getFullYear() < 1900) {
    throw new Error('Fecha inválida');
  }
  fechaNacimientoConvertida = fecha;
} catch {
  return res.status(400).json({ error: 'Fecha de nacimiento inválida.' });
}


  console.log('Fecha convertida FINAL antes de guardar:', fechaNacimientoConvertida);
  console.log('Tipo de dato que vas a guardar:', typeof fechaNacimientoConvertida);

  if (rol.toLowerCase() === 'alumno') {
    if (
      !fechaNacimiento ||
      !sexo ||
      !nacionalidad ||
      !dni ||
      !direccion ||
      !telefono
    ) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para alumno.' });
    }

    const edad = calcularEdad(fechaNacimientoConvertida);
    if (edad < 18 && (!nombreApoderado || !telefonoApoderado)) {
      return res.status(400).json({ error: 'Faltan datos del apoderado para alumno menor de edad.' });
    }
  }

  try {
    const resultado = await prisma.$transaction(async (tx) => {
      const usuarioExistente = await tx.usuario.findUnique({ where: { email } });
      if (usuarioExistente) {
        throw new Error('El correo electrónico ya está registrado.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const nuevoUsuario = await tx.usuario.create({
        data: {
          nombre,
          apellido,
          email,
          password: hashedPassword,
          rol: rol.toLowerCase(),
          fechaNacimiento: fechaNacimientoConvertida.toISOString(), // ✅ Guardando fecha como string ISO
          sexo,
          nacionalidad,
          dni,
          direccion,
          telefono,
          nombreApoderado,
          telefonoApoderado,
        },
      });

      return nuevoUsuario;
    });

    res.status(201).json({
      mensaje: 'Usuario creado correctamente.',
      usuario: resultado,
    });
  } catch (error) {
    console.error(error);
    if (error.message === 'El correo electrónico ya está registrado.') {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error interno al crear usuario.' });
    }
  }
}

// Controladores restantes (sin cambios)
async function listarUsuarios(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}

async function loginUsuario(req, res) {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, code: 'MISSING_FIELDS', error: 'Correo y contraseña son obligatorios.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, code: 'INVALID_EMAIL', error: 'El formato del correo electrónico no es válido.' });
  }

  if (email.length > 100 || password.length > 100) {
    return res.status(400).json({ success: false, code: 'FIELD_TOO_LONG', error: 'Correo o contraseña demasiado largos.' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    const genericError = { success: false, code: 'INVALID_CREDENTIALS', error: 'Usuario o contraseña incorrectos.' };
    if (!usuario) {
      return res.status(401).json(genericError);
    }
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      return res.status(401).json(genericError);
    }
    const expiresIn = rememberMe ? '7d' : '2h';
    const jwtSecret = process.env.JWT_SECRET || 'CLAVE_SECRETA_SUPERSEGURA';
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
      jwtSecret,
      { expiresIn }
    );
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
      expiresIn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, code: 'SERVER_ERROR', error: 'Error interno al iniciar sesión.' });
  }
}

module.exports = {
  registrarUsuario,
  listarUsuarios,
  loginUsuario,
};
