'use client';

import { useState, useEffect } from 'react';
import { FaBook, FaUsers, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

export default function CursosProfesorPage() {
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

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white'>
        <h1 className='text-3xl font-bold mb-2'>Mis Cursos</h1>
        <p className='text-purple-100'>
          Administra tus cursos y secciones asignadas
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-blue-100'>
              <FaBook className='text-blue-600' size={24} />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Cursos Asignados
              </p>
              <p className='text-2xl font-semibold text-gray-900'>0</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-green-100'>
              <FaUsers className='text-green-600' size={24} />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Total Estudiantes
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
              <p className='text-sm font-medium text-gray-600'>
                Horas Semanales
              </p>
              <p className='text-2xl font-semibold text-gray-900'>0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className='bg-white rounded-lg shadow'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900'>
            Cursos y Secciones
          </h2>
        </div>
        <div className='p-6'>
          <div className='text-center py-12'>
            <FaBook className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-2 text-sm font-medium text-gray-900'>
              No hay cursos asignados
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Contacta al administrador para que te asigne cursos y secciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
