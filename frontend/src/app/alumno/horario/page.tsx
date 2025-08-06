'use client';

import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaBook, FaMapMarkerAlt } from 'react-icons/fa';

export default function HorarioAlumnoPage() {
  const [mounted, setMounted] = useState(false);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setNombre(localStorage.getItem('nombre') || '');
    }
  }, []);

  if (!mounted) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Cargando...</span>
      </div>
    );
  }

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const horasClase = [
    '08:00 - 08:45',
    '08:45 - 09:30',
    '09:30 - 10:15',
    '10:15 - 11:00',
    '11:00 - 11:45',
    '11:45 - 12:30',
    '12:30 - 13:15',
    '13:15 - 14:00'
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-6 text-white'>
        <h1 className='text-3xl font-bold mb-2'>Mi Horario</h1>
        <p className='text-indigo-100'>Consulta tu horario de clases semanal</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-blue-100'>
              <FaBook className='text-blue-600' size={24} />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Cursos</p>
              <p className='text-2xl font-semibold text-gray-900'>0</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-green-100'>
              <FaClock className='text-green-600' size={24} />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Horas Semanales
              </p>
              <p className='text-2xl font-semibold text-gray-900'>0</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-purple-100'>
              <FaCalendarAlt className='text-purple-600' size={24} />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Días de Clase</p>
              <p className='text-2xl font-semibold text-gray-900'>5</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-yellow-100'>
              <FaMapMarkerAlt className='text-yellow-600' size={24} />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Aulas</p>
              <p className='text-2xl font-semibold text-gray-900'>--</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900'>Horario Semanal</h2>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Hora
                </th>
                {diasSemana.map(dia => (
                  <th
                    key={dia}
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {horasClase.map((hora, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {hora}
                  </td>
                  {diasSemana.map(dia => (
                    <td
                      key={`${dia}-${index}`}
                      className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'
                    >
                      <div className='text-center py-4 text-gray-400'>--</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
        <div className='flex items-start'>
          <FaCalendarAlt className='text-blue-600 mt-1' size={20} />
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-blue-900'>
              Información del Horario
            </h3>
            <p className='mt-1 text-sm text-blue-700'>
              Tu horario de clases se actualizará automáticamente cuando el
              administrador asigne los cursos y horarios. Si tienes dudas sobre
              tu horario, contacta a la administración del colegio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
