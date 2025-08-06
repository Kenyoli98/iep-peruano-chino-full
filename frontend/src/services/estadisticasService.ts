import api from './api';

export interface Estadisticas {
  totalUsuarios: number;
  totalEstudiantes: number;
  totalDocentes: number;
  totalCursos: number;
  totalSecciones: number;
  matriculasActivas: number;
  asignacionesActivas: number;
  anioAcademico: number;
  fechaActualizacion: string;
}

export interface EstadisticasResponse {
  success: boolean;
  data: Estadisticas;
  mensaje: string;
}

export const obtenerEstadisticas = async (): Promise<Estadisticas> => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.get<EstadisticasResponse>('/estadisticas', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.success) {
      return res.data.data;
    } else {
      throw new Error(res.data.mensaje || 'Error al obtener estadísticas');
    }
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    throw new Error(
      error.response?.data?.mensaje ||
        error.message ||
        'Error al conectar con el servidor'
    );
  }
};
