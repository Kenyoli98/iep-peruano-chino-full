import React from 'react';
import { ModalEditarProps } from '@/types/cursos';

const ModalEditar: React.FC<ModalEditarProps> = ({
  isOpen,
  onClose,
  curso,
  setCurso,
  onSubmit,
  loading
}) => {
  if (!isOpen || !curso) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100'>
        <div className='p-6'>
          <div className='flex items-center mb-6'>
            <div className='w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-4'>
              <svg
                className='w-6 h-6 text-white'
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
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>Editar Curso</h2>
              <p className='text-sm text-gray-600'>
                Modifica la información del curso académico
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className='space-y-6'>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  <span className='flex items-center'>
                    <svg
                      className='w-4 h-4 mr-2 text-gray-500'
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
                    Nombre del Curso Académico
                  </span>
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={curso.nombre}
                    onChange={e =>
                      setCurso({
                        ...curso,
                        nombre: e.target.value.toUpperCase()
                      })
                    }
                    placeholder='Ej: Matemáticas, Historia Universal, Ciencias Naturales...'
                    className={`w-full px-4 py-3 border rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      curso.nombre.trim()
                        ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                        : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                    }`}
                    disabled={loading}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                  {curso.nombre.trim() && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                      <svg
                        className='h-5 w-5 text-green-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  Modifica el nombre completo de la materia o curso académico
                  (2-100 caracteres)
                </p>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  <span className='flex items-center'>
                    <svg
                      className='w-4 h-4 mr-2 text-gray-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                    Descripción (Opcional)
                  </span>
                </label>
                <textarea
                  value={curso.descripcion || ''}
                  onChange={e =>
                    setCurso({ ...curso, descripcion: e.target.value })
                  }
                  placeholder='Describe brevemente el contenido y objetivos del curso...'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 resize-none'
                  disabled={loading}
                  rows={3}
                  maxLength={500}
                />
                <p className='text-xs text-gray-500 mt-1'>
                  {curso.descripcion?.length || 0}/500 caracteres
                </p>
              </div>
            </div>

            <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
              <div className='flex items-start'>
                <svg
                  className='w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
                <div>
                  <p className='text-sm font-medium text-amber-800 mb-1'>
                    Atención
                  </p>
                  <p className='text-xs text-amber-700'>
                    Los cambios afectarán todas las secciones, asignaciones y
                    registros asociados a este curso.
                  </p>
                </div>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 pt-2'>
              <button
                type='button'
                onClick={onClose}
                disabled={loading}
                className='flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={loading || !curso.nombre.trim()}
                className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  curso.nombre.trim() && !loading
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transform hover:-translate-y-0.5 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Guardando Cambios...
                  </>
                ) : (
                  <>
                    <svg
                      className='w-4 h-4 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditar;
