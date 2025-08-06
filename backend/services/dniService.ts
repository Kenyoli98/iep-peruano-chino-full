import axios, { AxiosResponse } from 'axios';
const logger = require('../utils/logger');

// Interfaces para el servicio de DNI
export interface PersonaDNI {
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
  direccion?: string | undefined;
  distrito?: string | undefined;
  provincia?: string | undefined;
  departamento?: string | undefined;
  estadoCivil?: string | undefined;
}

export interface DNIApiConfig {
  url: string;
  headers: Record<string, string>;
  enabled: boolean;
  requiresToken: boolean;
}

export interface DNIResponse {
  success: boolean;
  data?: PersonaDNI | null;
  message: string;
  source?: string;
  error?: string;
  isSimulated?: boolean;
}

export interface DNIApiRawResponse {
  success?: boolean;
  nombres?: string;
  numeroDocumento?: string;
  dni?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  ap_paterno?: string;
  ap_materno?: string;
  fechaNacimiento?: string;
  fecha_nacimiento?: string;
  sexo?: string;
  genero?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  estadoCivil?: string;
  estado_civil?: string;
  ubigeotext?: string;
  data?: any;
  [key: string]: any;
}

export interface DNIEstadisticas {
  apisDisponibles: number;
  apisHabilitadas: number;
  modoDesarrollo: boolean;
  ultimaActualizacion: string;
}

// Configuración de APIs de DNI disponibles
// NOTA: APISPeru.com ofrece plan gratuito con 2000 consultas mensuales
const API_CONFIGS: Record<string, DNIApiConfig> = {
  // APISPeru.com - Plan gratuito disponible (2000 consultas/mes)
  // Documentación: https://dniruc.apisperu.com/doc
  apisperu: {
    url: 'https://dniruc.apisperu.com/api/dni', // URL correcta según documentación oficial
    headers: {
      'Accept': 'application/json'
      // Token se pasa como query parameter, no en headers
    },
    enabled: false, // Habilitar cuando tengas el token
    requiresToken: true
  },
  // APIs.NET.PE - Requiere token de pago
  apisnetpe: {
    url: 'https://api.apis.net.pe/v2/reniec/dni',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN_HERE' // Requiere token de pago
    },
    enabled: false, // Deshabilitado - requiere token de pago
    requiresToken: true
  },
  // DNIRUC.COM - Requiere token de pago
  dniruc: {
    url: 'https://api.dniruc.com/api/search/dni',
    headers: {
      'Accept': 'application/json'
    },
    enabled: false, // Deshabilitado - requiere token de pago
    requiresToken: true
  },
  // APIDNI.COM - Requiere token de pago
  apidni: {
    url: 'https://apidni.com/api/dni',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN_HERE' // Requiere token de pago
    },
    enabled: false, // Deshabilitado - requiere token de pago
    requiresToken: true
  }
};

/**
 * Valida el formato del DNI
 * @param dni - Número de DNI
 * @returns True si el formato es válido
 */
export const validarFormatoDNI = (dni: string): boolean => {
  return /^\d{8}$/.test(dni);
};

/**
 * Consulta los datos de una persona por su DNI
 * @param dni - Número de DNI de 8 dígitos
 * @returns Datos de la persona
 */
