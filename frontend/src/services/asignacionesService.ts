// Colocar en src/app/services/asignacionesService.ts
import api from './api';

export interface Asignacion {
  id: number;
  profesorId: number;
  cursoId: number;
  seccionId: number;
  anioAcademico: number;
  curso: {
    id: number;
    nombre: string;
  };
  seccion: {
    id: number;
    nombre: string;
    nivel: string;
    grado: number;
  };
  horarios?: Array<{
    id: number;
    dia: string;
    horaInicio: string;
    horaFin: string;
  }>;
}

export interface Horario {
  id?: number;
  dia: string;
  horaInicio: string;
  horaFin: string;
  asignacionId: number;
}

export const obtenerAsignaciones = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.get<Asignacion[]>('/asignaciones', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    console.error('Error al obtener asignaciones:', error);
    throw new Error(
      error.response?.data?.message || 'Error al obtener asignaciones'
    );
  }
};

export const obtenerAsignacionesPorProfesor = async (profesorId: number) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.get<Asignacion[]>(
      `/asignaciones/profesor/${profesorId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return res.data;
  } catch (error: any) {
    console.error('Error al obtener asignaciones del profesor:', error);
    throw new Error(
      error.response?.data?.message ||
        'Error al obtener asignaciones del profesor'
    );
  }
};

export const crearAsignacion = async (data: {
  profesorId: string;
  cursoId: string;
  seccionId: string;
  anioAcademico: string;
}) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.post('/asignaciones', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    console.error('Error al crear asignación:', error);
    throw new Error(
      error.response?.data?.message || 'Error al crear la asignación'
    );
  }
};

export const actualizarAsignacion = async (
  id: number,
  data: {
    cursoId: string;
    seccionId: string;
    anioAcademico: string;
  }
) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.put(`/asignaciones/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    console.error('Error al actualizar asignación:', error);
    throw new Error(
      error.response?.data?.message || 'Error al actualizar la asignación'
    );
  }
};

export const eliminarAsignacion = async (id: number) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.delete(`/asignaciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    console.error('Error al eliminar asignación:', error);
    throw new Error(
      error.response?.data?.message || 'Error al eliminar la asignación'
    );
  }
};

export const agregarHorario = async (
  asignacionId: number,
  data: {
    dia: string;
    horaInicio: string;
    horaFin: string;
  }
) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.post(`/asignaciones/${asignacionId}/horarios`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    console.error('Error al agregar horario:', error);
    throw new Error(
      error.response?.data?.message || 'Error al agregar el horario'
    );
  }
};

export const eliminarHorario = async (
  asignacionId: number,
  horarioId: number
) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.delete(
      `/asignaciones/${asignacionId}/horarios/${horarioId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return res.data;
  } catch (error: any) {
    console.error('Error al eliminar horario:', error);
    throw new Error(
      error.response?.data?.message || 'Error al eliminar el horario'
    );
  }
};
