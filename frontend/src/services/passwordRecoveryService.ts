import { getAuthToken } from '../utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  dev?: {
    resetToken: string;
    resetUrl: string;
  };
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ApiError {
  error: string;
}

export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  exists: boolean;
  message: string;
}

export interface VerifyPhoneRequest {
  telefono: string;
}

export interface VerifyPhoneResponse {
  exists: boolean;
  message: string;
}

/**
 * Servicio para verificar si un email existe en la base de datos
 * @param email - Correo electrónico a verificar
 * @returns Promise con la respuesta del servidor
 */
export const verifyEmailExists = async (
  email: string
): Promise<VerifyEmailResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al verificar el correo electrónico');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error de conexión. Intenta nuevamente.');
  }
};

/**
 * Servicio para solicitar el reset de contraseña
 * @param email - Correo electrónico del usuario
 * @returns Promise con la respuesta del servidor
 */
export const requestPasswordReset = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al procesar la solicitud');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error de conexión. Intenta nuevamente.');
  }
};

/**
 * Servicio para confirmar el reset de contraseña
 * @param token - Token de recuperación
 * @param newPassword - Nueva contraseña
 * @returns Promise con la respuesta del servidor
 */
export const confirmPasswordReset = async (
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, newPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al restablecer la contraseña');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error de conexión. Intenta nuevamente.');
  }
};

/**
 * Servicio para verificar si un teléfono existe en la base de datos
 * @param telefono - Número de teléfono a verificar
 * @returns Promise con la respuesta del servidor
 */
export const verifyPhoneExists = async (
  telefono: string
): Promise<VerifyPhoneResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/verify-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ telefono })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al verificar el número de teléfono');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error de conexión. Intenta nuevamente.');
  }
};

/**
 * Valida el formato de email
 * @param email - Email a validar
 * @returns true si el email es válido
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida el formato de teléfono peruano
 * @param phone - Teléfono a validar
 * @returns true si el teléfono es válido
 */
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^0-9]/g, '');
  // Acepta números de 9 dígitos o 11 dígitos que empiecen con 51
  return (
    cleaned.length === 9 || (cleaned.length === 11 && cleaned.startsWith('51'))
  );
};

/**
 * Valida la fortaleza de la contraseña
 * @param password - Contraseña a validar
 * @returns objeto con validación y mensaje
 */
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  message?: string;
} => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'La contraseña debe tener al menos 6 caracteres.'
    };
  }

  return { isValid: true };
};

/**
 * Valida que las contraseñas coincidan
 * @param password - Contraseña principal
 * @param confirmPassword - Confirmación de contraseña
 * @returns true si las contraseñas coinciden
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};
