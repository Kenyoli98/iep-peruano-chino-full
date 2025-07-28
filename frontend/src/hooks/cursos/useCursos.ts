import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  obtenerCursos,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  importarCursos
} from '@/services/cursosService';
import { Curso, CursoInput } from '@/types/cursos';

export const useCursos = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCursos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerCursos();
      setCursos(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al cargar cursos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCurso = useCallback(async (cursoData: CursoInput) => {
    try {
      setLoading(true);
      await crearCurso(cursoData);
      await fetchCursos(); // Recargar la lista
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al crear curso';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCursos]);

  const updateCurso = useCallback(async (id: number, cursoData: CursoInput) => {
    try {
      setLoading(true);
      await actualizarCurso(id, cursoData);
      await fetchCursos(); // Recargar la lista
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al actualizar curso';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCursos]);

  const deleteCurso = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await eliminarCurso(id);
      await fetchCursos(); // Recargar la lista
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al eliminar curso';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCursos]);

  const uploadCsvCursos = useCallback(async (archivo: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('csv', archivo);
      await importarCursos(formData);
      await fetchCursos(); // Recargar la lista
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al importar cursos';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCursos]);

  return {
    cursos,
    loading,
    error,
    fetchCursos,
    createCurso,
    updateCurso,
    deleteCurso,
    uploadCsvCursos
  };
};