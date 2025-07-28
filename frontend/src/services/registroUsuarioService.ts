import api from './api';

export interface UsuarioData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  dni: string;
  sexo: 'M' | 'F';
  nacionalidad: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  rol: 'admin' | 'profesor' | 'alumno';
  nombreApoderado?: string;
  telefonoApoderado?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  usuario?: UsuarioData;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Función para capitalizar cada palabra
const capitalizarPalabra = (texto: string): string => {
  return texto
    .trim()
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateDNI = (dni: string): boolean => {
  return /^\d{8}$/.test(dni);
};

const validatePhone = (phone: string): boolean => {
  return /^\d{9}$/.test(phone);
};

export const registrarUsuario = async (usuarioData: UsuarioData): Promise<ApiResponse> => {
  // Capitalizar nombres y apellidos
  const datosCapitalizados = {
    ...usuarioData,
    nombre: capitalizarPalabra(usuarioData.nombre),
    apellido: capitalizarPalabra(usuarioData.apellido),
    nombreApoderado: usuarioData.nombreApoderado ? capitalizarPalabra(usuarioData.nombreApoderado) : undefined
  };

  // Validaciones del lado del cliente
  if (!validateEmail(datosCapitalizados.email)) {
    throw new ValidationError('El formato del correo electrónico no es válido');
  }

  if (!validateDNI(datosCapitalizados.dni)) {
    throw new ValidationError('El DNI debe tener 8 dígitos');
  }

  if (!validatePhone(datosCapitalizados.telefono)) {
    throw new ValidationError('El teléfono debe tener 9 dígitos');
  }

  if (datosCapitalizados.password.length < 6) {
    throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
  }

  // Si es alumno, validar campos de apoderado
  if (datosCapitalizados.rol === 'alumno') {
    if (!datosCapitalizados.nombreApoderado?.trim()) {
      throw new ValidationError('El nombre del apoderado es requerido para alumnos');
    }
    if (!datosCapitalizados.telefonoApoderado || !validatePhone(datosCapitalizados.telefonoApoderado)) {
      throw new ValidationError('El teléfono del apoderado debe tener 9 dígitos');
    }
  }

  try {
    const token = localStorage.getItem('token');
    const res = await api.post('/usuarios', datosCapitalizados, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
    if (error.response?.status === 409) {
      throw new Error('Ya existe un usuario con ese correo electrónico o DNI.');
    }
    throw new Error(error.response?.data?.message || 'Error al registrar usuario');
  }
};
