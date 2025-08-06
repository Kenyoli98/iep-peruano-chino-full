// Controlador para el sistema de pre-registro de estudiantes

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { generarCodigoUnico, validarCodigoEstudiante, extraerDNIDelCodigo } = require('../utils/codigoEstudiante');
const csv = require('csv-parser');
const { Readable } = require('stream');
const EmailService = require('../services/emailService').default;
const prisma = new PrismaClient();

// Función para generar código de verificación de 6 dígitos
const generarCodigoVerificacion = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Pre-registra un estudiante (solo nombre y DNI)
 * Solo accesible por administradores
 */
const preRegistrarEstudiante = async (req, res) => {
  try {
    const { nombre, apellido, dni } = req.body;
    const adminId = req.usuario.id;

    // Validaciones básicas
    if (!nombre || !apellido || !dni) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, apellido y DNI son requeridos'
      });
    }

    // Validar formato de DNI
    if (!/^\d{8}$/.test(dni)) {
      return res.status(400).json({
        success: false,
        message: 'DNI debe tener exactamente 8 dígitos'
      });
    }

    // Verificar si ya existe un usuario con ese DNI
    const usuarioExistente = await prisma.usuario.findFirst({
      where: { dni: dni }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario registrado con este DNI'
      });
    }

    // Verificar si ya existe un usuario con el mismo nombre completo
    const nombreCompletoExistente = await prisma.usuario.findFirst({
      where: {
        nombre: nombre.trim(),
        apellido: apellido.trim()
      }
    });

    if (nombreCompletoExistente) {
      return res.status(400).json({
        success: false,
        message: `Ya existe un usuario registrado con el nombre completo: ${nombre.trim()} ${apellido.trim()}`
      });
    }

    // Generar código único de estudiante
    const codigoEstudiante = await generarCodigoUnico(dni, prisma);

    // Crear pre-registro
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 30); // 30 días para completar

    const preRegistro = await prisma.usuario.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dni: dni,
        rol: 'alumno',
        codigoEstudiante,
        estadoRegistro: 'pendiente',
        fechaPreRegistro: new Date(),
        fechaVencimiento,
        creadoPorAdmin: adminId
      }
    });

    res.status(201).json({
      success: true,
      message: 'Estudiante pre-registrado exitosamente',
      data: {
        id: preRegistro.id,
        nombre: preRegistro.nombre,
        apellido: preRegistro.apellido,
        dni: preRegistro.dni,
        codigoEstudiante: preRegistro.codigoEstudiante,
        fechaVencimiento: preRegistro.fechaVencimiento
      }
    });

  } catch (error) {
    console.error('Error en pre-registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Valida un código de estudiante y DNI
 * Endpoint público para que estudiantes verifiquen sus datos
 */
const validarCodigoYDNI = async (req, res) => {
  try {
    const { codigoEstudiante, dni } = req.body;

    // Validaciones básicas
    if (!codigoEstudiante || !dni) {
      return res.status(400).json({
        success: false,
        message: 'Código de estudiante y DNI son requeridos'
      });
    }

    // Validar formato del código
    if (!validarCodigoEstudiante(codigoEstudiante)) {
      return res.status(400).json({
        success: false,
        message: 'Código de estudiante inválido'
      });
    }

    // Extraer DNI del código y comparar
    const dniDelCodigo = extraerDNIDelCodigo(codigoEstudiante);
    if (dniDelCodigo !== dni) {
      return res.status(400).json({
        success: false,
        message: 'El DNI no coincide con el código de estudiante'
      });
    }

    // Buscar el pre-registro
    const preRegistro = await prisma.usuario.findFirst({
      where: {
        codigoEstudiante,
        dni,
        estadoRegistro: 'pendiente'
      }
    });

    if (!preRegistro) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró un pre-registro válido con estos datos'
      });
    }

    // Verificar si no ha expirado
    if (preRegistro.fechaVencimiento && new Date() > preRegistro.fechaVencimiento) {
      // Marcar como expirado
      await prisma.usuario.update({
        where: { id: preRegistro.id },
        data: { estadoRegistro: 'expirado' }
      });

      return res.status(400).json({
        success: false,
        message: 'El pre-registro ha expirado. Contacte al administrador.'
      });
    }

    res.json({
      success: true,
      message: 'Datos válidos',
      data: {
        nombre: preRegistro.nombre,
        apellido: preRegistro.apellido,
        dni: preRegistro.dni,
        fechaVencimiento: preRegistro.fechaVencimiento
      }
    });

  } catch (error) {
    console.error('Error en validación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Inicia el proceso de completar registro enviando código de verificación
 * Endpoint público para que estudiantes inicien su registro
 */
const iniciarCompletarRegistro = async (req, res) => {
  try {
    const {
      codigoEstudiante,
      dni,
      email,
      password,
      fechaNacimiento,
      sexo,
      nacionalidad,
      direccion,
      telefono,
      nombreApoderado,
      telefonoApoderado
    } = req.body;

    // Validaciones básicas
    if (!codigoEstudiante || !dni || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Código de estudiante, DNI, email y contraseña son requeridos'
      });
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Verificar que el email no esté en uso
    const emailExistente = await prisma.usuario.findFirst({
      where: {
        email,
        NOT: { codigoEstudiante }
      }
    });

    if (emailExistente) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está en uso'
      });
    }

    // Buscar el pre-registro
    const preRegistro = await prisma.usuario.findFirst({
      where: {
        codigoEstudiante,
        dni,
        estadoRegistro: 'pendiente'
      }
    });

    if (!preRegistro) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró un pre-registro válido'
      });
    }

    // Verificar si no ha expirado
    if (preRegistro.fechaVencimiento && new Date() > preRegistro.fechaVencimiento) {
      await prisma.usuario.update({
        where: { id: preRegistro.id },
        data: { estadoRegistro: 'expirado' }
      });

      return res.status(400).json({
        success: false,
        message: 'El pre-registro ha expirado'
      });
    }

    // Generar código de verificación
    const codigoVerificacion = generarCodigoVerificacion();
    const fechaExpiracionCodigo = new Date();
    fechaExpiracionCodigo.setMinutes(fechaExpiracionCodigo.getMinutes() + 15); // 15 minutos

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar datos temporalmente con código de verificación
    await prisma.usuario.update({
      where: { id: preRegistro.id },
      data: {
        email,
        password: hashedPassword,
        fechaNacimiento,
        sexo,
        nacionalidad,
        direccion,
        telefono,
        nombreApoderado,
        telefonoApoderado,
        estadoRegistro: 'verificando_email',
        codigoVerificacion,
        fechaExpiracionCodigo
      }
    });

    // Enviar email de verificación
    try {
      await EmailService.sendEmailVerification(
        email,
        `${preRegistro.nombre} ${preRegistro.apellido}`,
        codigoVerificacion
      );

      res.json({
        success: true,
        message: 'Código de verificación enviado al email',
        data: {
          email: email,
          mensaje: 'Revisa tu bandeja de entrada y spam. El código expira en 15 minutos.'
        }
      });
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      
      // Revertir el estado si no se pudo enviar el email
      await prisma.usuario.update({
        where: { id: preRegistro.id },
        data: {
          estadoRegistro: 'pendiente',
          codigoVerificacion: null,
          fechaExpiracionCodigo: null
        }
      });

      return res.status(500).json({
        success: false,
        message: 'Error al enviar el código de verificación. Intenta nuevamente.'
      });
    }

  } catch (error) {
    console.error('Error iniciando registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Verifica el código de email y completa el registro
 * Endpoint público para verificar código y activar cuenta
 */
const verificarEmailYCompletarRegistro = async (req, res) => {
  try {
    const { codigoEstudiante, dni, codigoVerificacion } = req.body;

    // Validaciones básicas
    if (!codigoEstudiante || !dni || !codigoVerificacion) {
      return res.status(400).json({
        success: false,
        message: 'Código de estudiante, DNI y código de verificación son requeridos'
      });
    }

    // Buscar el usuario en proceso de verificación
    const usuario = await prisma.usuario.findFirst({
      where: {
        codigoEstudiante,
        dni,
        estadoRegistro: 'verificando_email'
      }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró un proceso de verificación válido'
      });
    }

    // Verificar si el código no ha expirado
    if (!usuario.fechaExpiracionCodigo || new Date() > usuario.fechaExpiracionCodigo) {
      return res.status(400).json({
        success: false,
        message: 'El código de verificación ha expirado. Solicita uno nuevo.'
      });
    }

    // Verificar el código
    if (usuario.codigoVerificacion !== codigoVerificacion) {
      return res.status(400).json({
        success: false,
        message: 'Código de verificación incorrecto'
      });
    }

    // Completar el registro y activar la cuenta
    const usuarioCompleto = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        estadoRegistro: 'activo',
        fechaActivacion: new Date(),
        codigoVerificacion: null,
        fechaExpiracionCodigo: null
      }
    });

    res.json({
      success: true,
      message: 'Email verificado y registro completado exitosamente',
      data: {
        id: usuarioCompleto.id,
        nombre: usuarioCompleto.nombre,
        apellido: usuarioCompleto.apellido,
        email: usuarioCompleto.email,
        codigoEstudiante: usuarioCompleto.codigoEstudiante
      }
    });

  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Reenvía el código de verificación
 * Endpoint público para reenviar código si expiró
 */
