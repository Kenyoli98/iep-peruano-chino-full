// Colocar en src/app/admin/asignaciones/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  obtenerAsignaciones,
  crearAsignacion,
  obtenerAsignacionesPorProfesor,
} from '@/services/asignacionesService';
import { obtenerProfesores, type Profesor } from '@/services/profesoresService';
import { obtenerCursos, type Curso } from '@/services/cursosService';
import { obtenerSecciones, type Seccion, type SeccionesResponse } from '@/services/seccionesService';
import AsignacionesModal, { HorarioProfesor } from '@/components/asignaciones/modals/ModalAsignaciones';
import Modal from '@/components/ui/modal';

interface AsignacionMultiple {
  cursoId: string;
  seccionId: string;
}

export default function AsignacionesAdminPage() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<Profesor | null>(null);
  const [asignacionesProfesor, setAsignacionesProfesor] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHorarioOpen, setModalHorarioOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busquedaProfesor, setBusquedaProfesor] = useState('');

  useEffect(() => {
    fetchDatosIniciales();
  }, []);

  const fetchDatosIniciales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando carga de datos...');
      
      const [profesoresData, cursosData, seccionesResponse] = await Promise.all([
        obtenerProfesores(),
        obtenerCursos(),
        obtenerSecciones()
      ]);

      console.log('Datos recibidos:', {
        profesores: profesoresData,
        cursos: cursosData,
        secciones: seccionesResponse
      });

      setProfesores(Array.isArray(profesoresData) ? profesoresData : []);
      setCursos(Array.isArray(cursosData) ? cursosData : []);
      const seccionesData = seccionesResponse as Seccion[] | SeccionesResponse;
      setSecciones(Array.isArray(seccionesData) ? seccionesData : seccionesData.secciones);

      console.log('Datos procesados:', {
        profesoresCount: profesoresData?.length || 0,
        cursosCount: cursosData?.length || 0,
        seccionesCount: Array.isArray(seccionesData) ? seccionesData.length : seccionesData.secciones?.length || 0
      });
    } catch (error: any) {
      console.error('Error al obtener datos iniciales:', error);
      setError(error.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarProfesor = async (profesor: Profesor) => {
    try {
      setLoading(true);
      setError(null);
      setProfesorSeleccionado(profesor);
      const asignaciones = await obtenerAsignacionesPorProfesor(profesor.id);
      setAsignacionesProfesor(asignaciones);
      setModalOpen(true);
    } catch (error: any) {
      console.error('Error al obtener asignaciones del profesor:', error);
      setError(error.message || 'Error al cargar las asignaciones del profesor');
    } finally {
      setLoading(false);
    }
  };

  const handleVerHorario = async (profesor: Profesor) => {
    try {
      setLoading(true);
      setError(null);
      setProfesorSeleccionado(profesor);
      const asignaciones = await obtenerAsignacionesPorProfesor(profesor.id);
      setAsignacionesProfesor(asignaciones);
      setModalHorarioOpen(true);
    } catch (error: any) {
      console.error('Error al obtener asignaciones del profesor:', error);
      setError(error.message || 'Error al cargar las asignaciones del profesor');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarAsignaciones = async (asignaciones: AsignacionMultiple[], anioAcademico: string) => {
    if (!profesorSeleccionado) return;

    try {
      setLoading(true);
      setError(null);

      // Crear todas las nuevas asignaciones
      await Promise.all(
        asignaciones.map(asig =>
          crearAsignacion({
            profesorId: profesorSeleccionado.id.toString(),
            cursoId: asig.cursoId,
            seccionId: asig.seccionId,
            anioAcademico
          })
        )
      );

      // Recargar las asignaciones del profesor
      const asignacionesActualizadas = await obtenerAsignacionesPorProfesor(profesorSeleccionado.id);
      setAsignacionesProfesor(asignacionesActualizadas);
    } catch (error: any) {
      console.error('Error al guardar asignaciones:', error);
      throw error; // Propagar el error al componente modal
    } finally {
      setLoading(false);
    }
  };

  const profesoresFiltrados = profesores.filter(profesor => 
    `${profesor.nombre} ${profesor.apellido}`.toLowerCase().includes(busquedaProfesor.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 text-sm text-gray-600 flex items-center space-x-2">
        <span className="text-gray-800 font-semibold">Académico</span>
        <span>/</span>
        <span className="text-gray-800 font-semibold">Gestión de Asignaciones</span>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar profesor..."
            value={busquedaProfesor}
            onChange={(e) => setBusquedaProfesor(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Lista de profesores */}
      <div className="bg-white shadow-md rounded-lg">
        {loading && profesores.length === 0 ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : profesoresFiltrados.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No se encontraron profesores.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {profesoresFiltrados.map((profesor) => (
              <div
                key={profesor.id}
                className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {profesor.nombre} {profesor.apellido}
                    </h3>
                    <p className="text-sm text-gray-500">{profesor.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerHorario(profesor)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Horario
                    </button>
                    <button
                      onClick={() => handleSeleccionarProfesor(profesor)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Asignaciones
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de asignaciones */}
      {profesorSeleccionado && (
        <AsignacionesModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          profesor={profesorSeleccionado}
          asignaciones={asignacionesProfesor}
          setAsignaciones={setAsignacionesProfesor}
          cursos={cursos}
          secciones={secciones}
          onGuardarAsignaciones={handleGuardarAsignaciones}
          loading={loading}
          error={error}
        />
      )}

      {/* Modal de horario */}
      {profesorSeleccionado && (
        <Modal
          isOpen={modalHorarioOpen}
          onClose={() => setModalHorarioOpen(false)}
          title={`Horario de ${profesorSeleccionado.nombre} ${profesorSeleccionado.apellido}`}
          size="full"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {profesorSeleccionado.nombre} {profesorSeleccionado.apellido}
                </h2>
                <p className="text-gray-500 mt-1">{profesorSeleccionado.email}</p>
              </div>
              <button
                onClick={() => {
                  // Mostrar el contenido de impresión antes de imprimir
                  const printContent = document.getElementById('print-content');
                  if (printContent) {
                    printContent.style.display = 'block';
                    window.print();
                    // Ocultar después de imprimir
                    setTimeout(() => {
                      printContent.style.display = 'none';
                    }, 100);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium flex items-center gap-2"
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir Horario
              </button>
              </div>
            <div className="print:hidden">
              <HorarioProfesor asignaciones={asignacionesProfesor} />
              </div>
            <div className="flex justify-end mt-8 print:hidden">
                <button
                onClick={() => setModalHorarioOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                Cerrar
                </button>
              </div>
          </div>
        </Modal>
      )}

      {/* Contenido de impresión */}
      <div id="print-content" className="print-content" style={{ display: 'none' }}>
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Horario del Profesor
            </h1>
            <h2 className="text-xl font-semibold text-gray-700">
              {profesorSeleccionado?.nombre} {profesorSeleccionado?.apellido}
            </h2>
            <p className="text-gray-600">{profesorSeleccionado?.email}</p>
          </div>
          <HorarioProfesor asignaciones={asignacionesProfesor} />
        </div>
      </div>
    </div>
  );
}
