const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const EmailService = require('../services/emailService');

const logger = require('../utils/logger');

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
    telefonoApoderado
  } = req.body;

  console.log('\n==============================');
  console.log('⚡ CONTROLADOR EN EJECUCIÓN:', __filename);
  console.log('Valor recibido en fechaNacimiento:', fechaNacimiento);
  console.log('Tipo de dato recibido:', typeof fechaNacimiento);
  console.log('==============================');

  if (!nombre || !apellido || !email || !password || !rol) {
    return res
      .status(400)
      .json({ error: 'Faltan datos obligatorios generales.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: 'El correo electrónico no es válido.' });
  }

  const rolesPermitidos = ['admin', 'profesor', 'alumno'];
  if (!rolesPermitidos.includes(rol.toLowerCase())) {
    return res
      .status(400)
      .json({ error: 'Rol no válido. Debe ser admin, profesor o alumno.' });
  }
  // Validación obligatoria para todos los roles
  if (!fechaNacimiento) {
    return res
      .status(400)
      .json({ error: 'La fecha de nacimiento es obligatoria.' });
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

  console.log(
    'Fecha convertida FINAL antes de guardar:',
    fechaNacimientoConvertida
  );
  console.log(
    'Tipo de dato que vas a guardar:',
    typeof fechaNacimientoConvertida
  );

  if (rol.toLowerCase() === 'alumno') {
    if (
      !fechaNacimiento ||
      !sexo ||
      !nacionalidad ||
      !dni ||
      !direccion ||
      !telefono
    ) {
      return res
        .status(400)
        .json({ error: 'Faltan datos obligatorios para alumno.' });
    }

    const edad = calcularEdad(fechaNacimientoConvertida);
    if (edad < 18 && (!nombreApoderado || !telefonoApoderado)) {
      return res
        .status(400)
        .json({
          error: 'Faltan datos del apoderado para alumno menor de edad.'
        });
    }
  }

  try {
    const resultado = await prisma.$transaction(async tx => {
      const usuarioExistente = await tx.usuario.findUnique({
        where: { email }
      });
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
          telefonoApoderado
        }
      });

      return nuevoUsuario;
    });

    res.status(201).json({
      mensaje: 'Usuario creado correctamente.',
      usuario: resultado
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
  const { dni, password, rememberMe } = req.body;

  if (!dni || !password) {
    return res
      .status(400)
      .json({
        success: false,
        code: 'MISSING_FIELDS',
        error: 'DNI y contraseña son obligatorios.'
      });
  }

  const dniRegex = /^\d{8}$/;
  if (!dniRegex.test(dni)) {
    return res
      .status(400)
      .json({
        success: false,
        code: 'INVALID_DNI',
        error: 'El DNI debe tener exactamente 8 dígitos.'
      });
  }

  if (dni.length > 8 || password.length > 100) {
    return res
      .status(400)
      .json({
        success: false,
        code: 'FIELD_TOO_LONG',
        error: 'DNI o contraseña demasiado largos.'
      });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { dni } });
    const genericError = {
      success: false,
      code: 'INVALID_CREDENTIALS',
      error: 'DNI o contraseña incorrectos.'
    };
    if (!usuario) {
      return res.status(401).json(genericError);
    }
    
    // Verificar que el usuario tenga un estado válido para login
    const estadosPermitidos = ['activo'];
    if (!estadosPermitidos.includes(usuario.estadoRegistro)) {
      return res.status(401).json({
        success: false,
        code: 'ACCOUNT_NOT_ACTIVE',
        error: 'Tu cuenta no está activa. Contacta al administrador.'
      });
    }
    
    // Verificar que tenga contraseña (usuarios pre-registrados pueden no tenerla)
    if (!usuario.password) {
      return res.status(401).json({
        success: false,
        code: 'REGISTRATION_INCOMPLETE',
        error: 'Debes completar tu registro antes de iniciar sesión.'
      });
    }
    
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      return res.status(401).json(genericError);
    }
    // Actualizar último login
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { 
        ultimoLogin: new Date(),
        intentosLogin: 0 // Resetear intentos fallidos
      }
    });
    
    const expiresIn = rememberMe ? '7d' : '2h';
    const jwtSecret = process.env.JWT_SECRET || 'CLAVE_SECRETA_SUPERSEGURA';
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
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
        rol: usuario.rol
      },
      expiresIn
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        code: 'SERVER_ERROR',
        error: 'Error interno al iniciar sesión.'
      });
  }
}

