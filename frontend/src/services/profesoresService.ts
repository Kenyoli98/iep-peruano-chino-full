import api from './api';

export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

export const obtenerProfesores = async (): Promise<Profesor[]> => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.get('/usuarios', {
      params: { rol: 'profesor' }, // Filtrar solo usuarios con rol profesor
      headers: { Authorization: `Bearer ${token}` }
    });

    // Log para depuración
    console.log('Respuesta de profesores:', res.data);

    // Asegurar que siempre devolvemos un array y solo usuarios con rol profesor
    if (!res.data) return [];
    
    const usuarios = Array.isArray(res.data) ? res.data : res.data.usuarios || [];
    // Filtro adicional por si acaso
    const profesores = usuarios.filter((user: Profesor) => user.rol === 'profesor');
    
    return profesores;
  } catch (error: any) {
    console.error('Error en obtenerProfesores:', error);
    if (error.response?.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
    throw new Error('Error al obtener la lista de profesores');
  }
}; 