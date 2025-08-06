'use client';

import { FaUserTie, FaSearch, FaPlus } from 'react-icons/fa';

interface EmptyStateProps {
  tipo: 'profesores' | 'busqueda';
  onCrearProfesor?: () => void;
}

const EmptyState = ({ tipo, onCrearProfesor }: EmptyStateProps) => {
  if (tipo === 'busqueda') {
    return (
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-12'>
        <div className='text-center'>
          <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
            <FaSearch className='w-10 h-10 text-gray-400' />
          </div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            No se encontraron profesores
          </h3>
          <p className='text-gray-500 mb-6 max-w-md mx-auto'>
            No hay profesores que coincidan con tu búsqueda. Intenta con otros
            términos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-12'>
      <div className='text-center'>
        <div className='mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6'>
          <FaUserTie className='w-10 h-10 text-blue-600' />
        </div>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
          No hay profesores registrados
        </h3>
        <p className='text-gray-500 mb-6 max-w-md mx-auto'>
          Para gestionar asignaciones, primero necesitas tener profesores
          registrados en el sistema.
        </p>
        {onCrearProfesor && (
          <button
            onClick={onCrearProfesor}
            className='inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          >
            <FaPlus className='w-4 h-4 mr-2' />
            Registrar Profesor
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