export const consultarDNI = async (dni: string): Promise<DNIResponse> => {
  try {
    // Validar formato
    if (!validarFormatoDNI(dni)) {
      return {
        success: false,
        message: 'El DNI debe tener exactamente 8 dígitos',
        data: null
      };
    }

    logger.info(`Consultando DNI: ${dni}`);

    // Intentar con diferentes APIs hasta encontrar una que funcione
    for (const [apiName, config] of Object.entries(API_CONFIGS)) {
      if (!config.enabled) continue;
      
      try {
        logger.info(`Intentando consulta con API: ${apiName}`);
        
        let url = '';
        let requestConfig: any = {
          headers: config.headers,
          timeout: 15000 // 15 segundos de timeout
        };
        
        // Configurar URL según la API
        if (apiName === 'apisperu') {
          // APISPeru.com usa token como query parameter
          const token = process.env.APISPERU_TOKEN || 'YOUR_TOKEN_HERE';
          url = `${config.url}/${dni}?token=${token}`;
        } else {
          // Otras APIs usan numero como query parameter
          url = `${config.url}?numero=${dni}`;
        }
        
        const response: AxiosResponse<DNIApiRawResponse> = await axios.get(url, requestConfig);

        if (response.data && (response.data.success !== false || response.data.nombres)) {
          const datosFormateados = formatearRespuestaAPI(response.data, apiName);
          
          if (datosFormateados && datosFormateados.nombres) {
            logger.info(`Consulta exitosa con API: ${apiName}`);
            return {
              success: true,
              data: datosFormateados,
              message: 'Datos obtenidos exitosamente de RENIEC',
              source: apiName
            };
          }
        }
      } catch (error: any) {
        logger.warn(`Error con API ${apiName}: ${error.message}`);
        continue; // Intentar con la siguiente API
      }
    }

    // Si ninguna API funcionó, usar datos simulados como fallback
    logger.warn(`No se pudieron obtener datos reales para DNI: ${dni}, usando simulación`);
    const resultadoSimulado = await consultarDNISimulado(dni);
    return {
      ...resultadoSimulado,
      message: 'DATOS SIMULADOS: Las APIs de RENIEC requieren autenticación y pago. Para obtener datos reales, debe contratar un servicio de API de DNI.',
      isSimulated: true
    };
  } catch (error: any) {
    logger.error('Error en consultarDNI:', error);
    return {
      success: false,
      message: 'Error interno del servidor',
      data: null,
      error: error.message
    };
  }
};

/**
 * Simula una consulta a la API para desarrollo y testing
 * @param dni - Número de DNI
 * @returns Datos simulados
 */
