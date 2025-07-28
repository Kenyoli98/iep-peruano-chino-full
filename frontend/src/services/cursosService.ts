import api from './api';

export interface Curso {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface CursosResponse {
  total: number;
  cursos: Curso[];
}

export const obtenerCursos = async (): Promise<Curso[]> => {
  try {
    const token = localStorage.getItem('token');
    
    // Intentar obtener todos los cursos sin paginación
    const res = await api.get<CursosResponse>('/cursos', {
      params: { 
        limit: 1000,  // Un número grande para asegurar obtener todos
        page: 1,
        sinPaginacion: true // Indicador para el backend
      },
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Respuesta completa de cursos:', res.data);

    // Manejar diferentes formatos de respuesta
    if (res.data?.cursos && Array.isArray(res.data.cursos)) {
      console.log('Número de cursos obtenidos:', res.data.cursos.length);
      return res.data.cursos;
    }

    if (Array.isArray(res.data)) {
      console.log('Número de cursos obtenidos (array directo):', res.data.length);
    return res.data;
    }

    console.warn('Formato de respuesta inesperado:', res.data);
    return [];
  } catch (error: any) {
    console.error('Error detallado al obtener cursos:', error.response || error);
    if (error.response?.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
    throw new Error('Error al obtener la lista de cursos: ' + (error.response?.data?.message || error.message));
  }
};

export const crearCurso = async (curso: any) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.post('/cursos', curso, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
    throw new Error('Error al crear el curso');
  }
};

export const actualizarCurso = async (id: number, curso: any) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.put(`/cursos/${id}`, curso, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
    throw new Error('Error al actualizar el curso');
  }
};

export const eliminarCurso = async (id: number) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.delete(`/cursos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
    throw new Error('Error al eliminar el curso');
  }
};

export const importarCursos = async (formData: FormData) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.post('/cursos/importar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
    throw new Error('Error al importar los cursos');
  }
};




