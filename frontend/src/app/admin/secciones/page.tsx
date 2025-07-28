'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Seccion, Filtros, SeccionInput } from '@/types/secciones';
import { obtenerGradosPorNivel, filtrarSecciones, validarArchivoCsv, manejarErrorApi } from '@/utils/secciones';
import { obtenerSecciones, crearSeccion, actualizarSeccion, eliminarSeccion, importarSecciones } from '@/services/seccionesService';
import LoadingSpinner from '@/components/secciones/LoadingSpinner';
import EmptyState from '@/components/secciones/EmptyState';
import Breadcrumb from '@/components/secciones/Breadcrumb';
import FiltrosSection from '@/components/secciones/FiltrosSection';
import TablaSecciones from '@/components/secciones/TablaSecciones';
import Paginacion from '@/components/secciones/Paginacion';
import ModalEliminar from '@/components/secciones/modals/ModalEliminar';
import ModalCrear from '@/components/secciones/modals/ModalCrear';
import ModalEditar from '@/components/secciones/modals/ModalEditar';
import ModalCsv from '@/components/secciones/modals/ModalCsv';
import ModalConfiguracionGrados from '@/components/admin/secciones/ModalConfiguracionGrados';

const SeccionesAdminPage = () => {
  const isAuthenticated = useAuth(['admin', 'docente']);
  // Estados principales
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener secciones
  const fetchSecciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerSecciones();
      // Convertir grado de number a string para compatibilidad
      const seccionesConvertidas = data.map((seccion: any) => ({
        ...seccion,
        grado: seccion.grado.toString()
      }));
      setSecciones(seccionesConvertidas);
    } catch (err: any) {
      const errorMessage = manejarErrorApi(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para crear sección
  const createSeccion = async (seccionData: SeccionInput) => {
    try {
      setLoading(true);
      await crearSeccion(seccionData);
      await fetchSecciones();
      toast.success('Sección creada exitosamente');
    } catch (err: any) {
      const errorMessage = manejarErrorApi(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar sección
  const updateSeccion = async (id: number, seccionData: SeccionInput) => {
    try {
      setLoading(true);
      await actualizarSeccion(id, seccionData);
      await fetchSecciones();
      toast.success('Sección actualizada exitosamente');
    } catch (err: any) {
      const errorMessage = manejarErrorApi(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar sección
  const deleteSeccion = async (id: number) => {
    try {
      setLoading(true);
      await eliminarSeccion(id);
      await fetchSecciones();
      toast.success('Sección eliminada exitosamente');
    } catch (err: any) {
      const errorMessage = manejarErrorApi(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para importar CSV
  const uploadCsvSecciones = async (archivo: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('csv', archivo);
      await importarSecciones(formData);
      await fetchSecciones();
      toast.success('Secciones importadas exitosamente');
    } catch (err: any) {
      const errorMessage = manejarErrorApi(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Estados locales
  const [filtros, setFiltros] = useState<Filtros>({ nombre: '', nivel: '', grado: '' });
  const [seccionesFiltradas, setSeccionesFiltradas] = useState<Seccion[]>([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  
  // Estados de modales
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalCsv, setModalCsv] = useState(false);
  const [modalConfiguracion, setModalConfiguracion] = useState(false);
  
  // Estados de datos
  const [seccionAEliminar, setSeccionAEliminar] = useState<Seccion | null>(null);
  const [seccionEditando, setSeccionEditando] = useState<Seccion | null>(null);
  const [nuevaSeccion, setNuevaSeccion] = useState<SeccionInput>({
    nombre: '',
    nivel: '',
    grado: ''
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  
  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  
  // Estados de carga
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [loadingEditar, setLoadingEditar] = useState(false);
  const [loadingEliminar, setLoadingEliminar] = useState(false);
  const [loadingCsv, setLoadingCsv] = useState(false);
  
  // Estado para configuración de grados
  const [gradosPorNivel, setGradosPorNivel] = useState(obtenerGradosPorNivel());

  // Efectos
  useEffect(() => {
    if (isAuthenticated) {
      fetchSecciones();
    }
  }, [isAuthenticated, fetchSecciones]);

  useEffect(() => {
    const seccionesParaMostrar = busquedaRealizada 
      ? filtrarSecciones(secciones, filtros)
      : secciones;
    setSeccionesFiltradas(seccionesParaMostrar);
    setPaginaActual(1);
  }, [secciones, filtros, busquedaRealizada]);

  // Handlers de búsqueda y filtros
  const handleBuscar = () => {
    setBusquedaRealizada(true);
    const seccionesEncontradas = filtrarSecciones(secciones, filtros);
    setSeccionesFiltradas(seccionesEncontradas);
    setPaginaActual(1);
    
    if (seccionesEncontradas.length === 0 && (filtros.nombre.trim() || filtros.nivel || filtros.grado.trim())) {
      toast.error('No se encontraron secciones que coincidan con los filtros');
    } else if (seccionesEncontradas.length > 0) {
      toast.success(`Se encontraron ${seccionesEncontradas.length} sección(es)`);
    }
  };

  const handleBuscarVacio = () => {
    setBusquedaRealizada(false);
    setSeccionesFiltradas(secciones);
    setPaginaActual(1);
  };

  const handleLimpiar = () => {
    setFiltros({ nombre: '', nivel: '', grado: '' });
    setBusquedaRealizada(false);
    setSeccionesFiltradas(secciones);
    setPaginaActual(1);
    toast.success('Filtros limpiados');
  };

  // Handlers CRUD
  const handleCrearSeccion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaSeccion.nombre.trim() || !nuevaSeccion.nivel || !nuevaSeccion.grado.trim()) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    setLoadingCrear(true);
    try {
      await createSeccion(nuevaSeccion);
      setModalCrear(false);
      setNuevaSeccion({ nombre: '', nivel: '', grado: '' });
    } catch (error) {
      toast.error(manejarErrorApi(error));
    } finally {
      setLoadingCrear(false);
    }
  };

  const handleEliminarSeccion = (seccion: Seccion) => {
    setSeccionAEliminar(seccion);
    setModalEliminar(true);
  };

  const confirmarEliminarSeccion = async () => {
    if (!seccionAEliminar) return;

    setLoadingEliminar(true);
    try {
      await deleteSeccion(seccionAEliminar.id);
      setModalEliminar(false);
      setSeccionAEliminar(null);
    } catch (error) {
      toast.error(manejarErrorApi(error));
    } finally {
      setLoadingEliminar(false);
    }
  };

  const handleEditarSeccion = (seccion: Seccion) => {
    setSeccionEditando(seccion);
    setModalEditar(true);
  };

  const confirmarEditarSeccion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seccionEditando || !seccionEditando.nombre.trim() || !seccionEditando.nivel || !seccionEditando.grado.trim()) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    setLoadingEditar(true);
    try {
      await updateSeccion(seccionEditando.id, {
        nombre: seccionEditando.nombre,
        nivel: seccionEditando.nivel,
        grado: seccionEditando.grado
      });
      setModalEditar(false);
      setSeccionEditando(null);
    } catch (error) {
      toast.error(manejarErrorApi(error));
    } finally {
      setLoadingEditar(false);
    }
  };

  const handleCargarCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) {
      toast.error('Selecciona un archivo CSV');
      return;
    }

    const validacion = validarArchivoCsv(archivo);
    if (!validacion.valido) {
      toast.error(validacion.mensaje);
      return;
    }

    setLoadingCsv(true);
    try {
      await uploadCsvSecciones(archivo);
      setModalCsv(false);
      setArchivo(null);
    } catch (error) {
      toast.error(manejarErrorApi(error));
    } finally {
      setLoadingCsv(false);
    }
  };

  // Handler para configuración de grados
  const handleGuardarConfiguracion = (nuevaConfiguracion: Record<string, string[]>) => {
    setGradosPorNivel(nuevaConfiguracion);
    toast.success('Configuración de grados actualizada exitosamente');
  };

  // Cálculos de paginación
  const totalRegistros = seccionesFiltradas.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const seccionesActuales = seccionesFiltradas.slice(inicio, fin);

  const handleCambiarPagina = (pagina: number) => {
    setPaginaActual(pagina);
    // Mantener la posición actual del scroll en lugar de ir al top
  };

  if (isAuthenticated === null || (loading && secciones.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // El hook se encarga de redirigir
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar secciones</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => fetchSecciones()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Gestión de Secciones</h1>
                <p className="text-slate-100 text-lg">Administra las secciones académicas de la institución</p>
                <div className="flex items-center mt-4 space-x-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{secciones.length} Secciones Registradas</span>
                  </div>

                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setModalConfiguracion(true)}
                  className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configurar Grados
                </button>
                <button
                  onClick={() => setModalCsv(true)}
                  className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Importar CSV
                </button>
                <button
                  onClick={() => setModalCrear(true)}
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva Sección
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <FiltrosSection
          filtros={filtros}
          setFiltros={setFiltros}
          onBuscar={filtros.nombre.trim() || filtros.nivel || filtros.grado.trim() ? handleBuscar : handleBuscarVacio}
          onLimpiar={handleLimpiar}
          loading={loading}
        />

        {/* Contenido Principal */}
        {loading ? (
          <LoadingSpinner />
        ) : seccionesFiltradas.length === 0 ? (
          <EmptyState busquedaRealizada={busquedaRealizada} />
        ) : (
          <>
            <TablaSecciones
              secciones={seccionesActuales}
              onEliminar={handleEliminarSeccion}
              onEditar={handleEditarSeccion}
              loading={loading}
            />
            
            {totalPaginas > 1 && (
              <Paginacion
                paginaActual={paginaActual}
                totalRegistros={totalRegistros}
                registrosPorPagina={registrosPorPagina}
                onCambiarPagina={handleCambiarPagina}
                loading={loading}
              />
            )}
          </>
        )}
      </div>

      {/* Modales */}
      <ModalEliminar
        isOpen={modalEliminar}
        onClose={() => setModalEliminar(false)}
        seccion={seccionAEliminar}
        onConfirmar={confirmarEliminarSeccion}
        loading={loadingEliminar}
      />

      <ModalCrear
        isOpen={modalCrear}
        onClose={() => setModalCrear(false)}
        nuevaSeccion={nuevaSeccion}
        setNuevaSeccion={setNuevaSeccion}
        onSubmit={handleCrearSeccion}
        loading={loadingCrear}
        gradosPorNivel={gradosPorNivel}
      />

      <ModalEditar
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        seccion={seccionEditando}
        setSeccion={setSeccionEditando}
        onSubmit={confirmarEditarSeccion}
        loading={loadingEditar}
      />

      <ModalCsv
        isOpen={modalCsv}
        onClose={() => setModalCsv(false)}
        archivo={archivo}
        setArchivo={setArchivo}
        onSubmit={handleCargarCsv}
        loading={loadingCsv}
      />

      <ModalConfiguracionGrados
        isOpen={modalConfiguracion}
        onClose={() => setModalConfiguracion(false)}
        onGuardar={handleGuardarConfiguracion}
        configuracionActual={gradosPorNivel}
      />
    </div>
  );
};

export default SeccionesAdminPage;
