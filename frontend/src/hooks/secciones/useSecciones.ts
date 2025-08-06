import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  obtenerSecciones,
  crearSeccion,
  actualizarSeccion,
  eliminarSeccion,
  importarSecciones,
  Seccion as SeccionService
} from '@/services/seccionesService';
import { Seccion, SeccionInput } from '@/types/secciones';

export const useSecciones = () => {
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSecciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerSecciones();
      // Convertir grado de number a string para compatibilidad con tipos
      const seccionesConvertidas = data.map((seccion: SeccionService) => ({
        ...seccion,
        grado: seccion.grado.toString()
      }));
      setSecciones(seccionesConvertidas);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || 'Error al cargar secciones';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSeccion = useCallback(
    async (seccionData: SeccionInput) => {
      try {
        setLoading(true);
        await crearSeccion(seccionData);
        await fetchSecciones(); // Recargar la lista
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Error al crear sección';
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchSecciones]
  );

  const updateSeccion = useCallback(
    async (id: number, seccionData: SeccionInput) => {
      try {
        setLoading(true);
        await actualizarSeccion(id, seccionData);
        await fetchSecciones(); // Recargar la lista
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Error al actualizar sección';
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchSecciones]
  );

  const deleteSeccion = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        await eliminarSeccion(id);
        await fetchSecciones(); // Recargar la lista
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Error al eliminar sección';
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchSecciones]
  );

  const uploadCsvSecciones = useCallback(
    async (archivo: File) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('csv', archivo);
        await importarSecciones(formData);
        await fetchSecciones(); // Recargar la lista
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Error al importar secciones';
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchSecciones]
  );

  return {
    secciones,
    loading,
    error,
    fetchSecciones,
    createSeccion,
    updateSeccion,
    deleteSeccion,
    uploadCsvSecciones
  };
};
