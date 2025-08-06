import React from 'react';
import { TablaCursosProps } from '@/types/cursos';

const TablaCursos: React.FC<TablaCursosProps> = ({
  cursos,
  onEliminar,
  onEditar,
  loading
}) => (
  <div className='bg-gradient-to-br from-white via-slate-50/50 to-white rounded-xl shadow-xl border border-slate-200/60 overflow-hidden backdrop-blur-sm'>
    <div className='bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200'>
      <div className='flex items-center'>
        <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3'>
          <svg
            className='w-4 h-4 text-blue-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-gray-800'>
          Catálogo de Cursos Académicos
        </h3>
        <div className='ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
          {cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}
        </div>
      </div>
    </div>

    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-slate-200/60'>
        <thead className='bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50'>
          <tr>
            <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
              <div className='flex items-center space-x-1'>
                <span>ID</span>
                <svg
                  className='w-3 h-3 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 20l4-16m2 16l4-16M6 9h14M4 15h14'
                  />
                </svg>
              </div>
            </th>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
              <div className='flex items-center space-x-1'>
                <span>Curso Académico</span>
                <svg
                  className='w-3 h-3 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  />
                </svg>
              </div>
            </th>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
              <div className='flex items-center space-x-1'>
                <span>Acciones</span>
                <svg
                  className='w-3 h-3 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className='bg-white/80 divide-y divide-slate-200/40'>
          {cursos.map((curso, index) => (
            <tr
              key={curso.id}
              className='hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-300 hover:shadow-sm group'
            >
              <td className='px-6 py-2.5 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors'>
                    {curso.id}
                  </div>
                </div>
              </td>
              <td className='px-6 py-2.5 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3'>
                    <svg
                      className='w-4 h-4 text-blue-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                      />
                    </svg>
                  </div>
                  <div className='text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors'>
                    {curso.nombre}
                  </div>
                </div>
              </td>
              <td className='px-6 py-2.5 whitespace-nowrap'>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => onEditar(curso)}
                    disabled={loading}
                    className='inline-flex items-center px-3 py-1.5 border border-blue-200 rounded-lg text-xs font-medium text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group'
                  >
                    <svg
                      className='w-3 h-3 mr-1 group-hover:scale-110 transition-transform'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(curso)}
                    disabled={loading}
                    className='inline-flex items-center px-3 py-1.5 border border-red-200 rounded-lg text-xs font-medium text-red-600 bg-gradient-to-r from-red-50 to-red-100 hover:bg-gradient-to-r hover:from-red-100 hover:to-red-200 hover:border-red-300 transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group'
                  >
                    <svg
                      className='w-3 h-3 mr-1 group-hover:scale-110 transition-transform'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TablaCursos;
