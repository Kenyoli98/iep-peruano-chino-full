import React from 'react';

interface EmptyStateProps {
  busquedaRealizada: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ busquedaRealizada }) => {
  return (
    <div className='text-center py-16'>
      <div className='mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-8 shadow-lg'>
        <svg
          className='w-16 h-16 text-blue-500'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
          />
        </svg>
      </div>
      <div className='max-w-md mx-auto'>
        <h3 className='text-xl font-semibold text-slate-800 mb-3'>
          {busquedaRealizada
            ? 'No se encontraron secciones'
            : 'No hay secciones registradas'}
        </h3>
        <p className='text-slate-500 mb-8 leading-relaxed'>
          {busquedaRealizada
            ? 'Intenta ajustar los filtros de búsqueda para encontrar secciones que coincidan con tus criterios.'
            : 'Comienza creando tu primera sección para organizar los estudiantes por nivel y grado de manera eficiente.'}
        </p>
        {busquedaRealizada && (
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200/50'>
            <p className='text-sm text-blue-700 font-medium'>💡 Sugerencia</p>
            <p className='text-sm text-blue-600 mt-1'>
              Prueba limpiando los filtros o usando términos de búsqueda más
              generales
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
