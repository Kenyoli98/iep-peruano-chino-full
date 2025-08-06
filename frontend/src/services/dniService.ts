import api from './api';

// Interfaz para la respuesta de la API de DNI
export interface DNIResponse {
  success: boolean;
  data?: {
    dni: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento?: string;
    sexo?: 'M' | 'F';
    direccion?: string;
    ubigeo?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    estadoCivil?: string;
    restriccion?: string;
  };
  message: string;
  error?: string;
}

// Configuración de la API del backend
const API_CONFIG = {
  backend: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    endpoint: '/api/dni/consultar',
    enabled: true
  }
};

/**
 * Consulta los datos de una persona por su DNI usando la API del backend
 * @param dni - Número de DNI de 8 dígitos
 * @returns Promise con los datos de la persona
 */
export const consultarDNI = async (dni: string): Promise<DNIResponse> => {
  try {
    // Validar formato del DNI
    if (!validarFormatoDNI(dni)) {
      return {
        success: false,
        message: 'El DNI debe tener exactamente 8 dígitos'
      };
    }

    // Obtener token de autenticación del localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        message: 'No se encontró token de autenticación'
      };
    }

    // Realizar consulta a la API del backend
    const response = await fetch(`${API_CONFIG.backend.baseURL}${API_CONFIG.backend.endpoint}/${dni}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: 'Token de autenticación inválido'
        };
      }
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        message: data.message || 'Datos obtenidos exitosamente',
        data: data.data
      };
    } else {
      return {
        success: false,
        message: data.message || 'DNI no encontrado'
      };
    }
  } catch (error) {
    console.error('Error consultando DNI:', error);
    return {
      success: false,
      message: 'Error de conexión. Intente nuevamente.',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};



/**
 * Valida si un DNI tiene el formato correcto
 * @param dni - Número de DNI a validar
 * @returns true si el formato es válido
 */
export const validarFormatoDNI = (dni: string): boolean => {
  return /^\d{8}$/.test(dni);
};

/**
 * Formatea los datos obtenidos de la API para el formulario de registro
 * @param dniData - Datos obtenidos de la API
 * @returns Objeto con los datos formateados para el formulario
 */
export const formatearDatosParaFormulario = (dniData: DNIResponse['data']) => {
  if (!dniData) return null;

  return {
    nombre: dniData.nombres || '',
    apellido: `${dniData.apellidoPaterno || ''} ${dniData.apellidoMaterno || ''}`.trim(),
    dni: dniData.dni || '',
    sexo: dniData.sexo || 'M',
    direccion: dniData.direccion || '',
    fechaNacimiento: dniData.fechaNacimiento || '',
    // Nacionalidad por defecto para DNIs peruanos
    nacionalidad: 'Peruana'
  };
};

/**
 * Hook personalizado para manejar la consulta de DNI
 * @returns Funciones y estado para manejar consultas de DNI
 */
export const useDNIConsulta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DNIResponse['data'] | null>(null);

  const consultarDNIAsync = async (dni: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await consultarDNI(dni);
      
      if (response.success && response.data) {
        setData(response.data);
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const limpiarDatos = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    error,
    data,
    consultarDNI: consultarDNIAsync,
    limpiarDatos
  };
};

// Importar useState para el hook
import { useState } from 'react';