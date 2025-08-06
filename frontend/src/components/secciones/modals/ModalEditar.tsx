import React from 'react';
import { ModalEditarProps } from '@/types/secciones';

const ModalEditar: React.FC<ModalEditarProps> = ({
  isOpen,
  onClose,
  seccion,
  setSeccion,
  onSubmit,
  loading
}) => {
  if (!isOpen || !seccion) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100'>
        <div className='p-6'>
          <div className='flex items-center mb-6'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4'>
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
              <h2 className='text-2xl font-bold text-gray-900'>
                Editar Sección
              </h2>
              <p className='text-sm text-gray-600'>
                Modifica la información de la sección académica
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
                        d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z'
                      />
                    </svg>
                    Nombre de la Sección
                  </span>
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={seccion.nombre}
                    onChange={e =>
                      setSeccion({
                        ...seccion,
                        nombre: e.target.value.toUpperCase()
                      })
                    }
                    placeholder='Ej: A, B, C, ÚNICA...'
                    className={`w-full px-4 py-3 border rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      seccion.nombre.trim()
                        ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    disabled={loading}
                    required
                    minLength={1}
                    maxLength={10}
                  />
                  {seccion.nombre.trim() && (
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
                  Modifica el nombre de la sección (1-10 caracteres)
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
                        d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                      />
                    </svg>
                    Nivel Académico
                  </span>
                </label>
                <select
                  value={seccion.nivel}
                  onChange={e =>
                    setSeccion({ ...seccion, nivel: e.target.value })
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                  disabled={loading}
                  required
                >
                  <option value=''>Seleccionar nivel</option>
                  <option value='INICIAL'>INICIAL</option>
                  <option value='PRIMARIA'>PRIMARIA</option>
                  <option value='SECUNDARIA'>SECUNDARIA</option>
                </select>
                <p className='text-xs text-gray-500 mt-1'>
                  Selecciona el nivel educativo correspondiente
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
                        d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                      />
                    </svg>
                    Grado
                  </span>
                </label>
                <input
                  type='text'
                  value={seccion.grado}
                  onChange={e =>
                    setSeccion({
                      ...seccion,
                      grado: e.target.value.toUpperCase()
                    })
                  }
                  placeholder='Ej: 1°, 2°, 3°, 4°, 5°, 6°...'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                  disabled={loading}
                  required
                  minLength={1}
                  maxLength={10}
                />
                <p className='text-xs text-gray-500 mt-1'>
                  Especifica el grado académico (1-10 caracteres)
                </p>
              </div>
            </div>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-start'>
                <svg
                  className='w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0'
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
                  <p className='text-sm font-medium text-blue-800 mb-1'>
                    Atención
                  </p>
                  <p className='text-xs text-blue-700'>
                    Los cambios afectarán todos los estudiantes, asignaciones y
                    registros asociados a esta sección.
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
                disabled={
                  loading ||
                  !seccion.nombre.trim() ||
                  !seccion.nivel ||
                  !seccion.grado.trim()
                }
                className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  seccion.nombre.trim() &&
                  seccion.nivel &&
                  seccion.grado.trim() &&
                  !loading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 hover:shadow-lg'
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
