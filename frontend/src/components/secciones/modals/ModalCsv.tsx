import React from 'react';
import { ModalCsvProps } from '@/types/secciones';

const ModalCsv: React.FC<ModalCsvProps> = ({
  isOpen,
  onClose,
  archivo,
  setArchivo,
  onSubmit,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100'>
        <div className='p-6'>
          <div className='flex items-center mb-6'>
            <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4'>
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
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
                />
              </svg>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>
                Importar Secciones desde CSV
              </h2>
              <p className='text-sm text-gray-600'>
                Carga masiva de secciones académicas
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className='space-y-6'>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-3'>
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
                    Seleccionar Archivo CSV
                  </span>
                </label>

                <div className='relative'>
                  <input
                    type='file'
                    accept='.csv'
                    onChange={e => setArchivo(e.target.files?.[0] || null)}
                    className='w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200'
                    disabled={loading}
                    required
                  />
                  {archivo && (
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

                {archivo && (
                  <div className='mt-2 p-3 bg-green-50 border border-green-200 rounded-lg'>
                    <div className='flex items-center'>
                      <svg
                        className='w-4 h-4 text-green-600 mr-2'
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
                      <span className='text-sm font-medium text-green-800'>
                        {archivo.name}
                      </span>
                      <span className='text-xs text-green-600 ml-2'>
                        ({(archivo.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                )}
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
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <div>
                  <p className='text-sm font-medium text-blue-800 mb-2'>
                    Formato Requerido del Archivo CSV
                  </p>
                  <div className='text-xs text-blue-700 space-y-1'>
                    <p>
                      <strong>Columnas obligatorias:</strong> nombre, nivel,
                      grado
                    </p>
                    <p>
                      <strong>Separador:</strong> Coma (,)
                    </p>
                    <p>
                      <strong>Codificación:</strong> UTF-8
                    </p>
                    <p>
                      <strong>Primera fila:</strong> Encabezados de columnas
                    </p>
                  </div>
                  <div className='mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800 font-mono'>
                    <strong>Ejemplo:</strong>
                    <br />
                    nombre,nivel,grado
                    <br />
                    A,PRIMARIA,1°
                    <br />
                    B,PRIMARIA,1°
                    <br />
                    ÚNICA,SECUNDARIA,5°
                  </div>
                </div>
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
                    Importante
                  </p>
                  <p className='text-xs text-amber-700'>
                    Las secciones duplicadas serán omitidas. Verifica que el
                    formato sea correcto antes de importar.
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
                disabled={loading || !archivo}
                className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  archivo && !loading
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 hover:shadow-lg'
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
                    Importando Secciones...
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
                        d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
                      />
                    </svg>
                    Importar Secciones
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

export default ModalCsv;