// Controlador: Solicitar reset de contraseña
async function solicitarResetPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ error: 'El correo electrónico es obligatorio.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: 'El formato del correo electrónico no es válido.' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    // Por seguridad, siempre devolvemos el mismo mensaje
    const successMessage =
      'Hemos enviado las instrucciones de recuperación a tu correo electrónico. Si no recibes el mensaje, verifica tu bandeja de spam.';

    if (!usuario) {
      return res.status(200).json({ message: successMessage });
    }

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la base de datos
    await prisma.usuario.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Enviar email de recuperación
    try {
      await EmailService.sendPasswordResetEmail(
        usuario.email,
        usuario.nombre,
        resetToken
      );

      logger.info(`Password reset email sent to: ${email}`);

      res.status(200).json({
        message: successMessage
      });
    } catch (emailError) {
      logger.error('Error sending password reset email:', emailError);

      // En caso de error de email, aún mostramos el enlace en desarrollo
      console.log('\n=== TOKEN DE RESET GENERADO ===');
      console.log(`Email: ${email}`);
      console.log(`Token: ${resetToken}`);
      console.log(`Expira: ${resetTokenExpiry}`);
      console.log(
        `URL de reset: http://localhost:3000/reset-password?token=${resetToken}`
      );
      console.log('===============================\n');

      res.status(200).json({
        message: successMessage,
        // Solo para desarrollo - remover en producción
        dev:
          process.env.NODE_ENV === 'development'
            ? {
              resetToken,
              resetUrl: `http://localhost:3000/reset-password?token=${resetToken}`
            }
            : undefined
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
  }
}

// Controlador: Confirmar reset de contraseña
async function confirmarResetPassword(req, res) {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: 'Token y nueva contraseña son obligatorios.' });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token no expirado
        }
      }
    });

    if (!usuario) {
      return res.status(400).json({ error: 'Token inválido o expirado.' });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar token
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    // Enviar email de confirmación de cambio de contraseña
    try {
      await EmailService.sendPasswordChangedEmail(
        usuario.email,
        usuario.nombre
      );

      logger.info(
        `Email de confirmación de cambio de contraseña enviado a: ${usuario.email}`
      );
    } catch (emailError) {
      logger.error(
        'Error al enviar email de confirmación de cambio de contraseña:',
        emailError
      );
      // No fallar la operación si el email no se puede enviar
    }

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Error interno al actualizar la contraseña.' });
  }
}

// Controlador: Verificar si un email existe
async function verificarEmail(req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ error: 'El correo electrónico es obligatorio.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: 'El formato del correo electrónico no es válido.' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    res.status(200).json({
      exists: !!usuario,
      message: usuario
        ? 'El correo electrónico está registrado.'
        : 'El correo electrónico no está registrado.'
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Error interno al verificar el correo electrónico.' });
  }
}

// Controlador: Verificar si un teléfono existe
async function verificarTelefono(req, res) {
  const { telefono } = req.body;

  if (!telefono) {
    return res
      .status(400)
      .json({ error: 'El número de teléfono es obligatorio.' });
  }

  try {
    // Validación básica de formato de teléfono
    const phoneRegex = /^\+51\d{9}$/;
    if (!phoneRegex.test(telefono)) {
      return res
        .status(400)
        .json({
          error:
            'El formato del número de teléfono no es válido. Use el formato: +51999999999'
        });
    }

    const usuario = await prisma.usuario.findFirst({
      where: { telefono: telefono }
    });

    res.status(200).json({
      exists: !!usuario,
      message: usuario
        ? 'El número de teléfono está registrado.'
        : 'El número de teléfono no está registrado.'
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Error interno al verificar el número de teléfono.' });
  }
}

// Función auxiliar para ocultar parcialmente el email
function maskEmail(email) {
  if (!email) return '';

  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;

  let maskedLocal;
  if (localPart.length <= 3) {
    maskedLocal = localPart[0] + '*'.repeat(localPart.length - 1);
  } else {
    const visibleChars = Math.min(4, Math.floor(localPart.length * 0.4));
    const start = localPart.substring(0, visibleChars);
    const end = localPart.substring(localPart.length - 2);
    maskedLocal = start + '*'.repeat(localPart.length - visibleChars - 2) + end;
  }

  return `${maskedLocal}@${domain}`;
}

// Función auxiliar para ocultar parcialmente el teléfono
function maskPhone(phone) {
  if (!phone) return '';

  // Remover el prefijo +51 si existe
  const cleanPhone = phone.replace(/^\+51/, '');
  if (cleanPhone.length !== 9) return phone;

  // Mostrar los primeros 3 y últimos 2 dígitos
  const start = cleanPhone.substring(0, 3);
  const end = cleanPhone.substring(7);
  const masked = start + '****' + end;

  return `+51 ${masked}`;
}

// Controlador: Verificar DNI y obtener información del usuario
async function verificarDNI(req, res) {
  const { dni } = req.body;

  if (!dni) {
    return res.status(400).json({ error: 'El DNI es obligatorio.' });
  }

  // Validar formato de DNI (8 dígitos)
  if (!/^\d{8}$/.test(dni)) {
    return res.status(400).json({ error: 'El DNI debe tener 8 dígitos.' });
  }

  try {
    const usuario = await prisma.usuario.findFirst({
      where: { dni: dni },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        dni: true
      }
    });

    if (!usuario) {
      return res.status(404).json({
        exists: false,
        message: 'No se encontró ningún usuario con este DNI.'
      });
    }

    // Preparar datos con información parcialmente oculta
    const userData = {
      exists: true,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: {
        full: usuario.email,
        masked: maskEmail(usuario.email)
      },
      telefono: {
        full: usuario.telefono,
        masked: maskPhone(usuario.telefono)
      },
      recoveryOptions: {
        email: !!usuario.email
      }
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al verificar el DNI.' });
  }
}

module.exports = {
  registrarUsuario,
  listarUsuarios,
  loginUsuario,
  solicitarResetPassword,
  confirmarResetPassword,
  verificarEmail,
  verificarTelefono,
  verificarDNI
};
