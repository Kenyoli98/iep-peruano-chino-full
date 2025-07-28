'use client';

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import Combobox from '@/components/ui/combobox';
import type { Profesor } from '@/services/profesoresService';
import type { Curso } from '@/services/cursosService';
import type { Seccion } from '@/services/seccionesService';
import {
  actualizarAsignacion,
  eliminarAsignacion,
  agregarHorario,
  eliminarHorario,
  obtenerAsignacionesPorProfesor,
  type Asignacion
} from '@/services/asignacionesService';
import React from 'react';
import { 
  PlusIcon, 
  CalendarIcon, 
  ClockIcon, 
  PencilIcon, 
  TrashIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface AsignacionMultiple {
  cursoId: string;
  seccionId: string;
}

interface AsignacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profesor: Profesor;
  asignaciones: Asignacion[];
  setAsignaciones: (asignaciones: Asignacion[]) => void;
  cursos: Curso[];
  secciones: Seccion[];
  onGuardarAsignaciones: (asignaciones: AsignacionMultiple[], anioAcademico: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

// Componente de horario semanal mejorado
export function HorarioProfesor({ asignaciones }: { asignaciones: Asignacion[] }) {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
  const generarSlotsTiempo = () => {
    const slots = [];
    for (let hora = 7; hora <= 17; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        if (hora === 17 && minuto > 0) break;
        const horaStr = hora.toString().padStart(2, '0');
        const minutoStr = minuto.toString().padStart(2, '0');
        slots.push(`${horaStr}:${minutoStr}`);
      }
    }
    return slots;
  };

  const slotsTiempo = generarSlotsTiempo();

  const eventos = asignaciones.flatMap(asignacion => 
    asignacion.horarios?.map(horario => ({
      id: `${asignacion.id}-${horario.id}`,
      nombre: asignacion.curso?.nombre || '',
      seccion: `${asignacion.seccion?.grado}° ${asignacion.seccion?.nombre}`,
      nivel: asignacion.seccion?.nivel || '',
      startTime: horario.horaInicio,
      endTime: horario.horaFin,
      dia: horario.dia,
      asignacion
    })) || []
  );

  const horaAMinutos = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  };

  const calcularPosicionEvento = (hora: string) => {
    const horaMinutos = horaAMinutos(hora);
    const horaInicio = horaAMinutos('07:00');
    const minutosDesdeInicio = horaMinutos - horaInicio;
    return (minutosDesdeInicio / 30) * 60; // 60px por slot de 30 minutos
  };

  const calcularAlturaEvento = (startTime: string, endTime: string) => {
    const startMinutos = horaAMinutos(startTime);
    const endMinutos = horaAMinutos(endTime);
    const duracionMinutos = endMinutos - startMinutos;
    return Math.max((duracionMinutos / 30) * 60, 40); // Mínimo 40px
  };

  const formatearHora = (horaStr: string) => {
    const [horas, minutos] = horaStr.split(':');
    const horaNum = parseInt(horas);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    const hora12 = horaNum > 12 ? horaNum - 12 : horaNum === 0 ? 12 : horaNum;
    return `${hora12}:${minutos} ${ampm}`;
  };

  const getColorByNivel = (nivel: string) => {
    switch (nivel) {
      case 'Inicial': return 'bg-green-500 border-green-600';
      case 'Primaria': return 'bg-blue-500 border-blue-600';
      case 'Secundaria': return 'bg-purple-500 border-purple-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          Horario Semanal
        </h3>
      </div>
      
      <div className="overflow-auto max-h-[70vh]">
        <div className="grid grid-cols-6 gap-0 min-w-[1200px]">
          {/* Header */}
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-3 z-10">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Hora
            </div>
          </div>
          {dias.map(dia => (
            <div key={dia} className="sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-3 z-10">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                {dia}
              </div>
            </div>
          ))}

          {/* Filas de tiempo */}
          {slotsTiempo.map((slot, index) => (
            <React.Fragment key={slot}>
              <div className="border-r border-gray-100 px-4 py-3 bg-gray-50" style={{ height: '60px' }}>
                <div className="text-xs font-medium text-gray-700">
                  {formatearHora(slot)}
                </div>
              </div>

              {dias.map(dia => (
                <div 
                  key={dia} 
                  className="border-r border-gray-100 relative" 
                  style={{ height: '60px' }}
                >
                  {index % 2 === 0 && <div className="absolute inset-0 bg-gray-50/30"></div>}
                  
                  {eventos
                    .filter(evento => evento.dia === dia)
                    .map(evento => {
                      const top = calcularPosicionEvento(evento.startTime);
                      const height = calcularAlturaEvento(evento.startTime, evento.endTime);
                      
                      return (
                        <div
                          key={evento.id}
                          className={`absolute left-1 right-1 ${getColorByNivel(evento.nivel)} text-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer z-20 border-l-4`}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            minHeight: '40px'
                          }}
                        >
                          <div className="font-medium text-xs mb-1 truncate">
                            {evento.nombre}
                          </div>
                          <div className="text-xs opacity-90 mb-1">
                            {evento.seccion}
                          </div>
                          <div className="text-xs opacity-80 font-medium">
                            {formatearHora(evento.startTime)} - {formatearHora(evento.endTime)}
                          </div>
                        </div>
                      );
                    })}
                
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AsignacionesModal({
  isOpen,
  onClose,
  profesor,
  asignaciones,
  setAsignaciones,
  cursos,
  secciones,
  onGuardarAsignaciones,
  loading = false,
  error = null
}: AsignacionesModalProps) {
  const [showNuevaAsignacion, setShowNuevaAsignacion] = useState(false);
  const [showEditarAsignacion, setShowEditarAsignacion] = useState(false);
  const [showEliminarAsignacion, setShowEliminarAsignacion] = useState(false);
  const [showAgregarHorario, setShowAgregarHorario] = useState(false);
  const [showHorarioCompleto, setShowHorarioCompleto] = useState(false);
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState<Asignacion | null>(null);
  const [anioAcademico, setAnioAcademico] = useState('2024');
  
  const [nuevaAsignacion, setNuevaAsignacion] = useState<AsignacionMultiple>({
    cursoId: '',
    seccionId: ''
  });
  
  const [nuevoHorario, setNuevoHorario] = useState({
    dia: '',
    horaInicio: '',
    horaFin: ''
  });

  const handleEditarAsignacion = (asignacion: Asignacion) => {
    setAsignacionSeleccionada(asignacion);
    setNuevaAsignacion({
      cursoId: asignacion.curso?.id?.toString() || '',
      seccionId: asignacion.seccion?.id?.toString() || ''
    });
    setAnioAcademico(asignacion.anioAcademico?.toString() || '2024');
    setShowEditarAsignacion(true);
  };

  const handleEliminarAsignacion = (asignacion: Asignacion) => {
    setAsignacionSeleccionada(asignacion);
    setShowEliminarAsignacion(true);
  };

  const handleAgregarHorario = (asignacion: Asignacion) => {
    setAsignacionSeleccionada(asignacion);
    setNuevoHorario({ dia: '', horaInicio: '', horaFin: '' });
    setShowAgregarHorario(true);
  };

  const handleEliminarHorario = async (asignacionId: number, horarioId: number) => {
    try {
      await eliminarHorario(asignacionId, horarioId);
      const asignacionesActualizadas = await obtenerAsignacionesPorProfesor(profesor.id);
      setAsignaciones(asignacionesActualizadas);
    } catch (error: any) {
      console.error('Error al eliminar horario:', error);
    }
  };

  const handleConfirmarEliminar = async () => {
    if (!asignacionSeleccionada) return;
    try {
      await eliminarAsignacion(asignacionSeleccionada.id);
      const asignacionesActualizadas = await obtenerAsignacionesPorProfesor(profesor.id);
      setAsignaciones(asignacionesActualizadas);
      setShowEliminarAsignacion(false);
    } catch (error: any) {
      console.error('Error al eliminar asignación:', error);
    }
  };

  const handleGuardarHorario = async () => {
    if (!asignacionSeleccionada) return;
    try {
      await agregarHorario(asignacionSeleccionada.id, {
        dia: nuevoHorario.dia,
        horaInicio: nuevoHorario.horaInicio,
        horaFin: nuevoHorario.horaFin
      });
      const asignacionesActualizadas = await obtenerAsignacionesPorProfesor(profesor.id);
      setAsignaciones(asignacionesActualizadas);
      setShowAgregarHorario(false);
    } catch (error: any) {
      console.error('Error al agregar horario:', error);
    }
  };

  const handleActualizarAsignacion = async () => {
    if (!asignacionSeleccionada) return;
    try {
      await actualizarAsignacion(asignacionSeleccionada.id, {
        cursoId: nuevaAsignacion.cursoId,
        seccionId: nuevaAsignacion.seccionId,
        anioAcademico: anioAcademico
      });
      const asignacionesActualizadas = await obtenerAsignacionesPorProfesor(profesor.id);
      setAsignaciones(asignacionesActualizadas);
      setShowEditarAsignacion(false);
    } catch (error: any) {
      console.error('Error al actualizar asignación:', error);
    }
  };

  const handleCrearAsignacion = async () => {
    try {
      await onGuardarAsignaciones([nuevaAsignacion], anioAcademico);
      setShowNuevaAsignacion(false);
      setNuevaAsignacion({ cursoId: '', seccionId: '' });
    } catch (error: any) {
      console.error('Error al crear asignación:', error);
    }
  };

  const diasSemana = [
    { id: 'Lunes', value: 'Lunes', label: 'Lunes' },
    { id: 'Martes', value: 'Martes', label: 'Martes' },
    { id: 'Miércoles', value: 'Miércoles', label: 'Miércoles' },
    { id: 'Jueves', value: 'Jueves', label: 'Jueves' },
    { id: 'Viernes', value: 'Viernes', label: 'Viernes' }
  ];

  const cursosOptions = cursos.map(curso => ({
    id: curso.id.toString(),
    value: curso.id.toString(),
    label: curso.nombre,
    description: `Código: ${curso.nombre || 'N/A'}`
  }));

  const seccionesOptions = secciones.map(seccion => ({
    id: seccion.id.toString(),
    value: seccion.id.toString(),
    label: `${seccion.nivel} - ${seccion.grado}° - ${seccion.nombre}`,
    description: `Nivel: ${seccion.nivel} | Grado: ${seccion.grado}°`
  }));

  const getStatsData = () => {
    const totalAsignaciones = asignaciones.length;
    const totalHorarios = asignaciones.reduce((acc, asignacion) => acc + (asignacion.horarios?.length || 0), 0);
    const nivelesUnicos = new Set(asignaciones.map(a => a.seccion?.nivel).filter(Boolean)).size;
    
    return { totalAsignaciones, totalHorarios, nivelesUnicos };
  };

  const { totalAsignaciones, totalHorarios, nivelesUnicos } = getStatsData();



  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={`Gestión de Asignaciones - ${profesor.nombre} ${profesor.apellido}`} 
        size="full"
      >
        <div className="h-full flex flex-col">
          {/* Header con estadísticas */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profesor.nombre} {profesor.apellido}
                  </h2>
                  <p className="text-sm text-gray-600">Gestión de Asignaciones Académicas</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNuevaAsignacion(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Nueva Asignación
                </button>
                <button
                  onClick={() => setShowHorarioCompleto(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Ver Horario
                </button>
              </div>
            </div>
            
            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpenIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalAsignaciones}</p>
                    <p className="text-sm text-gray-600">Asignaciones</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalHorarios}</p>
                    <p className="text-sm text-gray-600">Horarios</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{nivelesUnicos}</p>
                    <p className="text-sm text-gray-600">Niveles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 overflow-auto p-6">
            {asignaciones.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <BookOpenIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sin asignaciones registradas
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  No se han encontrado asignaciones para este profesor. Comienza creando la primera asignación.
                </p>
                <button
                  onClick={() => setShowNuevaAsignacion(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <PlusIcon className="h-5 w-5" />
                  Crear Primera Asignación
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Asignaciones por nivel educativo */}
                {[{display: 'Inicial', values: ['INICIAL', 'Inicial']}, {display: 'Primaria', values: ['PRIMARIA', 'Primaria']}, {display: 'Secundaria', values: ['SECUNDARIA', 'Secundaria']}].map(({display, values}) => {
                  const asignacionesNivel = asignaciones
                    .filter(asignacion => {
                      const nivelAsignacion = asignacion.seccion?.nivel;
                      return nivelAsignacion && values.includes(nivelAsignacion);
                    })
                    .sort((a, b) => {
                      // Ordenar por grado primero
                      const gradoA = a.seccion?.grado || 0;
                      const gradoB = b.seccion?.grado || 0;
                      if (gradoA !== gradoB) return gradoA - gradoB;
                      
                      // Si el grado es igual, ordenar por nombre de sección
                      const seccionA = a.seccion?.nombre || '';
                      const seccionB = b.seccion?.nombre || '';
                      return seccionA.localeCompare(seccionB);
                    });
                  
                  if (asignacionesNivel.length === 0) return null;
                  
                  const getColorByNivel = (nivel: string) => {
                    switch (nivel) {
                      case 'Inicial': return 'from-green-500 to-emerald-600';
                      case 'Primaria': return 'from-blue-500 to-indigo-600';
                      case 'Secundaria': return 'from-purple-500 to-violet-600';
                      default: return 'from-gray-500 to-gray-600';
                    }
                  };
                  
                  return (
                    <div key={display} className="mb-8">
                      {/* Título del nivel educativo */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                          {display}
                        </h3>
                      </div>
                      
                      {/* Grid de asignaciones */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {asignacionesNivel.map((asignacion) => (
                          <div 
                            key={asignacion.id} 
                            className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden group"
                          >
                            {/* Header de la card */}
                            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                              <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {asignacion.curso?.nombre || 'Curso no disponible'}
                              </h4>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span className="font-medium">{asignacion.seccion?.grado}°</span>
                                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                  <span className="font-medium">Sección {asignacion.seccion?.nombre}</span>
                                </div>
                                <span className="text-gray-500 font-medium">
                                  {asignacion.anioAcademico}
                                </span>
                              </div>
                            </div>

                            {/* Contenido de la card */}
                            <div className="p-4">
                              {/* Horarios */}
                              {asignacion.horarios && asignacion.horarios.length > 0 ? (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <ClockIcon className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs font-medium text-gray-700">Horarios</span>
                                  </div>
                                  <div className="space-y-2">
                                    {asignacion.horarios.slice(0, 2).map((horario) => (
                                      <div key={horario.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                          <span className="text-xs font-medium text-gray-800">{horario.dia}</span>
                                          <span className="text-xs text-gray-600 ml-2">
                                            {horario.horaInicio} - {horario.horaFin}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => handleEliminarHorario(asignacion.id, horario.id)}
                                          className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                                          title="Eliminar horario"
                                        >
                                          <TrashIcon className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))}
                                    {asignacion.horarios.length > 2 && (
                                      <div className="text-xs text-gray-500 text-center py-1 bg-gray-50 rounded-lg">
                                        +{asignacion.horarios.length - 2} horario{asignacion.horarios.length - 2 !== 1 ? 's' : ''} más
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="mb-4 p-3 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                  <ClockIcon className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs text-gray-500">Sin horarios asignados</p>
                                </div>
                              )}

                              {/* Botones de acción */}
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => handleEditarAsignacion(asignacion)}
                                    className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <PencilIcon className="h-3 w-3" />
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleEliminarAsignacion(asignacion)}
                                    className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                  >
                                    <TrashIcon className="h-3 w-3" />
                                    Eliminar
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleAgregarHorario(asignacion)}
                                  className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <PlusIcon className="h-3 w-3" />
                                  Agregar Horario
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {/* Sección para asignaciones sin nivel definido o con niveles no estándar */}
                {(() => {
                  const asignacionesSinNivel = asignaciones
                    .filter(asignacion => {
                      const nivelAsignacion = asignacion.seccion?.nivel;
                      if (!nivelAsignacion) return true;
                      
                      const nivelesEstandar = ['INICIAL', 'Inicial', 'PRIMARIA', 'Primaria', 'SECUNDARIA', 'Secundaria'];
                      return !nivelesEstandar.includes(nivelAsignacion);
                    })
                    .sort((a, b) => {
                      // Ordenar por grado primero
                      const gradoA = a.seccion?.grado || 0;
                      const gradoB = b.seccion?.grado || 0;
                      if (gradoA !== gradoB) return gradoA - gradoB;
                      
                      // Si el grado es igual, ordenar por nombre de sección
                      const seccionA = a.seccion?.nombre || '';
                      const seccionB = b.seccion?.nombre || '';
                      return seccionA.localeCompare(seccionB);
                    });
                  
                  if (asignacionesSinNivel.length === 0) return null;
                  
                  return (
                    <div className="mb-8">
                      {/* Título del nivel educativo */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">
                          Sin Nivel / Otros
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {asignacionesSinNivel.map((asignacion) => (
                          <div 
                            key={asignacion.id} 
                            className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden group"
                          >
                            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                              <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {asignacion.curso?.nombre || 'Curso no disponible'}
                              </h4>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span className="font-medium">{asignacion.seccion?.grado || 'N/A'}°</span>
                                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                  <span className="font-medium">Sección {asignacion.seccion?.nombre || 'N/A'}</span>
                                </div>
                                <span className="text-gray-500 font-medium">
                                  {asignacion.anioAcademico}
                                </span>
                              </div>
                              <div className="mt-1">
                                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                  Nivel: {asignacion.seccion?.nivel || 'No definido'}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              {asignacion.horarios && asignacion.horarios.length > 0 ? (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <ClockIcon className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs font-medium text-gray-700">Horarios</span>
                                  </div>
                                  <div className="space-y-2">
                                    {asignacion.horarios.slice(0, 2).map((horario) => (
                                      <div key={horario.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                          <span className="text-xs font-medium text-gray-800">{horario.dia}</span>
                                          <span className="text-xs text-gray-600 ml-2">
                                            {horario.horaInicio} - {horario.horaFin}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => handleEliminarHorario(asignacion.id, horario.id)}
                                          className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                                          title="Eliminar horario"
                                        >
                                          <TrashIcon className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))}
                                    {asignacion.horarios.length > 2 && (
                                      <div className="text-xs text-gray-500 text-center py-1 bg-gray-50 rounded-lg">
                                        +{asignacion.horarios.length - 2} horario{asignacion.horarios.length - 2 !== 1 ? 's' : ''} más
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="mb-4 p-3 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                  <ClockIcon className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs text-gray-500">Sin horarios asignados</p>
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => handleEditarAsignacion(asignacion)}
                                    className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <PencilIcon className="h-3 w-3" />
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleEliminarAsignacion(asignacion)}
                                    className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                  >
                                    <TrashIcon className="h-3 w-3" />
                                    Eliminar
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleAgregarHorario(asignacion)}
                                  className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <PlusIcon className="h-3 w-3" />
                                  Agregar Horario
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Mostrar errores */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-red-600 text-xs font-bold">!</span>
                  <div>
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal Nueva Asignación */}
      <Modal
        isOpen={showNuevaAsignacion}
        onClose={() => setShowNuevaAsignacion(false)}
        title="Nueva Asignación"
        size="lg"
      >
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <Combobox
                options={cursosOptions}
                value={nuevaAsignacion.cursoId}
                onChange={(value) => setNuevaAsignacion(prev => ({ ...prev, cursoId: value }))}
                placeholder="Seleccionar curso"
                label="Curso"
                required
              />
            </div>

            <div>
              <Combobox
                options={seccionesOptions}
                value={nuevaAsignacion.seccionId}
                onChange={(value) => setNuevaAsignacion(prev => ({ ...prev, seccionId: value }))}
                placeholder="Seleccionar sección"
                label="Sección"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año Académico <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={anioAcademico}
                onChange={(e) => setAnioAcademico(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="2024"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={() => setShowNuevaAsignacion(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleCrearAsignacion}
              disabled={loading || !nuevaAsignacion.cursoId || !nuevaAsignacion.seccionId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Creando...' : 'Crear Asignación'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Editar Asignación */}
      <Modal
        isOpen={showEditarAsignacion}
        onClose={() => setShowEditarAsignacion(false)}
        title="Editar Asignación"
        size="lg"
      >
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <Combobox
                options={cursosOptions}
                value={nuevaAsignacion.cursoId}
                onChange={(value) => setNuevaAsignacion(prev => ({ ...prev, cursoId: value }))}
                placeholder="Seleccionar curso"
                label="Curso"
                required
              />
            </div>

            <div>
              <Combobox
                options={seccionesOptions}
                value={nuevaAsignacion.seccionId}
                onChange={(value) => setNuevaAsignacion(prev => ({ ...prev, seccionId: value }))}
                placeholder="Seleccionar sección"
                label="Sección"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año Académico <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={anioAcademico}
                onChange={(e) => setAnioAcademico(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="2024"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={() => setShowEditarAsignacion(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleActualizarAsignacion}
              disabled={loading || !nuevaAsignacion.cursoId || !nuevaAsignacion.seccionId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Actualizando...' : 'Actualizar Asignación'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Eliminar Asignación */}
      <Modal
        isOpen={showEliminarAsignacion}
        onClose={() => setShowEliminarAsignacion(false)}
        title="Eliminar Asignación"
        size="lg"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Confirmar eliminación?
              </h3>
              <p className="text-gray-700 mb-4">
                Estás a punto de eliminar la asignación de{' '}
                <span className="font-semibold text-gray-900">
                  {asignacionSeleccionada?.curso?.nombre}
                </span>{' '}
                en la sección{' '}
                <span className="font-semibold text-gray-900">
                  {asignacionSeleccionada?.seccion?.grado}° {asignacionSeleccionada?.seccion?.nombre}
                </span>.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Advertencia:</strong> Esta acción no se puede deshacer y eliminará todos los horarios asociados.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={() => setShowEliminarAsignacion(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarEliminar}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Eliminar Asignación
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Agregar Horario */}
      <Modal
        isOpen={showAgregarHorario}
        onClose={() => setShowAgregarHorario(false)}
        title="Agregar Horario"
        size="lg"
      >
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <Combobox
                options={diasSemana}
                value={nuevoHorario.dia}
                onChange={(value) => setNuevoHorario(prev => ({ ...prev, dia: value }))}
                placeholder="Seleccionar día"
                label="Día de la semana"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={nuevoHorario.horaInicio}
                  onChange={(e) => setNuevoHorario(prev => ({ ...prev, horaInicio: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={nuevoHorario.horaFin}
                  onChange={(e) => setNuevoHorario(prev => ({ ...prev, horaFin: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={() => setShowAgregarHorario(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardarHorario}
              disabled={!nuevoHorario.dia || !nuevoHorario.horaInicio || !nuevoHorario.horaFin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Guardar Horario
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Horario Completo */}
      <Modal
        isOpen={showHorarioCompleto}
        onClose={() => setShowHorarioCompleto(false)}
        title={`Horario Completo - ${profesor.nombre} ${profesor.apellido}`}
        size="full"
      >
        <div className="p-6">
          <HorarioProfesor asignaciones={asignaciones} />
        </div>
      </Modal>
    </>
  );
}