'use client';

import { FaSearch, FaTimes } from 'react-icons/fa';

interface FiltrosSectionProps {
  busqueda: string;
  setBusqueda: (busqueda: string) => void;
  onLimpiar: () => void;
  totalProfesores: number;
  profesoresFiltrados: number;
}

const FiltrosSection = ({
  busqueda,
  setBusqueda,
  onLimpiar,
  totalProfesores,
  profesoresFiltrados
}: FiltrosSectionProps) => {
  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        {/* Barra de búsqueda */}
        <div className='flex-1 max-w-md'>
          <div className='relative'>
            <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              placeholder='Buscar profesor por nombre o email...'
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className='w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            />
            {busqueda && (
              <button
                onClick={onLimpiar}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
              >
                <FaTimes className='w-4 h-4' />
              </button>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className='flex items-center space-x-6 text-sm'>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
            <span className='text-gray-600'>
              Mostrando{' '}
              <span className='font-semibold text-gray-900'>
                {profesoresFiltrados}
              </span>{' '}
              de{' '}
              <span className='font-semibold text-gray-900'>
                {totalProfesores}
              </span>{' '}
              profesores
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltrosSection;
