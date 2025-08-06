'use client';

import React, { useState, useEffect } from 'react';
import { useCursos } from '@/hooks/cursos/useCursos';
import { useAuth } from '@/hooks/useAuth';
import { Curso, Filtros, CursoInput } from '@/types/cursos';
import {
  filtrarCursos,
  validarArchivoCsv,
  manejarErrorApi
} from '@/utils/cursos';
import LoadingSpinner from '@/components/cursos/LoadingSpinner';
import EmptyState from '@/components/cursos/EmptyState';
import Breadcrumb from '@/components/cursos/Breadcrumb';
import FiltrosSection from '@/components/cursos/FiltrosSection';
import TablaCursos from '@/components/cursos/TablaCursos';
import Paginacion from '@/components/cursos/Paginacion';
import ModalEliminar from '@/components/cursos/modals/ModalEliminar';
import ModalCrear from '@/components/cursos/modals/ModalCrear';
import ModalEditar from '@/components/cursos/modals/ModalEditar';
import ModalCsv from '@/components/cursos/modals/ModalCsv';
import styles from '@/styles/cursos.module.css';
import { toast } from 'react-hot-toast';

const CursosAdminPage = () => {
  const isAuthenticated = useAuth(['admin', 'docente']);
  const {
    cursos,
    loading,
    error,
    fetchCursos,
    createCurso,
    updateCurso,
    deleteCurso,
    uploadCsvCursos
  } = useCursos();

  // Estados locales
  const [filtros, setFiltros] = useState<Filtros>({ nombre: '' });
  const [cursosFiltrados, setCursosFiltrados] = useState<Curso[]>([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Estados de modales
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalCsv, setModalCsv] = useState(false);

  // Estados de datos
  const [cursoAEliminar, setCursoAEliminar] = useState<Curso | null>(null);
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);
  const [nuevoCurso, setNuevoCurso] = useState<CursoInput>({
    nombre: '',
    descripcion: ''
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

  // Efectos
  useEffect(() => {
    if (isAuthenticated) {
      fetchCursos();
    }
  }, [isAuthenticated, fetchCursos]);

  useEffect(() => {
    const cursosParaMostrar = busquedaRealizada
      ? filtrarCursos(cursos, filtros)
      : cursos;
    setCursosFiltrados(cursosParaMostrar);
    setPaginaActual(1);
  }, [cursos, filtros, busquedaRealizada]);

  // Handlers de búsqueda y filtros
  const handleBuscar = () => {
    setBusquedaRealizada(true);
    const cursosEncontrados = filtrarCursos(cursos, filtros);
    setCursosFiltrados(cursosEncontrados);
    setPaginaActual(1);

    if (cursosEncontrados.length === 0 && filtros.nombre.trim()) {
      toast.error(
        `No se encontraron cursos que coincidan con "${filtros.nombre}"`
      );
    } else if (cursosEncontrados.length > 0) {
      toast.success(`Se encontraron ${cursosEncontrados.length} curso(s)`);
    }
  };

  const handleBuscarVacio = () => {
    setBusquedaRealizada(false);
    setCursosFiltrados(cursos);
    setPaginaActual(1);
  };

  const handleLimpiar = () => {
    setFiltros({ nombre: '' });
    setBusquedaRealizada(false);
    setCursosFiltrados(cursos);
    setPaginaActual(1);
    toast.success('Filtros limpiados');
  };

  // Handlers CRUD
  const handleCrearCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCurso.nombre.trim()) {
      toast.error('El nombre del curso es obligatorio');
      return;
    }

    setLoadingCrear(true);
    try {
      await createCurso(nuevoCurso);
      setModalCrear(false);
      setNuevoCurso({ nombre: '', descripcion: '' });
      toast.success('Curso creado exitosamente');
      await fetchCursos();
    } catch (error) {
      toast.error(manejarErrorApi(error));
    } finally {
      setLoadingCrear(false);
    }
  };

  const handleEliminarCurso = (curso: Curso) => {
    setCursoAEliminar(curso);
    setModalEliminar(true);
  };

  const confirmarEliminarCurso = async () => {
    if (!cursoAEliminar) return;

    setLoadingEliminar(true);
    try {
      await deleteCurso(cursoAEliminar.id);
      setModalEliminar(false);
      setCursoAEliminar(null);
      toast.success('Curso eliminado exitosamente');
      await fetchCursos();
    } catch (error) {
      toast.error(manejarErrorApi(error));
    } finally {
      setLoadingEliminar(false);
    }
  };

  const handleEditarCurso = (curso: Curso) => {
    setCursoEditando(curso);
    setModalEditar(true);
  };

  const confirmarEditarCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoEditando || !cursoEditando.nombre.trim()) {
      toast.error('El nombre del curso es obligatorio');
      return;
    }

    setLoadingEditar(true);
    try {
      await updateCurso(cursoEditando.id, {
        nombre: cursoEditando.nombre,
        descripcion: cursoEditando.descripcion
      });
      setModalEditar(false);
      setCursoEditando(null);
      toast.success('Curso actualizado exitosamente');
      await fetchCursos();
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
      await uploadCsvCursos(archivo);
      setModalCsv(false);
      setArchivo(null);
      toast.success('Cursos importados exitosamente');
      await fetchCursos();
    } catch (error) {
      toast.error(manejarErrorApi(error));
    } finally {
      setLoadingCsv(false);
    }
  };

  // Cálculos de paginación
  const totalRegistros = cursosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const cursosActuales = cursosFiltrados.slice(inicio, fin);

  const handleCambiarPagina = (pagina: number) => {
    setPaginaActual(pagina);
    // Mantener la posición actual del scroll en lugar de ir al top
  };

  if (isAuthenticated === null || (loading && cursos.length === 0)) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${styles.cursosContainer}`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
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
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${styles.cursosContainer}`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center py-16'>
            <div className='mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg'>
              <svg
                className='w-12 h-12 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Error al cargar cursos
            </h3>
            <p className='text-gray-500 mb-6'>{error}</p>
            <button
              onClick={() => fetchCursos()}
              className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${styles.cursosContainer}`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Header */}
        <div
          className={`${styles.headerGradient} bg-blue-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden`}
        >
          <div className='relative z-10'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
              <div className='mb-6 md:mb-0'>
                <h1 className='text-3xl md:text-4xl font-bold mb-2'>
                  Gestión de Cursos
                </h1>
                <p className='text-slate-100 text-lg'>
                  Administra el catálogo académico de la institución
                </p>
                <div className='flex items-center mt-4 space-x-6'>
                  <div className='flex items-center'>
                    <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-2'>
                      <svg
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                    <span className='text-sm font-medium'>
                      {cursos.length} Cursos Registrados
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-2'>
                      <svg
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-sm font-medium'>
                      Gestión Completa
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={() => setModalCsv(true)}
                  className='inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
                    />
                  </svg>
                  Importar CSV
                </button>
                <button
                  onClick={() => setModalCrear(true)}
                  className='inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                  Nuevo Curso
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <FiltrosSection
          filtros={filtros}
          setFiltros={setFiltros}
          onBuscar={filtros.nombre.trim() ? handleBuscar : handleBuscarVacio}
          onLimpiar={handleLimpiar}
          loading={loading}
        />

        {/* Contenido Principal */}
        {loading ? (
          <LoadingSpinner />
        ) : cursosFiltrados.length === 0 ? (
          <EmptyState busquedaRealizada={busquedaRealizada} filtros={filtros} />
        ) : (
          <>
            <TablaCursos
              cursos={cursosActuales}
              onEliminar={handleEliminarCurso}
              onEditar={handleEditarCurso}
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
        curso={cursoAEliminar}
        onConfirmar={confirmarEliminarCurso}
        loading={loadingEliminar}
      />

      <ModalCrear
        isOpen={modalCrear}
        onClose={() => setModalCrear(false)}
        nuevoCurso={nuevoCurso}
        setNuevoCurso={setNuevoCurso}
        onSubmit={handleCrearCurso}
        loading={loadingCrear}
      />

      <ModalEditar
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        curso={cursoEditando}
        setCurso={setCursoEditando}
        onSubmit={confirmarEditarCurso}
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
    </div>
  );
};

export default CursosAdminPage;