export const consultarDNISimulado = async (dni: string): Promise<DNIResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Datos de ejemplo para diferentes DNIs
  const datosSimulados: Record<string, PersonaDNI> = {
    '12345678': {
      dni: '12345678',
      nombres: 'Juan Carlos',
      apellidoPaterno: 'García',
      apellidoMaterno: 'López',
      fechaNacimiento: '1990-05-15',
      sexo: 'M',
      direccion: 'Av. Los Olivos 123, San Isidro',
      distrito: 'San Isidro',
      provincia: 'Lima',
      departamento: 'Lima',
      estadoCivil: 'Soltero'
    },
    '87654321': {
      dni: '87654321',
      nombres: 'María Elena',
      apellidoPaterno: 'Rodríguez',
      apellidoMaterno: 'Vásquez',
      fechaNacimiento: '1985-12-03',
      sexo: 'F',
      direccion: 'Jr. Las Flores 456, Miraflores',
      distrito: 'Miraflores',
      provincia: 'Lima',
      departamento: 'Lima',
      estadoCivil: 'Casada'
    },
    '11111111': {
      dni: '11111111',
      nombres: 'Carlos Alberto',
      apellidoPaterno: 'Mendoza',
      apellidoMaterno: 'Silva',
      fechaNacimiento: '1992-08-20',
      sexo: 'M',
      direccion: 'Calle Los Pinos 789, Surco',
      distrito: 'Santiago de Surco',
      provincia: 'Lima',
      departamento: 'Lima',
      estadoCivil: 'Soltero'
    },
    '22222222': {
      dni: '22222222',
      nombres: 'Ana Lucía',
      apellidoPaterno: 'Torres',
      apellidoMaterno: 'Ramírez',
      fechaNacimiento: '1988-11-12',
      sexo: 'F',
      direccion: 'Av. Universitaria 321, Los Olivos',
      distrito: 'Los Olivos',
      provincia: 'Lima',
      departamento: 'Lima',
      estadoCivil: 'Soltera'
    }
  };

  const persona = datosSimulados[dni];
  
  if (persona) {
    return {
      success: true,
      data: persona,
      message: 'Datos obtenidos exitosamente (simulación para desarrollo)',
      source: 'simulacion'
    };
  } else {
    // Generar datos más realistas basados en el DNI
    const nombres = ['Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Miguel', 'Rosa', 'Juan', 'Elena'];
    const apellidosP = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Cruz', 'Torres'];
    const apellidosM = ['Vásquez', 'Morales', 'Jiménez', 'Herrera', 'Medina', 'Castro', 'Vargas', 'Ortega', 'Ramos', 'Silva'];
    const distritos = ['San Isidro', 'Miraflores', 'Surco', 'La Molina', 'San Borja', 'Jesús María', 'Magdalena', 'Pueblo Libre', 'Lince', 'Barranco'];
    
    // Usar el DNI como semilla para generar datos consistentes
    const seed = parseInt(dni.substring(0, 2)) || 0;
    const nombre = nombres[seed % nombres.length] || 'Juan';
    const apellidoP = apellidosP[parseInt(dni.substring(2, 4)) % apellidosP.length] || 'García';
    const apellidoM = apellidosM[parseInt(dni.substring(4, 6)) % apellidosM.length] || 'López';
    const distrito = distritos[parseInt(dni.substring(6, 8)) % distritos.length] || 'Lima';
    const sexo: 'M' | 'F' = parseInt(dni.charAt(7)) % 2 === 0 ? 'M' : 'F';
    
    // Generar fecha de nacimiento realista (entre 1970 y 2005)
    const año = 1970 + (parseInt(dni.substring(0, 2)) % 36);
    const mes = String(1 + (parseInt(dni.substring(2, 4)) % 12)).padStart(2, '0');
    const día = String(1 + (parseInt(dni.substring(4, 6)) % 28)).padStart(2, '0');
    
    const distritoSeguro = distrito || 'Lima';
    
    return {
      success: true,
      data: {
        dni: dni,
        nombres: nombre,
        apellidoPaterno: apellidoP,
        apellidoMaterno: apellidoM,
        fechaNacimiento: `${año}-${mes}-${día}`,
        sexo: sexo,
        direccion: `Av. Los ${distritoSeguro.split(' ')[0]} ${100 + (parseInt(dni.substring(0, 3)) % 900)}`,
        distrito: distrito,
        provincia: 'Lima',
        departamento: 'Lima',
        estadoCivil: parseInt(dni.charAt(0)) % 3 === 0 ? 'Casado' : 'Soltero'
      },
      message: 'Datos simulados para desarrollo - Generados dinámicamente',
      source: 'simulacion_dinamica'
    };
  }
};

/**
 * Formatea la respuesta de diferentes APIs a un formato estándar
 * @param data - Datos de la API
 * @param apiName - Nombre de la API
 * @returns Datos formateados
 */