const reenviarCodigoVerificacion = async (req, res) => {
  try {
    const { codigoEstudiante, dni } = req.body;

    // Validaciones básicas
    if (!codigoEstudiante || !dni) {
      return res.status(400).json({
        success: false,
        message: 'Código de estudiante y DNI son requeridos'
      });
    }

    // Buscar el usuario en proceso de verificación
    const usuario = await prisma.usuario.findFirst({
      where: {
        codigoEstudiante,
        dni,
        estadoRegistro: 'verificando_email'
      }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró un proceso de verificación válido'
      });
    }

    // Generar nuevo código de verificación
    const nuevoCodigoVerificacion = generarCodigoVerificacion();
    const nuevaFechaExpiracion = new Date();
    nuevaFechaExpiracion.setMinutes(nuevaFechaExpiracion.getMinutes() + 15);

    // Actualizar código en la base de datos
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        codigoVerificacion: nuevoCodigoVerificacion,
        fechaExpiracionCodigo: nuevaFechaExpiracion
      }
    });

    // Enviar nuevo email de verificación
    try {
      await EmailService.sendEmailVerification(
        usuario.email,
        `${usuario.nombre} ${usuario.apellido}`,
        nuevoCodigoVerificacion
      );

      res.json({
        success: true,
        message: 'Nuevo código de verificación enviado',
        data: {
          email: usuario.email,
          mensaje: 'Revisa tu bandeja de entrada y spam. El código expira en 15 minutos.'
        }
      });
    } catch (emailError) {
      console.error('Error reenviando email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Error al reenviar el código de verificación. Intenta nuevamente.'
      });
    }

  } catch (error) {
    console.error('Error reenviando código:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene la lista de pre-registros con filtros
 * Solo accesible por administradores
 */
const listarPreRegistros = async (req, res) => {
  try {
    const {
      estado = 'todos',
      page = 1,
      limit = 10,
      search = ''
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Construir filtros
    const where = {
      rol: 'alumno'
    };

    if (estado !== 'todos') {
      where.estadoRegistro = estado;
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { apellido: { contains: search } },
        { dni: { contains: search } },
        { codigoEstudiante: { contains: search } }
      ];
    }

    // Obtener registros y total
    const [registros, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        skip,
        take,
        orderBy: { fechaPreRegistro: 'desc' },
        select: {
          id: true,
          nombre: true,
          apellido: true,
          dni: true,
          email: true,
          codigoEstudiante: true,
          estadoRegistro: true,
          fechaPreRegistro: true,
          fechaActivacion: true,
          fechaVencimiento: true,
          ultimoLogin: true
        }
      }),
      prisma.usuario.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        registros,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error listando pre-registros:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene estadísticas del sistema de pre-registro
 * Solo accesible por administradores
 */
const obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await prisma.usuario.groupBy({
      by: ['estadoRegistro'],
      where: { rol: 'alumno' },
      _count: true
    });

    const stats = {
      total: 0,
      pendientes: 0,
      activos: 0,
      expirados: 0,
      suspendidos: 0,
      cancelados: 0
    };

    estadisticas.forEach(stat => {
      stats.total += stat._count;
      stats[stat.estadoRegistro + 's'] = stat._count;
    });

    // Estadísticas adicionales
    const hoy = new Date();
    const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [proximosVencer, registrosRecientes] = await Promise.all([
      prisma.usuario.count({
        where: {
          rol: 'alumno',
          estadoRegistro: 'pendiente',
          fechaVencimiento: {
            lte: new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000) // próximos 7 días
          }
        }
      }),
      prisma.usuario.count({
        where: {
          rol: 'alumno',
          fechaPreRegistro: {
            gte: hace30Dias
          }
        }
      })
    ]);

    stats.proximosVencer = proximosVencer;
    stats.registrosRecientes = registrosRecientes;

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Activa o suspende un estudiante
 * Solo accesible por administradores
 */
const cambiarEstadoEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'activo' o 'suspendido'

    if (!['activo', 'suspendido'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado debe ser "activo" o "suspendido"'
      });
    }

    const estudiante = await prisma.usuario.findFirst({
      where: {
        id: parseInt(id),
        rol: 'alumno'
      }
    });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    const datosActualizacion = {
      estadoRegistro: estado
    };

    if (estado === 'activo') {
      datosActualizacion.fechaActivacion = new Date();
    }

    const estudianteActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: datosActualizacion
    });

    res.json({
      success: true,
      message: `Estudiante ${estado === 'activo' ? 'activado' : 'suspendido'} exitosamente`,
      data: {
        id: estudianteActualizado.id,
        nombre: estudianteActualizado.nombre,
        apellido: estudianteActualizado.apellido,
        estadoRegistro: estudianteActualizado.estadoRegistro
      }
    });

  } catch (error) {
    console.error('Error cambiando estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Importa estudiantes desde un archivo CSV para pre-registro masivo
 * Solo accesible por administradores
 */
const importarPreRegistrosCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se envió ningún archivo CSV'
      });
    }

    const adminId = req.usuario.id;
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const estudiantes = [];
    const errores = [];
    let lineaActual = 0;

    bufferStream
      .pipe(csv())
      .on('data', (row) => {
        lineaActual++;
        
        // Validar campos requeridos
        const nombre = row.nombre?.trim();
        const apellido = row.apellido?.trim();
        const dni = row.dni?.trim();

        if (!nombre || !apellido || !dni) {
          errores.push({
            linea: lineaActual,
            error: 'Nombre, apellido y DNI son requeridos',
            datos: { nombre, apellido, dni }
          });
          return;
        }

        // Validar formato de DNI
        if (!/^\d{8}$/.test(dni)) {
          errores.push({
            linea: lineaActual,
            error: 'DNI debe tener exactamente 8 dígitos',
            datos: { nombre, apellido, dni }
          });
          return;
        }

        estudiantes.push({
          nombre,
          apellido,
          dni
        });
      })
      .on('end', async () => {
        try {
          if (errores.length > 0) {
            return res.status(400).json({
              success: false,
              message: 'Se encontraron errores en el archivo CSV',
              errores,
              totalLineas: lineaActual
            });
          }

          if (estudiantes.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No se encontraron estudiantes válidos en el archivo CSV'
            });
          }

          // Verificar DNIs duplicados en el archivo
          const dnisEnArchivo = estudiantes.map(e => e.dni);
          const dnisDuplicados = dnisEnArchivo.filter((dni, index) => dnisEnArchivo.indexOf(dni) !== index);
          
          if (dnisDuplicados.length > 0) {
            return res.status(400).json({
              success: false,
              message: 'Se encontraron DNIs duplicados en el archivo CSV',
              dnisDuplicados: [...new Set(dnisDuplicados)]
            });
          }

          // Verificar nombres completos duplicados en el archivo
          const nombresCompletos = estudiantes.map(e => `${e.nombre} ${e.apellido}`);
          const nombresCompletosDuplicados = nombresCompletos.filter((nombre, index) => nombresCompletos.indexOf(nombre) !== index);
          
          if (nombresCompletosDuplicados.length > 0) {
            return res.status(400).json({
              success: false,
              message: 'Se encontraron nombres completos duplicados en el archivo CSV',
              nombresCompletosDuplicados: [...new Set(nombresCompletosDuplicados)]
            });
          }

          // Verificar si ya existen usuarios con esos DNIs
          const dnisExistentes = await prisma.usuario.findMany({
            where: {
              dni: {
                in: dnisEnArchivo
              }
            },
            select: {
              dni: true,
              nombre: true,
              apellido: true
            }
          });

          if (dnisExistentes.length > 0) {
            return res.status(400).json({
              success: false,
              message: 'Algunos DNIs ya están registrados en el sistema',
              dnisExistentes
            });
          }

          // Verificar si ya existen usuarios con esos nombres completos
          const nombresExistentes = await prisma.usuario.findMany({
            where: {
              OR: estudiantes.map(e => ({
                nombre: e.nombre,
                apellido: e.apellido
              }))
            },
            select: {
              dni: true,
              nombre: true,
              apellido: true
            }
          });

          if (nombresExistentes.length > 0) {
            return res.status(400).json({
              success: false,
              message: 'Algunos nombres completos ya están registrados en el sistema',
              nombresExistentes: nombresExistentes.map(u => `${u.nombre} ${u.apellido}`)
            });
          }

          // Crear pre-registros en lote
          const fechaVencimiento = new Date();
          fechaVencimiento.setDate(fechaVencimiento.getDate() + 30); // 30 días para completar

          const preRegistrosData = [];
          
          for (const estudiante of estudiantes) {
            const codigoEstudiante = await generarCodigoUnico(estudiante.dni, prisma);
            
            preRegistrosData.push({
              nombre: estudiante.nombre,
              apellido: estudiante.apellido,
              dni: estudiante.dni,
              rol: 'alumno',
              codigoEstudiante,
              estadoRegistro: 'pendiente',
              fechaPreRegistro: new Date(),
              fechaVencimiento,
              creadoPorAdmin: adminId
            });
          }

          // Insertar todos los pre-registros
          const resultado = await prisma.usuario.createMany({
            data: preRegistrosData,
            skipDuplicates: true
          });

          res.status(201).json({
            success: true,
            message: `Se pre-registraron ${resultado.count} estudiantes exitosamente`,
            data: {
              procesados: estudiantes.length,
              creados: resultado.count,
              fechaVencimiento
            }
          });

        } catch (error) {
          console.error('Error procesando CSV:', error);
          res.status(500).json({
            success: false,
            message: 'Error interno del servidor al procesar el archivo'
          });
        }
      })
      .on('error', (error) => {
        console.error('Error leyendo CSV:', error);
        res.status(400).json({
          success: false,
          message: 'Error al leer el archivo CSV. Verifique el formato.'
        });
      });

  } catch (error) {
    console.error('Error en importación CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Reactiva un pre-registro expirado
 * Solo accesible por administradores
 */
const reactivarPreRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const { diasExtension = 30 } = req.body; // Días adicionales para completar el registro
    const adminId = req.usuario.id;

    // Validar que diasExtension sea un número positivo
    if (!Number.isInteger(diasExtension) || diasExtension <= 0 || diasExtension > 365) {
      return res.status(400).json({
        success: false,
        message: 'Los días de extensión deben ser un número entero entre 1 y 365'
      });
    }

    // Buscar el pre-registro
    const preRegistro = await prisma.usuario.findUnique({
      where: { id: parseInt(id) }
    });

    if (!preRegistro) {
      return res.status(404).json({
        success: false,
        message: 'Pre-registro no encontrado'
      });
    }

    // Verificar que sea un pre-registro expirado
    if (preRegistro.estadoRegistro !== 'expirado') {
      return res.status(400).json({
        success: false,
        message: `No se puede reactivar un pre-registro con estado: ${preRegistro.estadoRegistro}`
      });
    }

    // Verificar que no haya otro usuario activo con el mismo DNI
        if (preRegistro.dni) {
          const usuarioConMismoDNI = await prisma.usuario.findFirst({
            where: {
              dni: preRegistro.dni,
              id: { not: preRegistro.id },
              estadoRegistro: { in: ['pendiente', 'activo'] }
            }
          });

      if (usuarioConMismoDNI) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro usuario activo con el mismo DNI. No se puede reactivar.'
        });
      }
    }

    // Verificar que no haya otro usuario activo con el mismo nombre completo
        const usuarioConMismoNombre = await prisma.usuario.findFirst({
          where: {
            nombre: preRegistro.nombre,
            apellido: preRegistro.apellido,
            id: { not: preRegistro.id },
            estadoRegistro: { in: ['pendiente', 'activo'] }
          }
        });

    if (usuarioConMismoNombre) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro usuario activo con el mismo nombre completo. No se puede reactivar.'
      });
    }

    // Calcular nueva fecha de vencimiento
    const nuevaFechaVencimiento = new Date();
    nuevaFechaVencimiento.setDate(nuevaFechaVencimiento.getDate() + diasExtension);

    // Reactivar el pre-registro
    const preRegistroReactivado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: {
        estadoRegistro: 'pendiente',
        fechaVencimiento: nuevaFechaVencimiento,
        fechaPreRegistro: new Date(), // Actualizar fecha de pre-registro
        creadoPorAdmin: adminId // Registrar quién lo reactivó
      }
    });

    res.json({
      success: true,
      message: 'Pre-registro reactivado exitosamente',
      data: {
        id: preRegistroReactivado.id,
        nombre: preRegistroReactivado.nombre,
        apellido: preRegistroReactivado.apellido,
        dni: preRegistroReactivado.dni,
        codigoEstudiante: preRegistroReactivado.codigoEstudiante,
        estadoRegistro: preRegistroReactivado.estadoRegistro,
        fechaVencimiento: preRegistroReactivado.fechaVencimiento,
        diasExtension
      }
    });

  } catch (error) {
    console.error('Error reactivando pre-registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  preRegistrarEstudiante,
  validarCodigoYDNI,
  iniciarCompletarRegistro,
  verificarEmailYCompletarRegistro,
  reenviarCodigoVerificacion,
  listarPreRegistros,
  obtenerEstadisticas,
  cambiarEstadoEstudiante,
  importarPreRegistrosCSV,
  reactivarPreRegistro
};