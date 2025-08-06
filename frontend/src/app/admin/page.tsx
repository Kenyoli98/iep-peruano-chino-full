'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaBook,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaUsers,
  FaClipboardList,
  FaChartLine,
  FaCog,
  FaCalendarAlt,
  FaGraduationCap,
  FaUserTie,
  FaSchool,
  FaSync
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import {
  obtenerEstadisticas,
  type Estadisticas
} from '@/services/estadisticasService';
import { toast } from 'react-hot-toast';

// Componente para las tarjetas de estadísticas
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: string;
}) => (
  <div
    className='bg-white rounded-xl shadow-lg p-6 border-l-4'
    style={{ borderLeftColor: color }}
  >
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
        <p className='text-2xl font-bold text-gray-900'>{value}</p>
        {trend && (
          <p className='text-xs text-green-600 mt-1'>
            <span className='font-medium'>↗ {trend}</span> vs mes anterior
          </p>
        )}
      </div>
      <div
        className='p-3 rounded-full'
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  </div>
);

// Componente para las tarjetas de navegación
const NavigationCard = ({
  href,
  icon: Icon,
  title,
  description,
  color
}: {
  href: string;
  icon: any;
  title: string;
  description: string;
  color: string;
}) => (
  <Link
    href={href}
    className='group bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:scale-105 hover:border-blue-300'
  >
    <div className='flex flex-col items-center text-center'>
      <div
        className='p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300'
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={32} style={{ color }} />
      </div>
      <h3 className='text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors'>
        {title}
      </h3>
      <p className='text-sm text-gray-600 leading-relaxed'>{description}</p>
    </div>
  </Link>
);

export default function AdminDashboardPage() {
  useAuth(['admin']); // 🔒 Solo permite acceso a rol "admin"
  const [nombre, setNombre] = useState('');
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Función para cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      setLoadingStats(true);
      const stats = await obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (error: any) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar las estadísticas del dashboard');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setNombre(localStorage.getItem('nombre') || '');
    }

    // Cargar estadísticas al montar el componente
    cargarEstadisticas();

    // Actualizar la hora cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Actualizar estadísticas cada 5 minutos
    const statsTimer = setInterval(
      () => {
        cargarEstadisticas();
      },
      5 * 60 * 1000
    );

    return () => {
      clearInterval(timer);
      clearInterval(statsTimer);
    };
  }, []);

  if (!mounted || !nombre) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Cargando dashboard...</span>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className='min-h-screen'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl border border-white/20 backdrop-blur-sm'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex-1'>
              <h1 className='text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>
                {getGreeting()}, {nombre}! 👋
              </h1>
              <p className='text-blue-100 text-xl font-medium mb-2'>
                Bienvenido al Panel de Administración
              </p>
              <div className='flex flex-col sm:flex-row sm:items-center gap-4 text-blue-200'>
                <p className='text-sm capitalize bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm'>
                  📅 {formatDate(currentTime)}
                </p>
                {estadisticas?.fechaActualizacion && (
                  <p className='text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm'>
                    🔄 Última actualización:{' '}
                    {new Date(estadisticas.fechaActualizacion).toLocaleString(
                      'es-ES'
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className='mt-6 lg:mt-0 flex flex-col items-center space-y-4'>
              <div className='bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30'>
                <FaSchool size={56} className='text-white/90' />
              </div>
              <button
                onClick={cargarEstadisticas}
                disabled={loadingStats}
                className='bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 flex items-center space-x-3 border border-white/30 hover:border-white/50 hover:shadow-lg'
              >
                <FaSync
                  className={`text-base ${loadingStats ? 'animate-spin' : ''}`}
                />
                <span>
                  {loadingStats ? 'Actualizando...' : 'Actualizar Datos'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          title='Total Estudiantes'
          value={loadingStats ? '...' : estadisticas?.totalEstudiantes || 0}
          icon={FaUserGraduate}
          color='#3B82F6'
          trend={
            estadisticas?.matriculasActivas
              ? `${estadisticas.matriculasActivas} matrículas activas`
              : 'Sin matrículas activas'
          }
        />
        <StatCard
          title='Docentes Activos'
          value={loadingStats ? '...' : estadisticas?.totalDocentes || 0}
          icon={FaChalkboardTeacher}
          color='#10B981'
          trend={
            estadisticas?.asignacionesActivas
              ? `${estadisticas.asignacionesActivas} asignaciones activas`
              : 'Sin asignaciones'
          }
        />
        <StatCard
          title='Cursos Disponibles'
          value={loadingStats ? '...' : estadisticas?.totalCursos || 0}
          icon={FaBook}
          color='#F59E0B'
          trend='Catálogo completo'
        />
        <StatCard
          title='Usuarios del Sistema'
          value={loadingStats ? '...' : estadisticas?.totalUsuarios || 0}
          icon={FaUsers}
          color='#8B5CF6'
          trend={`Año académico ${estadisticas?.anioAcademico || new Date().getFullYear()}`}
        />
      </div>

      {/* Additional Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <StatCard
          title='Secciones Configuradas'
          value={loadingStats ? '...' : estadisticas?.totalSecciones || 0}
          icon={FaGraduationCap}
          color='#06B6D4'
          trend='Estructura académica lista'
        />
        <StatCard
          title={`Asignaciones Activas (${estadisticas?.anioAcademico || new Date().getFullYear()})`}
          value={loadingStats ? '...' : estadisticas?.asignacionesActivas || 0}
          icon={FaClipboardList}
          color='#F97316'
          trend='Año académico actual'
        />
      </div>

      {/* Quick Actions Section */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
          <FaChartLine className='mr-3 text-blue-600' />
          Acciones Rápidas
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <NavigationCard
            href='/admin/cursos'
            icon={FaBook}
            title='Catálogo de Cursos'
            description='Crear, editar y administrar cursos académicos'
            color='#3B82F6'
          />
          <NavigationCard
            href='/admin/matricula'
            icon={FaUserGraduate}
            title='Proceso de Matrícula'
            description='Inscribir estudiantes y gestionar matrículas'
            color='#10B981'
          />
          <NavigationCard
            href='/admin/notas'
            icon={FaChalkboardTeacher}
            title='Registro de Calificaciones'
            description='Ingresar y consultar notas de estudiantes'
            color='#F59E0B'
          />
          <NavigationCard
            href='/admin/pensiones'
            icon={FaMoneyBillWave}
            title='Control de Pensiones'
            description='Gestionar pagos mensuales y estados de cuenta'
            color='#EF4444'
          />
        </div>
      </div>

      {/* Management Section */}
      <div>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
          <FaCog className='mr-3 text-gray-600' />
          Administración del Sistema
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <NavigationCard
            href='/admin/docentes'
            icon={FaUserTie}
            title='Personal Docente'
            description='Registrar y administrar información de profesores'
            color='#8B5CF6'
          />
          <NavigationCard
            href='/admin/asignaciones'
            icon={FaClipboardList}
            title='Asignación Docente-Curso'
            description='Asignar profesores a cursos específicos por sección'
            color='#06B6D4'
          />
          <NavigationCard
            href='/admin/usuarios'
            icon={FaUsers}
            title='Cuentas de Usuario'
            description='Crear y gestionar accesos al sistema'
            color='#84CC16'
          />
          <NavigationCard
            href='/admin/secciones'
            icon={FaGraduationCap}
            title='Estructura Académica'
            description='Configurar grados, niveles y secciones'
            color='#F97316'
          />
        </div>
      </div>
    </div>
  );
}