const formatearRespuestaAPI = (data: DNIApiRawResponse, apiName: string): PersonaDNI | null => {
  try {
    switch (apiName) {
      case 'apisperu':
        // Formato para APISPeru.com según documentación oficial
        // Respuesta: {"dni": "string", "nombres": "string", "apellidoPaterno": "string", "apellidoMaterno": "string", "codVerifica": "string"}
        return {
          dni: data.dni || '',
          nombres: data.nombres || '',
          apellidoPaterno: data.apellidoPaterno || '',
          apellidoMaterno: data.apellidoMaterno || '',
          fechaNacimiento: data.fechaNacimiento || '', // APISPeru no incluye fecha de nacimiento
          sexo: 'M' as 'M' | 'F', // APISPeru no incluye sexo, usar valor por defecto
          direccion: undefined, // APISPeru no incluye dirección
          distrito: undefined,
          provincia: undefined,
          departamento: undefined,
          estadoCivil: undefined
        };
      
      case 'apisnetpe':
        // Formato para APIs.NET.PE
        return {
          dni: data.numeroDocumento || data.dni || '',
          nombres: data.nombres || '',
          apellidoPaterno: data.apellidoPaterno || '',
          apellidoMaterno: data.apellidoMaterno || '',
          fechaNacimiento: data.fechaNacimiento || '',
          sexo: (data.sexo || (data.genero === 'MASCULINO' ? 'M' : 'F')) as 'M' | 'F',
          direccion: data.direccion || undefined,
          distrito: data.distrito || undefined,
          provincia: data.provincia || undefined,
          departamento: data.departamento || undefined,
          estadoCivil: data.estadoCivil || undefined
        };
      
      case 'dniruc':
        // Formato para DNIRUC.COM
        const dnirucData = data.data || data;
        return {
          dni: dnirucData.dni || '',
          nombres: dnirucData.nombres || '',
          apellidoPaterno: dnirucData.ap_paterno || '',
          apellidoMaterno: dnirucData.ap_materno || '',
          fechaNacimiento: dnirucData.fecha_nacimiento || '',
          sexo: (dnirucData.sexo === 'Masculino' ? 'M' : 'F') as 'M' | 'F',
          direccion: dnirucData.direccion || undefined,
          distrito: dnirucData.ubigeotext ? dnirucData.ubigeotext.split(' - ')[2] || undefined : undefined,
          provincia: dnirucData.ubigeotext ? dnirucData.ubigeotext.split(' - ')[1] || undefined : undefined,
          departamento: dnirucData.ubigeotext ? dnirucData.ubigeotext.split(' - ')[0] || undefined : undefined,
          estadoCivil: dnirucData.estadoCivil || undefined
        };
      
      case 'apidni':
        // Formato para APIDNI.COM
        const apidniData = data.data || data;
        return {
          dni: apidniData.dni || '',
          nombres: apidniData.nombres || '',
          apellidoPaterno: apidniData.apellido_paterno || '',
          apellidoMaterno: apidniData.apellido_materno || '',
          fechaNacimiento: apidniData.fecha_nacimiento || '',
          sexo: apidniData.genero as 'M' | 'F',
          direccion: apidniData.direccion || undefined,
          distrito: apidniData.distrito || undefined,
          provincia: apidniData.provincia || undefined,
          departamento: apidniData.departamento || undefined,
          estadoCivil: apidniData.estado_civil || undefined
        };
      
      default:
        // Formato genérico para APIs no específicas
        return {
          dni: data.dni || data.numeroDocumento || data.numero || '',
          nombres: data.nombres || '',
          apellidoPaterno: data.apellidoPaterno || data.apellido_paterno || data.ap_paterno || '',
          apellidoMaterno: data.apellidoMaterno || data.apellido_materno || data.ap_materno || '',
          fechaNacimiento: data.fechaNacimiento || data.fecha_nacimiento || '',
          sexo: (data.sexo || data.genero) as 'M' | 'F',
          direccion: data.direccion || undefined,
          distrito: data.distrito || undefined,
          provincia: data.provincia || undefined,
          departamento: data.departamento || undefined,
          estadoCivil: data.estadoCivil || data.estado_civil || undefined
        };
    }
  } catch (error: any) {
    logger.error('Error formateando respuesta API:', error);
    return null;
  }
};

/**
 * Obtiene estadísticas de uso del servicio de DNI
 * @returns Estadísticas del servicio
 */
export const obtenerEstadisticas = (): DNIEstadisticas => {
  return {
    apisDisponibles: Object.keys(API_CONFIGS).length,
    apisHabilitadas: Object.values(API_CONFIGS).filter(api => api.enabled).length,
    modoDesarrollo: true, // Cambiar a false en producción
    ultimaActualizacion: new Date().toISOString()
  };
};

// Exportaciones por defecto para compatibilidad
export default {
  consultarDNI,
  validarFormatoDNI,
  obtenerEstadisticas,
  consultarDNISimulado
};