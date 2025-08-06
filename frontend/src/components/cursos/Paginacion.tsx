import React from 'react';
import { PaginacionProps } from '@/types/cursos';

const Paginacion: React.FC<PaginacionProps> = ({
  paginaActual,
  totalRegistros,
  registrosPorPagina,
  onCambiarPagina,
  loading
}) => {
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

  const generarPaginas = () => {
    const paginas = [];
    const maxPaginas = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginas / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginas - 1);

    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  };

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between mt-6 gap-4'>
      <div className='text-sm text-gray-600'>
        Mostrando{' '}
        {Math.min((paginaActual - 1) * registrosPorPagina + 1, totalRegistros)}{' '}
        - {Math.min(paginaActual * registrosPorPagina, totalRegistros)} de{' '}
        {totalRegistros} cursos
      </div>

      <div className='flex items-center gap-1'>
        <button
          onClick={() => onCambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1 || loading}
          className='p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>

        {generarPaginas().map(pagina => (
          <button
            key={pagina}
            onClick={() => onCambiarPagina(pagina)}
            disabled={loading}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              pagina === paginaActual
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {pagina}
          </button>
        ))}

        <button
          onClick={() => onCambiarPagina(paginaActual + 1)}
          disabled={paginaActual >= totalPaginas || loading}
          className='p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Paginacion;
