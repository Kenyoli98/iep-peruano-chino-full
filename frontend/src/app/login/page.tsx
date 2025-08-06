'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useLogin from '../../hooks/useLogin';
import Modal from '../../components/ui/modal';
import Button from '../../components/ui/button';

const imagenes = [
  '/images/imagen-login1.jpg',
  '/images/imagen-login2.jpg',
  '/images/imagen-login3.jpg'
];

function FondoAnimado() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice(prev => (prev + 1) % imagenes.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <Image
      src={imagenes[indice]}
      alt='Fondo dinámico'
      fill
      style={{ objectFit: 'cover', objectPosition: 'center' }}
      quality={85}
      priority
      className='hidden sm:block'
    />
  );
}

export default function LoginPage() {
  const {
    dni,
    setDni,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    error,
    handleLogin
  } = useLogin();
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) setModalOpen(true);
  }, [error]);

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex-col sm:flex-row'>
      {/* Panel Login */}
      <div className='w-full sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 flex flex-col justify-center items-center min-h-screen p-4 sm:p-8 bg-white/80 backdrop-blur-sm'>
        {/* Contenedor principal */}
        <div className='w-full max-w-md space-y-6'>
          {/* Logo */}
          <div className='flex justify-center'>
            <div className='relative group'>
              <div className='absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500'></div>
              <div className='relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100/50 backdrop-blur-sm'>
                <Image
                  src='/images/logo-colegio.png'
                  alt='Logo I.E.P Peruano Chino'
                  width={80}
                  height={80}
                  className='transition-transform duration-300 group-hover:scale-105'
                />
              </div>
            </div>
          </div>

          {/* Título y subtítulo */}
          <div className='text-center space-y-2'>
            <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent leading-tight'>
              Portal Educativo
            </h1>
            <div className='space-y-1'>
              <p className='text-gray-700 font-medium text-sm'>
                I.E.P Peruano Chino
              </p>
              <p className='text-gray-500 text-xs font-light'>
                Plataforma integral para la comunidad educativa
              </p>
            </div>
            <div className='flex justify-center space-x-1 mt-3'>
              <div className='w-8 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full'></div>
              <div className='w-2 h-0.5 bg-gray-300 rounded-full'></div>
              <div className='w-8 h-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full'></div>
            </div>
          </div>

          {/* Formulario */}
          <form className='space-y-4' onSubmit={handleLogin}>
            <div className='space-y-4'>
              <div className='group'>
                <label className='block text-gray-800 font-semibold mb-3 text-sm tracking-wide'>
                  DNI
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <svg
                      className='h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2'
                      />
                    </svg>
                  </div>
                  <input
                    type='text'
                    value={dni}
                    onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder='Ingrese su DNI (8 dígitos)'
                    className='w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-gray-300 transition-all duration-300 font-medium'
                    disabled={loading}
                    autoComplete='username'
                    maxLength={8}
                  />
                </div>
              </div>

              <div className='group'>
                <label className='block text-gray-800 font-semibold mb-3 text-sm tracking-wide'>
                  CONTRASEÑA
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <svg
                      className='h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Ingrese su contraseña'
                    className='w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-12 pr-12 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-gray-300 transition-all duration-300 font-medium'
                    disabled={loading}
                    autoComplete='current-password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200'
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg
                        className='h-5 w-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                        />
                      </svg>
                    ) : (
                      <svg
                        className='h-5 w-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between pt-1'>
              <div className='flex items-center group'>
                <div className='relative'>
                  <input
                    type='checkbox'
                    id='rememberMe'
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200'
                    disabled={loading}
                  />
                </div>
                <label
                  htmlFor='rememberMe'
                  className='ml-3 text-gray-700 text-sm font-medium cursor-pointer group-hover:text-gray-900 transition-colors duration-200'
                >
                  Mantener sesión activa
                </label>
              </div>

              <Link
                href='/forgot-password-dni'
                className='text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline transition-all duration-200'
              >
                ¿Olvidó su contraseña?
              </Link>
            </div>

            {/* Botones */}
            <div className='space-y-3 mt-6'>
              {/* Botón de login */}
              <button
                type='submit'
                disabled={loading}
                className='group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500'></div>
                <div className='relative flex items-center justify-center space-x-3'>
                  {loading ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      <span className='font-semibold'>
                        Verificando credenciales...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className='w-5 h-5 transition-transform duration-200 group-hover:translate-x-1'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                        />
                      </svg>
                      <span className='font-semibold'>Ingresar</span>
                    </>
                  )}
                </div>
              </button>

              {/* Botón de registro */}
              <Link
                href='/registro/validar'
                className='group relative w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3'
              >
                <svg
                  className='w-5 h-5 transition-transform duration-200 group-hover:translate-x-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                  />
                </svg>
                <span className='font-semibold'>Registrarse</span>
              </Link>
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm text-center font-medium shadow-sm'>
                <div className='flex items-center justify-center space-x-2'>
                  <svg
                    className='w-4 h-4 text-red-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </form>

          {/* Información adicional */}
          <div className='mt-4 text-center space-y-3'>
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100'>
              <p className='text-gray-700 text-xs font-medium mb-1'>
                💡 Soporte técnico disponible
              </p>
              <p className='text-gray-600 text-xs'>
                Contacte a la administración para asistencia
              </p>
            </div>
            <div className='flex justify-center items-center space-x-4 text-xs text-gray-500 font-medium'>
              <div className='flex items-center space-x-1'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span>Estudiantes</span>
              </div>
              <div className='flex items-center space-x-1'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span>Padres</span>
              </div>
              <div className='flex items-center space-x-1'>
                <div className='w-2 h-2 bg-gray-600 rounded-full'></div>
                <span>Docentes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Volver */}
      <Link
        href='/'
        className='fixed top-6 left-6 z-50 group flex items-center bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl px-5 py-3 text-gray-700 font-medium hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105'
      >
        <svg
          className='w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10 19l-7-7m0 0l7-7m-7 7h18'
          />
        </svg>
        <span className='font-semibold'>Inicio</span>
      </Link>

      {/* Fondo dinámico + elementos institucionales */}
      <div className='relative flex-1 hidden sm:block'>
        <div className='absolute inset-0'>
          <FondoAnimado />
          {/* Overlay profesional con gradiente mejorado */}
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900/75 via-slate-800/70 to-gray-900/80'></div>
          {/* Patrón geométrico sutil */}
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full'></div>
            <div className='absolute top-40 right-32 w-24 h-24 border border-white/15 rounded-full'></div>
            <div className='absolute bottom-32 left-32 w-40 h-40 border border-white/10 rounded-full'></div>
          </div>
        </div>

        {/* Información institucional amigable */}
        <div className='absolute bottom-8 right-8 max-w-xs'>
          <div className='bg-gradient-to-br from-white/70 to-blue-50/60 backdrop-blur-sm border border-blue-200/30 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
            <div className='text-center space-y-4'>
              {/* Icono decorativo */}
              <div className='flex justify-center'>
                <div className='bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-3 shadow-lg'>
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
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                </div>
              </div>

              <div className='space-y-2'>
                <h3 className='text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent'>
                  🏫 I.E.P Peruano Chino
                </h3>
                <p className='text-gray-600 text-xs font-medium leading-relaxed'>
                  Asociación de Beneficencia China de Nasca
                </p>
              </div>

              <div className='w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent'></div>

              <div className='space-y-3'>
                <div className='bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-3 border border-blue-200'>
                  <p className='text-blue-800 font-semibold text-sm flex items-center justify-center'>
                    <span className='mr-2'>🌟</span>
                    &ldquo;Caminando hacia el futuro&rdquo;
                  </p>
                </div>

                <div className='flex justify-center space-x-2'>
                  <div className='bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md hover:bg-blue-600 transition-colors duration-200'>
                    📚 Educación
                  </div>
                  <div className='bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md hover:bg-green-600 transition-colors duration-200'>
                    ⭐ Excelencia
                  </div>
                </div>

                <div className='flex justify-center'>
                  <div className='bg-indigo-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md hover:bg-indigo-600 transition-colors duration-200'>
                    💎 Valores
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer mejorado */}
        <div className='absolute bottom-4 right-4 text-white/90 text-xs font-medium bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2'>
          © {new Date().getFullYear()} I.E.P Peruano Chino - Todos los derechos
          reservados
        </div>
      </div>

      {/* Modal de error */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title='Error de inicio de sesión'
      >
        {error}
      </Modal>
    </div>
  );
}
