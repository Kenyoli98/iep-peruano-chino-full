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
  onGuardarAsignaciones: (
    asignaciones: AsignacionMultiple[],
    anioAcademico: string
  ) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

// Componente de horario semanal mejorado
export function HorarioProfesor({
  asignaciones
}: {
  asignaciones: Asignacion[];
}) {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Función auxiliar para convertir hora a minutos
  const horaAMinutos = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  };

  // Generar eventos desde las asignaciones
  const eventos = asignaciones.flatMap(
    asignacion =>
      asignacion.horarios?.map(horario => ({
        id: `${asignacion.id}-${horario.id}`,
        nombre: asignacion.curso?.nombre || '',
        seccion: `${asignacion.seccion?.grado}° ${asignacion.seccion?.nombre}`,
        nivel: asignacion.seccion?.nivel || '',
        anioAcademico: asignacion.anioAcademico || '',
        startTime: horario.horaInicio,
        endTime: horario.horaFin,
        dia: horario.dia,
        asignacion
      })) || []
  );

  const generarSlotsTiempo = () => {
    const slots = [];

    // Verificar si hay eventos que empiecen antes de 7:30
    const tieneEventosAntes730 = eventos.some(evento => {
      const horaMinutos = horaAMinutos(evento.startTime);
      return horaMinutos < horaAMinutos('07:30');
    });

    // Horario escolar: 7:00 AM (si es necesario) o 7:30 AM a 2:00 PM
    const horaInicio = tieneEventosAntes730 ? 7 : 7;
    const minutoInicio = tieneEventosAntes730 ? 0 : 30;

    for (let hora = horaInicio; hora <= 14; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        // Empezar desde la hora/minuto determinado
        if (hora === horaInicio && minuto < minutoInicio) continue;
        // Terminar en 2:00 PM (14:00)
        if (hora === 14 && minuto > 0) break;

        const horaStr = hora.toString().padStart(2, '0');
        const minutoStr = minuto.toString().padStart(2, '0');
        slots.push(`${horaStr}:${minutoStr}`);
      }
    }
    return slots;
  };

  const slotsTiempo = generarSlotsTiempo();

  const calcularPosicionEvento = (hora: string) => {
    const horaMinutos = horaAMinutos(hora);

    // Determinar la hora de inicio del grid basada en los eventos
    const tieneEventosAntes730 = eventos.some(evento => {
      const eventoMinutos = horaAMinutos(evento.startTime);
      return eventoMinutos < horaAMinutos('07:30');
    });

    const horaInicioGrid = tieneEventosAntes730 ? '07:00' : '07:30';
    const horaInicio = horaAMinutos(horaInicioGrid);
    const minutosDesdeInicio = horaMinutos - horaInicio;

    // Calcular la posición relativa a las celdas de tiempo
    // Cada slot de 30 minutos tiene 60px de altura en vista normal
    // Los estilos CSS se encargan de ajustar para impresión
    return Math.max(0, (minutosDesdeInicio / 30) * 60);
  };

  const calcularAlturaEvento = (startTime: string, endTime: string) => {
    const startMinutos = horaAMinutos(startTime);
    const endMinutos = horaAMinutos(endTime);
    const duracionMinutos = endMinutos - startMinutos;
    return Math.max((duracionMinutos / 30) * 60, 60); // Mínimo 60px para ajustarse a slots de 30 minutos
  };

  const formatearHora = (horaStr: string) => {
    const [horas, minutos] = horaStr.split(':');
    const horaNum = parseInt(horas);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    const hora12 = horaNum > 12 ? horaNum - 12 : horaNum === 0 ? 12 : horaNum;
    return `${hora12}:${minutos} ${ampm}`;
  };

  // Función para generar colores pasteles únicos basados en el nombre del curso
  const getColorByCurso = (nombreCurso: string) => {
    const colores = [
      'bg-red-200 border-red-300 text-red-800',
      'bg-blue-200 border-blue-300 text-blue-800',
      'bg-green-200 border-green-300 text-green-800',
      'bg-yellow-200 border-yellow-300 text-yellow-800',
      'bg-purple-200 border-purple-300 text-purple-800',
      'bg-pink-200 border-pink-300 text-pink-800',
      'bg-indigo-200 border-indigo-300 text-indigo-800',
      'bg-orange-200 border-orange-300 text-orange-800',
      'bg-teal-200 border-teal-300 text-teal-800',
      'bg-cyan-200 border-cyan-300 text-cyan-800',
      'bg-emerald-200 border-emerald-300 text-emerald-800',
      'bg-violet-200 border-violet-300 text-violet-800',
      'bg-fuchsia-200 border-fuchsia-300 text-fuchsia-800',
      'bg-rose-200 border-rose-300 text-rose-800',
      'bg-amber-200 border-amber-300 text-amber-800',
      'bg-lime-200 border-lime-300 text-lime-800'
    ];

    // Generar un hash simple del nombre del curso
    let hash = 0;
    for (let i = 0; i < nombreCurso.length; i++) {
      const char = nombreCurso.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convertir a 32bit integer
    }

    // Usar el hash para seleccionar un color de forma consistente
    const index = Math.abs(hash) % colores.length;
    return colores[index];
  };

  return (
    <div className='horario-profesor bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
      <div className='overflow-auto max-h-[70vh]'>
        <div className='grid grid-cols-6 gap-0 min-w-[1200px] relative'>
          {/* Header */}
          <div className='sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-3 z-30'>
            <div className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>
              Hora
            </div>
          </div>
          {dias.map(dia => (
            <div
              key={dia}
              className='sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-3 z-30'
            >
              <div className='text-xs font-semibold text-gray-600 uppercase tracking-wider text-center'>
                {dia}
              </div>
            </div>
          ))}

          {/* Filas de tiempo */}
          {slotsTiempo.map((slot, index) => (
            <React.Fragment key={slot}>
              <div
                className='border-r border-gray-100 px-4 py-3 bg-gray-50'
                style={{ height: '60px' }}
              >
                <div className='text-xs font-medium text-gray-700'>
                  {formatearHora(slot)}
                </div>
              </div>

              {dias.map(dia => (
                <div
                  key={dia}
                  className='border-r border-gray-100 relative'
                  style={{ height: '60px' }}
                >
                  {index % 2 === 0 && (
                    <div className='absolute inset-0 bg-gray-50/30'></div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}

          {/* Eventos posicionados de forma absoluta */}
          {dias.map(dia => (
            <div
              key={`eventos-${dia}`}
              className='absolute eventos-container'
              style={{
                left: `calc(${(dias.indexOf(dia) + 1) * (100 / 6)}% + 1px)`,
                width: `calc(${100 / 6}% - 2px)`,
                top: '49px', // Offset para el header sticky
                height: 'calc(100% - 49px)',
                pointerEvents: 'none',
                zIndex: 20
              }}
            >
              {eventos
                .filter(evento => evento.dia === dia)
                .map(evento => {
                  const top = calcularPosicionEvento(evento.startTime);
                  const height = calcularAlturaEvento(
                    evento.startTime,
                    evento.endTime
                  );

                  return (
                    <div
                      key={evento.id}
                      className={`absolute left-1 right-1 ${getColorByCurso(evento.nombre)} rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 backdrop-blur-sm`}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        minHeight: '60px',
                        pointerEvents: 'auto'
                      }}
                    >
                      <div className='h-full flex flex-col justify-center items-center text-center'>
                        <div className='font-semibold text-xs mb-1 truncate w-full leading-tight'>
                          {evento.nivel} - {evento.seccion}
                        </div>
                        <div className='text-xs opacity-80 font-medium leading-tight'>
                          {formatearHora(evento.startTime)} -{' '}
                          {formatearHora(evento.endTime)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda de colores por curso */}
      {eventos.length > 0 && (
        <div className='bg-gray-50 px-6 py-4 border-t border-gray-200'>
          <h4 className='text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2'>
            <BookOpenIcon className='h-4 w-4' />
            Leyenda de Cursos
          </h4>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {Array.from(new Set(eventos.map(evento => evento.nombre))).map(
              nombreCurso => (
                <div
                  key={nombreCurso}
                  className='flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm'
                >
                  <div
                    className={`w-5 h-5 rounded-lg ${getColorByCurso(nombreCurso)} flex-shrink-0 border-2`}
                  ></div>
                  <span className='text-sm font-medium text-gray-700 truncate'>
                    {nombreCurso}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
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
  const [asignacionSeleccionada, setAsignacionSeleccionada] =
    useState<Asignacion | null>(null);
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

  const handleEliminarHorario = async (
    asignacionId: number,
    horarioId: number
  ) => {
    try {
      await eliminarHorario(asignacionId, horarioId);
      const asignacionesActualizadas = await obtenerAsignacionesPorProfesor(
        profesor.id
      );
      setAsignaciones(asignacionesActualizadas);
    } catch (error: any) {
      console.error('Error al eliminar horario:', error);
    }
  };

  const handleConfirmarEliminar = async () => {
    if (!asignacionSeleccionada) return;
    try {
      await eliminarAsignacion(asignacionSeleccionada.id);
      const asignacionesActualizadas = await obtenerAsignacionesPorProfesor(
        profesor.id
      );
      setAsignaciones(asignacionesActualizadas);
      setShowEliminarAsignacion(false);
    } catch (error: any) {
      console.error('Error al eliminar asignación:', error);
    }
  };

  const [errorHorario, setErrorHorario] = useState<string | null>(null);
  const [warningHorario, setWarningHorario] = useState<string | null>(null);
  const [validacionTiempoReal, setValidacionTiempoReal] = useState<{
    horaInicio: string | null;
    horaFin: string | null;
    duracion: string | null;
  }>({ horaInicio: null, horaFin: null, duracion: null });

  // Función auxiliar para validar horarios en el frontend
  const validarHorarioFrontend = (
    horaInicio: string,
    horaFin: string
  ): string | null => {
    if (!horaInicio || !horaFin) {
      return 'Debe seleccionar hora de inicio y fin.';
    }

    const horaAMinutos = (hora: string) => {
      const [h, m] = hora.split(':').map(Number);
      return h * 60 + m;
    };

    const inicioMinutos = horaAMinutos(horaInicio);
    const finMinutos = horaAMinutos(horaFin);
    const limiteInicio = horaAMinutos('07:30');
    const limiteFin = horaAMinutos('14:00');

    if (inicioMinutos < limiteInicio) {
      return 'La hora de inicio no puede ser antes de las 7:30 AM.';
    }

    if (finMinutos > limiteFin) {
      return 'La hora de fin no puede ser después de las 2:00 PM.';
    }

    if (inicioMinutos >= finMinutos) {
      return 'La hora de inicio debe ser menor que la hora de fin.';
    }

    const duracionMinutos = finMinutos - inicioMinutos;
    if (duracionMinutos < 30) {
      return 'La duración mínima de una clase debe ser de 30 minutos.';
    }

    return null;
  };

  // Validación en tiempo real para horarios
  const validarTiempoReal = (horaInicio: string, horaFin: string) => {
    const validaciones: {
      horaInicio: string | null;
      horaFin: string | null;
      duracion: string | null;
    } = { horaInicio: null, horaFin: null, duracion: null };

    if (horaInicio) {
      const horaAMinutos = (hora: string) => {
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
      };

      const inicioMinutos = horaAMinutos(horaInicio);
      const limiteInicio = horaAMinutos('07:30');

      if (inicioMinutos < limiteInicio) {
        validaciones.horaInicio = 'Debe ser después de las 7:30 AM';
      }
    }

    if (horaFin) {
      const horaAMinutos = (hora: string) => {
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
      };

      const finMinutos = horaAMinutos(horaFin);
      const limiteFin = horaAMinutos('14:00');

      if (finMinutos > limiteFin) {
        validaciones.horaFin = 'Debe ser antes de las 2:00 PM';
      }
    }

    if (horaInicio && horaFin) {
      const horaAMinutos = (hora: string) => {
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
      };

      const inicioMinutos = horaAMinutos(horaInicio);
      const finMinutos = horaAMinutos(horaFin);
      const duracionMinutos = finMinutos - inicioMinutos;

      if (inicioMinutos >= finMinutos) {
        validaciones.duracion = 'La hora de fin debe ser posterior al inicio';
      } else if (duracionMinutos < 30) {
        validaciones.duracion = 'Duración mínima: 30 minutos';
      } else {
        const horas = Math.floor(duracionMinutos / 60);
        const minutos = duracionMinutos % 60;
        validaciones.duracion = `Duración: ${horas > 0 ? `${horas}h ` : ''}${minutos}min`;
      }
    }

    setValidacionTiempoReal(validaciones);
  };

  // Verificar conflictos de horario
  const verificarConflictos = (
    dia: string,
    horaInicio: string,
    horaFin: string
  ): string | null => {
    if (!dia || !horaInicio || !horaFin || !asignacionSeleccionada) return null;

    const horaAMinutos = (hora: string) => {
      const [h, m] = hora.split(':').map(Number);
      return h * 60 + m;
    };

    const inicioMinutos = horaAMinutos(horaInicio);
    const finMinutos = horaAMinutos(horaFin);

    // Verificar conflictos con otros horarios del mismo profesor
    for (const asignacion of asignaciones) {
      if (asignacion.horarios) {
        for (const horario of asignacion.horarios) {
          if (horario.dia === dia) {
            const horarioInicioMinutos = horaAMinutos(horario.horaInicio);
            const horarioFinMinutos = horaAMinutos(horario.horaFin);

            // Verificar solapamiento
            if (
              inicioMinutos < horarioFinMinutos &&
              finMinutos > horarioInicioMinutos
            ) {
              return `Conflicto con ${asignacion.curso?.nombre} (${horario.horaInicio} - ${horario.horaFin})`;
            }
          }
        }
      }
    }

    return null;
  };

  const handleGuardarHorario = async () => {
    if (!asignacionSeleccionada) return;
    setErrorHorario(null);
    setWarningHorario(null);

    // Validar en el frontend antes de enviar
    const errorValidacion = validarHorarioFrontend(
      nuevoHorario.horaInicio,
      nuevoHorario.horaFin
    );
    if (errorValidacion) {
      setErrorHorario(errorValidacion);
      return;
    }

    // Verificar conflictos de horario
    const conflicto = verificarConflictos(
      nuevoHorario.dia,
      nuevoHorario.horaInicio,
      nuevoHorario.horaFin
    );
    if (conflicto) {
      setErrorHorario(conflicto);
      return;
    }

    try {
      await agregarHorario(asignacionSeleccionada.id, {
        dia: nuevoHorario.dia,
        horaInicio: nuevoHorario.horaInicio,
        horaFin: nuevoHorario.horaFin
      });
      const asignacionesActualizadas = await obtenerAsignacionesPorProfesor(
        profesor.id
      );
      setAsignaciones(asignacionesActualizadas);
      setShowAgregarHorario(false);
      setNuevoHorario({ dia: '', horaInicio: '', horaFin: '' });
      setValidacionTiempoReal({
        horaInicio: null,
        horaFin: null,
        duracion: null
      });
    } catch (error: any) {
      console.error('Error al agregar horario:', error);
      setErrorHorario(error.message || 'Error al agregar el horario');
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
      const asignacionesActualizadas = await obtenerAsignacionesPorProfesor(
        profesor.id
      );
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
    const totalHorarios = asignaciones.reduce(
      (acc, asignacion) => acc + (asignacion.horarios?.length || 0),
      0
    );
    const nivelesUnicos = new Set(
      asignaciones.map(a => a.seccion?.nivel).filter(Boolean)
    ).size;

    return { totalAsignaciones, totalHorarios, nivelesUnicos };
  };

  const { totalAsignaciones, totalHorarios, nivelesUnicos } = getStatsData();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Gestión de Asignaciones - ${profesor.nombre} ${profesor.apellido}`}
        size='full'
      >
        <div className='h-full flex flex-col'>
          {/* Header con estadísticas */}
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <AcademicCapIcon className='h-6 w-6 text-blue-600' />
                </div>
                <div>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    {profesor.nombre} {profesor.apellido}
                  </h2>
                  <p className='text-sm text-gray-600'>
                    Gestión de Asignaciones Académicas
                  </p>
                </div>
              </div>

              <div className='flex gap-3'>
                <button
                  onClick={() => setShowNuevaAsignacion(true)}
                  className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm'
                >
                  <PlusIcon className='h-4 w-4' />
                  Nueva Asignación
                </button>
                <button
                  onClick={() => setShowHorarioCompleto(true)}
                  className='inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm'
                >
                  <CalendarIcon className='h-4 w-4' />
                  Ver Horario
                </button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className='grid grid-cols-3 gap-4'>
              <div className='bg-white rounded-lg p-4 border border-gray-200 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <BookOpenIcon className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-gray-900'>
                      {totalAsignaciones}
                    </p>
                    <p className='text-sm text-gray-600'>Asignaciones</p>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-lg p-4 border border-gray-200 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                    <ClockIcon className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-gray-900'>
                      {totalHorarios}
                    </p>
                    <p className='text-sm text-gray-600'>Horarios</p>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-lg p-4 border border-gray-200 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                    <UserGroupIcon className='h-5 w-5 text-purple-600' />
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-gray-900'>
                      {nivelesUnicos}
                    </p>
                    <p className='text-sm text-gray-600'>Niveles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className='flex-1 overflow-auto p-6'>
            {asignaciones.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-center'>
                <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
                  <BookOpenIcon className='h-12 w-12 text-gray-400' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  Sin asignaciones registradas
                </h3>
                <p className='text-gray-600 mb-6 max-w-md'>
                  No se han encontrado asignaciones para este profesor. Comienza
                  creando la primera asignación.
                </p>
                <button
                  onClick={() => setShowNuevaAsignacion(true)}
                  className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm'
                >
                  <PlusIcon className='h-5 w-5' />
                  Crear Primera Asignación
                </button>
              </div>
            ) : (
              <div className='space-y-8'>
                {/* Asignaciones por nivel educativo */}
                {[
                  { display: 'Inicial', values: ['INICIAL', 'Inicial'] },
                  { display: 'Primaria', values: ['PRIMARIA', 'Primaria'] },
                  {
                    display: 'Secundaria',
                    values: ['SECUNDARIA', 'Secundaria']
                  }
                ].map(({ display, values }) => {
                  const asignacionesNivel = asignaciones
                    .filter(asignacion => {
                      const nivelAsignacion = asignacion.seccion?.nivel;
                      return (
                        nivelAsignacion && values.includes(nivelAsignacion)
                      );
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
                    case 'Inicial':
                      return 'from-green-500 to-emerald-600';
                    case 'Primaria':
                      return 'from-blue-500 to-indigo-600';
                    case 'Secundaria':
                      return 'from-purple-500 to-violet-600';
                    default:
                      return 'from-gray-500 to-gray-600';
                    }
                  };

                  return (
                    <div key={display} className='mb-8'>
                      {/* Título del nivel educativo */}
                      <div className='mb-4'>
                        <h3 className='text-lg font-semibold text-gray-800 border-b-2 border-blue-200 pb-2'>
                          {display}
                        </h3>
                      </div>

                      {/* Grid de asignaciones */}
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {asignacionesNivel.map(asignacion => (
                          <div
                            key={asignacion.id}
                            className='bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden group'
                          >
                            {/* Header de la card */}
                            <div className='p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white'>
                              <h4 className='font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
                                {asignacion.curso?.nombre ||
                                  'Curso no disponible'}
                              </h4>
                              <div className='flex items-center justify-between text-xs'>
                                <div className='flex items-center gap-2 text-gray-600'>
                                  <span className='font-medium'>
                                    {asignacion.seccion?.grado}°
                                  </span>
                                  <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
                                  <span className='font-medium'>
                                    Sección {asignacion.seccion?.nombre}
                                  </span>
                                </div>
                                <span className='text-gray-500 font-medium'>
                                  {asignacion.anioAcademico}
                                </span>
                              </div>
                            </div>

                            {/* Contenido de la card */}
                            <div className='p-4'>
                              {/* Horarios */}
                              {asignacion.horarios &&
                              asignacion.horarios.length > 0 ? (
                                  <div className='mb-4'>
                                    <div className='flex items-center gap-2 mb-2'>
                                      <ClockIcon className='h-4 w-4 text-gray-500' />
                                      <span className='text-xs font-medium text-gray-700'>
                                      Horarios
                                      </span>
                                    </div>
                                    <div className='space-y-2'>
                                      {asignacion.horarios
                                        .slice(0, 2)
                                        .map(horario => (
                                          <div
                                            key={horario.id}
                                            className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'
                                          >
                                            <div className='flex-1'>
                                              <span className='text-xs font-medium text-gray-800'>
                                                {horario.dia}
                                              </span>
                                              <span className='text-xs text-gray-600 ml-2'>
                                                {horario.horaInicio} -{' '}
                                                {horario.horaFin}
                                              </span>
                                            </div>
                                            <button
                                              onClick={() =>
                                                handleEliminarHorario(
                                                  asignacion.id,
                                                  horario.id
                                                )
                                              }
                                              className='text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors'
                                              title='Eliminar horario'
                                            >
                                              <TrashIcon className='h-3 w-3' />
                                            </button>
                                          </div>
                                        ))}
                                      {asignacion.horarios.length > 2 && (
                                        <div className='text-xs text-gray-500 text-center py-1 bg-gray-50 rounded-lg'>
                                        +{asignacion.horarios.length - 2}{' '}
                                        horario
                                          {asignacion.horarios.length - 2 !== 1
                                            ? 's'
                                            : ''}{' '}
                                        más
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className='mb-4 p-3 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200'>
                                    <ClockIcon className='h-5 w-5 text-gray-400 mx-auto mb-1' />
                                    <p className='text-xs text-gray-500'>
                                    Sin horarios asignados
                                    </p>
                                  </div>
                                )}

                              {/* Botones de acción */}
                              <div className='space-y-2'>
                                <div className='grid grid-cols-2 gap-2'>
                                  <button
                                    onClick={() =>
                                      handleEditarAsignacion(asignacion)
                                    }
                                    className='inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                                  >
                                    <PencilIcon className='h-3 w-3' />
                                    Editar
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleEliminarAsignacion(asignacion)
                                    }
                                    className='inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors'
                                  >
                                    <TrashIcon className='h-3 w-3' />
                                    Eliminar
                                  </button>
                                </div>
                                <button
                                  onClick={() =>
                                    handleAgregarHorario(asignacion)
                                  }
                                  className='w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'
                                >
                                  <PlusIcon className='h-3 w-3' />
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

                      const nivelesEstandar = [
                        'INICIAL',
                        'Inicial',
                        'PRIMARIA',
                        'Primaria',
                        'SECUNDARIA',
                        'Secundaria'
                      ];
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
                    <div className='mb-8'>
                      {/* Título del nivel educativo */}
                      <div className='mb-4'>
                        <h3 className='text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-2'>
                          Sin Nivel / Otros
                        </h3>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {asignacionesSinNivel.map(asignacion => (
                          <div
                            key={asignacion.id}
                            className='bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden group'
                          >
                            <div className='p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white'>
                              <h4 className='font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
                                {asignacion.curso?.nombre ||
                                  'Curso no disponible'}
                              </h4>
                              <div className='flex items-center justify-between text-xs'>
                                <div className='flex items-center gap-2 text-gray-600'>
                                  <span className='font-medium'>
                                    {asignacion.seccion?.grado || 'N/A'}°
                                  </span>
                                  <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
                                  <span className='font-medium'>
                                    Sección{' '}
                                    {asignacion.seccion?.nombre || 'N/A'}
                                  </span>
                                </div>
                                <span className='text-gray-500 font-medium'>
                                  {asignacion.anioAcademico}
                                </span>
                              </div>
                              <div className='mt-1'>
                                <span className='text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full'>
                                  Nivel:{' '}
                                  {asignacion.seccion?.nivel || 'No definido'}
                                </span>
                              </div>
                            </div>

                            <div className='p-4'>
                              {asignacion.horarios &&
                              asignacion.horarios.length > 0 ? (
                                  <div className='mb-4'>
                                    <div className='flex items-center gap-2 mb-2'>
                                      <ClockIcon className='h-4 w-4 text-gray-500' />
                                      <span className='text-xs font-medium text-gray-700'>
                                      Horarios
                                      </span>
                                    </div>
                                    <div className='space-y-2'>
                                      {asignacion.horarios
                                        .slice(0, 2)
                                        .map(horario => (
                                          <div
                                            key={horario.id}
                                            className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'
                                          >
                                            <div className='flex-1'>
                                              <span className='text-xs font-medium text-gray-800'>
                                                {horario.dia}
                                              </span>
                                              <span className='text-xs text-gray-600 ml-2'>
                                                {horario.horaInicio} -{' '}
                                                {horario.horaFin}
                                              </span>
                                            </div>
                                            <button
                                              onClick={() =>
                                                handleEliminarHorario(
                                                  asignacion.id,
                                                  horario.id
                                                )
                                              }
                                              className='text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors'
                                              title='Eliminar horario'
                                            >
                                              <TrashIcon className='h-3 w-3' />
                                            </button>
                                          </div>
                                        ))}
                                      {asignacion.horarios.length > 2 && (
                                        <div className='text-xs text-gray-500 text-center py-1 bg-gray-50 rounded-lg'>
                                        +{asignacion.horarios.length - 2}{' '}
                                        horario
                                          {asignacion.horarios.length - 2 !== 1
                                            ? 's'
                                            : ''}{' '}
                                        más
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className='mb-4 p-3 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200'>
                                    <ClockIcon className='h-5 w-5 text-gray-400 mx-auto mb-1' />
                                    <p className='text-xs text-gray-500'>
                                    Sin horarios asignados
                                    </p>
                                  </div>
                                )}

                              <div className='space-y-2'>
                                <div className='grid grid-cols-2 gap-2'>
                                  <button
                                    onClick={() =>
                                      handleEditarAsignacion(asignacion)
                                    }
                                    className='inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                                  >
                                    <PencilIcon className='h-3 w-3' />
                                    Editar
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleEliminarAsignacion(asignacion)
                                    }
                                    className='inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors'
                                  >
                                    <TrashIcon className='h-3 w-3' />
                                    Eliminar
                                  </button>
                                </div>
                                <button
                                  onClick={() =>
                                    handleAgregarHorario(asignacion)
                                  }
                                  className='w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'
                                >
                                  <PlusIcon className='h-3 w-3' />
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
              <div className='mt-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <span className='text-red-600 text-xs font-bold'>!</span>
                  <div>
                    <p className='text-red-800 font-medium'>{error}</p>
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
        title='Nueva Asignación'
        size='lg'
      >
        <div className='p-6'>
          {/* Disclaimer informativo para nueva asignación */}
          <div className='bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6'>
            <div className='flex items-start gap-3'>
              <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <AcademicCapIcon className='h-4 w-4 text-green-600' />
              </div>
              <div>
                <h4 className='text-sm font-semibold text-green-900 mb-1'>
                  📚 Nueva Asignación
                </h4>
                <p className='text-sm text-green-800'>
                  Asigna un curso y sección al profesor. Después podrás agregar
                  los horarios de clase.
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <Combobox
                options={cursosOptions}
                value={nuevaAsignacion.cursoId}
                onChange={value =>
                  setNuevaAsignacion(prev => ({ ...prev, cursoId: value }))
                }
                placeholder='Seleccionar curso'
                label='Curso'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>
                Elige la materia que el profesor enseñará
              </p>
            </div>

            <div>
              <Combobox
                options={seccionesOptions}
                value={nuevaAsignacion.seccionId}
                onChange={value =>
                  setNuevaAsignacion(prev => ({ ...prev, seccionId: value }))
                }
                placeholder='Seleccionar sección'
                label='Sección'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>
                Selecciona el grado y sección específica
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Año Académico <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                value={anioAcademico}
                onChange={e => setAnioAcademico(e.target.value)}
                min='2020'
                max='2030'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                placeholder='2024'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>
                Año académico para esta asignación (2020-2030)
              </p>
            </div>
          </div>

          {/* Mostrar error si existe */}
          {errorHorario && (
            <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <div className='flex items-center gap-2'>
                <span className='text-red-600 text-sm font-bold'>⚠️</span>
                <p className='text-sm text-red-800 font-medium'>
                  {errorHorario}
                </p>
              </div>
            </div>
          )}

          {/* Indicador de progreso */}
          {nuevaAsignacion.cursoId &&
            nuevaAsignacion.seccionId &&
            anioAcademico && (
            <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-800 font-medium'>
                  ✅ Todos los campos completados. Listo para crear la
                  asignación.
              </p>
            </div>
          )}

          <div className='flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6'>
            <button
              onClick={() => setShowNuevaAsignacion(false)}
              className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium'
            >
              Cancelar
            </button>
            <button
              onClick={handleCrearAsignacion}
              disabled={
                loading ||
                !nuevaAsignacion.cursoId ||
                !nuevaAsignacion.seccionId
              }
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
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
        title='Editar Asignación'
        size='lg'
      >
        <div className='p-6'>
          {/* Disclaimer informativo para editar asignación */}
          <div className='bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6'>
            <div className='flex items-start gap-3'>
              <div className='w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <PencilIcon className='h-4 w-4 text-amber-600' />
              </div>
              <div>
                <h4 className='text-sm font-semibold text-amber-900 mb-1'>
                  ✏️ Editar Asignación
                </h4>
                <p className='text-sm text-amber-800'>
                  Modifica el curso, sección o año académico. Los horarios
                  existentes se conservarán.
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <Combobox
                options={cursosOptions}
                value={nuevaAsignacion.cursoId}
                onChange={value =>
                  setNuevaAsignacion(prev => ({ ...prev, cursoId: value }))
                }
                placeholder='Seleccionar curso'
                label='Curso'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>
                Cambia la materia asignada al profesor
              </p>
            </div>

            <div>
              <Combobox
                options={seccionesOptions}
                value={nuevaAsignacion.seccionId}
                onChange={value =>
                  setNuevaAsignacion(prev => ({ ...prev, seccionId: value }))
                }
                placeholder='Seleccionar sección'
                label='Sección'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>
                Modifica el grado y sección asignada
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Año Académico <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                value={anioAcademico}
                onChange={e => setAnioAcademico(e.target.value)}
                min='2020'
                max='2030'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                placeholder='2024'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>
                Actualiza el año académico si es necesario
              </p>
            </div>
          </div>

          {/* Indicador de cambios */}
          {(nuevaAsignacion.cursoId !==
            (asignacionSeleccionada?.curso?.id?.toString() || '') ||
            nuevaAsignacion.seccionId !==
              (asignacionSeleccionada?.seccion?.id?.toString() || '') ||
            anioAcademico !==
              (asignacionSeleccionada?.anioAcademico?.toString() ||
                '2024')) && (
            <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-800 font-medium'>
                📝 Se han detectado cambios. Presiona &ldquo;Actualizar&rdquo;
                para guardar.
              </p>
            </div>
          )}

          <div className='flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6'>
            <button
              onClick={() => setShowEditarAsignacion(false)}
              className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium'
            >
              Cancelar
            </button>
            <button
              onClick={handleActualizarAsignacion}
              disabled={
                loading ||
                !nuevaAsignacion.cursoId ||
                !nuevaAsignacion.seccionId
              }
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
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
        title='Eliminar Asignación'
        size='lg'
      >
        <div className='p-6'>
          <div className='flex items-start gap-4'>
            <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
              <TrashIcon className='h-6 w-6 text-red-600' />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                ¿Confirmar eliminación?
              </h3>
              <p className='text-gray-700 mb-4'>
                Estás a punto de eliminar la asignación de{' '}
                <span className='font-semibold text-gray-900'>
                  {asignacionSeleccionada?.curso?.nombre}
                </span>{' '}
                en la sección{' '}
                <span className='font-semibold text-gray-900'>
                  {asignacionSeleccionada?.seccion?.grado}°{' '}
                  {asignacionSeleccionada?.seccion?.nombre}
                </span>
                .
              </p>
              <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                <p className='text-sm text-red-800'>
                  <strong>Advertencia:</strong> Esta acción no se puede deshacer
                  y eliminará todos los horarios asociados.
                </p>
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6'>
            <button
              onClick={() => setShowEliminarAsignacion(false)}
              className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium'
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarEliminar}
              className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
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
        title='Agregar Horario'
        size='lg'
      >
        <div className='p-6'>
          <div className='space-y-6'>
            <div>
              <Combobox
                options={diasSemana}
                value={nuevoHorario.dia}
                onChange={value =>
                  setNuevoHorario(prev => ({ ...prev, dia: value }))
                }
                placeholder='Seleccionar día'
                label='Día de la semana'
                required
              />
            </div>

            {/* Disclaimer informativo */}
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4'>
              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <ClockIcon className='h-4 w-4 text-blue-600' />
                </div>
                <div>
                  <h4 className='text-sm font-semibold text-blue-900 mb-1'>
                    Información del Horario Escolar
                  </h4>
                  <p className='text-sm text-blue-800'>
                    Horario escolar: <strong>7:30 AM - 2:00 PM</strong> •
                    Duración mínima: <strong>30 minutos</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Hora de inicio <span className='text-red-500'>*</span>
                </label>
                <input
                  type='time'
                  value={nuevoHorario.horaInicio}
                  onChange={e => {
                    setNuevoHorario(prev => ({
                      ...prev,
                      horaInicio: e.target.value
                    }));
                    validarTiempoReal(e.target.value, nuevoHorario.horaFin);
                  }}
                  min='07:30'
                  max='13:30'
                  step='1800'
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validacionTiempoReal.horaInicio &&
                    validacionTiempoReal.horaInicio !==
                      'Debe ser después de las 7:30 AM'
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  required
                />
                <div className='mt-1 min-h-[20px]'>
                  {validacionTiempoReal.horaInicio ? (
                    <p
                      className={`text-xs ${
                        validacionTiempoReal.horaInicio ===
                        'Debe ser después de las 7:30 AM'
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {validacionTiempoReal.horaInicio}
                    </p>
                  ) : (
                    <p className='text-xs text-gray-500'>
                      Desde 7:30 AM hasta 1:30 PM
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Hora de fin <span className='text-red-500'>*</span>
                </label>
                <input
                  type='time'
                  value={nuevoHorario.horaFin}
                  onChange={e => {
                    setNuevoHorario(prev => ({
                      ...prev,
                      horaFin: e.target.value
                    }));
                    validarTiempoReal(nuevoHorario.horaInicio, e.target.value);
                  }}
                  min='08:00'
                  max='14:00'
                  step='1800'
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validacionTiempoReal.horaFin &&
                    validacionTiempoReal.horaFin !==
                      'Debe ser antes de las 2:00 PM'
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  required
                />
                <div className='mt-1 min-h-[20px]'>
                  {validacionTiempoReal.horaFin ? (
                    <p
                      className={`text-xs ${
                        validacionTiempoReal.horaFin ===
                        'Debe ser antes de las 2:00 PM'
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {validacionTiempoReal.horaFin}
                    </p>
                  ) : (
                    <p className='text-xs text-gray-500'>
                      Hasta 2:00 PM máximo
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Indicador de duración */}
            {validacionTiempoReal.duracion && (
              <div
                className={`p-3 rounded-lg border ${
                  validacionTiempoReal.duracion.includes('Duración:')
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    validacionTiempoReal.duracion.includes('Duración:')
                      ? 'text-green-800'
                      : 'text-yellow-800'
                  }`}
                >
                  {validacionTiempoReal.duracion.includes('Duración:')
                    ? '✓ '
                    : '⚠️ '}
                  {validacionTiempoReal.duracion}
                </p>
              </div>
            )}

            {/* Verificación de conflictos en tiempo real */}
            {nuevoHorario.dia &&
              nuevoHorario.horaInicio &&
              nuevoHorario.horaFin &&
              (() => {
                const conflicto = verificarConflictos(
                  nuevoHorario.dia,
                  nuevoHorario.horaInicio,
                  nuevoHorario.horaFin
                );
                if (conflicto) {
                  return (
                    <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                      <p className='text-sm text-red-800 font-medium'>
                        ⚠️ {conflicto}
                      </p>
                    </div>
                  );
                }
                return (
                  <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
                    <p className='text-sm text-green-800 font-medium'>
                      ✅ No hay conflictos de horario detectados
                    </p>
                  </div>
                );
              })()}
          </div>

          <div className='flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6'>
            <button
              onClick={() => setShowAgregarHorario(false)}
              className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium'
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardarHorario}
              disabled={
                !nuevoHorario.dia ||
                !nuevoHorario.horaInicio ||
                !nuevoHorario.horaFin
              }
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
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
        size='full'
      >
        <div className='p-6'>
          <HorarioProfesor asignaciones={asignaciones} />
        </div>
      </Modal>
    </>
  );
}
