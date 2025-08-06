import api from './api';

export interface Seccion {
  id: number;
  nombre: string;
  nivel: string;
  grado: string;
}

export interface SeccionesResponse {
  secciones: Seccion[];
  total: number;
}

export interface SeccionesFiltros {
  nombre?: string;
  nivel?: string;
  grado?: string;
  page?: number;
  limit?: number;
}

// Función auxiliar para ordenar secciones
const ordenarSecciones = (secciones: Seccion[]): Seccion[] => {
  return secciones.sort((a, b) => {
    // Primero por nivel
    if (a.nivel !== b.nivel) {
      return a.nivel.localeCompare(b.nivel);
    }
    // Luego por grado (convertir a número para ordenamiento correcto)
    const gradoA = parseInt(a.grado.toString(), 10);
    const gradoB = parseInt(b.grado.toString(), 10);
    if (gradoA !== gradoB) {
      return gradoA - gradoB;
    }
    // Finalmente por nombre
    return a.nombre.localeCompare(b.nombre);
  });
};

export const obtenerSecciones = async (
  params: SeccionesFiltros = {}
): Promise<Seccion[]> => {
  try {
    const token = localStorage.getItem('token');

    // Intentar obtener todas las secciones sin paginación
    const res = await api.get<SeccionesResponse>('/secciones', {
      params: {
        ...params,
        limit: 1000, // Un número grande para asegurar obtener todas
        page: 1,
        sinPaginacion: true // Indicador para el backend
      },
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Respuesta completa de secciones:', res.data);

    let secciones: Seccion[] = [];

    // Manejar diferentes formatos de respuesta
    if (res.data?.secciones && Array.isArray(res.data.secciones)) {
      console.log('Número de secciones obtenidas:', res.data.secciones.length);
      secciones = res.data.secciones;
    } else if (Array.isArray(res.data)) {
      console.log(
        'Número de secciones obtenidas (array directo):',
        res.data.length
      );
      secciones = res.data;
    } else {
      console.warn('Formato de respuesta inesperado:', res.data);
      return [];
    }

    // Aplicar ordenamiento en el frontend para asegurar consistencia
    return ordenarSecciones(secciones);
  } catch (error: any) {
    console.error(
      'Error detallado al obtener secciones:',
      error.response || error
    );
    if (error.response?.status === 401) {
      throw new Error(
        'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      );
    }
    throw new Error(
      'Error al obtener la lista de secciones: ' +
        (error.response?.data?.message || error.message)
    );
  }
};

export const obtenerSeccionesPaginadas = async (
  params: SeccionesFiltros = {}
): Promise<SeccionesResponse> => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.get<SeccionesResponse>('/secciones', {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error(
        'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      );
    }
    throw new Error('Error al obtener la lista de secciones');
  }
};

export const crearSeccion = async (seccion: {
  nombre: string;
  nivel: string;
  grado: string;
}) => {
  try {
    const token = localStorage.getItem('token');
    // Enviar todos los datos como string según requerimiento
    const seccionData = {
      nombre: seccion.nombre,
      nivel: seccion.nivel,
      grado: seccion.grado // Mantener como string
    };
    const res = await api.post('/secciones', seccionData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error(
        'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      );
    }
    throw new Error(
      'Error al crear la sección: ' +
        (error.response?.data?.error ||
          error.response?.data?.message ||
          error.message)
    );
  }
};

export const actualizarSeccion = async (
  id: number,
  seccion: { nombre: string; nivel: string; grado: string }
) => {
  try {
    const token = localStorage.getItem('token');
    // Enviar todos los datos como string según requerimiento
    const seccionData = {
      nombre: seccion.nombre,
      nivel: seccion.nivel,
      grado: seccion.grado // Mantener como string
    };
    const res = await api.put(`/secciones/${id}`, seccionData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error(
        'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      );
    }
    throw new Error(
      'Error al actualizar la sección: ' +
        (error.response?.data?.error ||
          error.response?.data?.message ||
          error.message)
    );
  }
};

export const eliminarSeccion = async (id: number) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.delete(`/secciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error(
        'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      );
    }
    throw new Error('Error al eliminar la sección');
  }
};

export const importarSecciones = async (formData: FormData) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.post('/secciones/importar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error(
        'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      );
    }
    throw new Error('Error al importar las secciones');
  }
};
