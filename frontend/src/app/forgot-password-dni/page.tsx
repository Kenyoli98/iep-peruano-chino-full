'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface UserData {
  exists: boolean;
  nombre?: string;
  apellido?: string;
  email?: {
    full: string;
    masked: string;
  };
  telefono?: {
    full: string;
    masked: string;
  };
  recoveryOptions?: {
    email: boolean;
  };
}

export default function ForgotPasswordDNI() {
  const [dni, setDni] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 8) {
      setDni(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (dni.length !== 8) {
      setError('El DNI debe tener 8 dígitos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        'http://localhost:3001/usuarios/verify-dni',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ dni })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar el DNI');
      }

      if (data.exists) {
        setUserData(data);
      } else {
        setError('No se encontró ningún usuario con este DNI');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al verificar el DNI'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoveryMethod = (method: 'email') => {
    if (!userData) return;

    // Guardar datos del usuario en sessionStorage para el siguiente paso
    sessionStorage.setItem(
      'recoveryUserData',
      JSON.stringify({
        dni,
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        telefono: userData.telefono,
        method
      })
    );

    // Redirigir al método de email
    router.push('/forgot-password');
  };

  if (userData) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
        <div className='max-w-md w-full space-y-8'>
          <div className='bg-white rounded-2xl shadow-xl p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                <IdentificationIcon className='h-6 w-6 text-green-600' />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>
                ¡Hola, {userData.nombre} {userData.apellido}!
              </h2>
              <p className='text-gray-600 mt-2'>
                Selecciona cómo deseas recuperar tu contraseña
              </p>
            </div>

            {/* Recovery Options */}
            <div className='space-y-4'>
              {userData.recoveryOptions?.email && (
                <button
                  onClick={() => handleRecoveryMethod('email')}
                  className='w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group'
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-semibold text-gray-900 group-hover:text-blue-700'>
                        Recuperar por correo electrónico
                      </h3>
                      <p className='text-sm text-gray-600 mt-1'>
                        Enviaremos un enlace a: {userData.email?.masked}
                      </p>
                    </div>
                    <div className='text-blue-500'>
                      <svg
                        className='w-5 h-5'
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
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Back Button */}
            <div className='mt-8 text-center'>
              <button
                onClick={() => setUserData(null)}
                className='text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center mx-auto'
              >
                <ArrowLeftIcon className='h-4 w-4 mr-2' />
                Verificar otro DNI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full space-y-8'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
              <IdentificationIcon className='h-6 w-6 text-blue-600' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Verificación de Identidad
            </h2>
            <p className='text-gray-600 mt-2'>
              Ingresa tu DNI para verificar tu identidad
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='dni'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Documento de Identidad (DNI)
              </label>
              <input
                id='dni'
                type='text'
                value={dni}
                onChange={handleDniChange}
                placeholder='12345678'
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono'
                maxLength={8}
                required
              />
              <p className='text-xs text-gray-500 mt-1 text-center'>
                Ingresa los 8 dígitos de tu DNI
              </p>
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
                <p className='text-red-600 text-sm text-center'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading || dni.length !== 8}
              className='w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                  Verificando...
                </div>
              ) : (
                'Verificar DNI'
              )}
            </button>
          </form>

          {/* Navigation */}
          <div className='mt-8 text-center space-y-4'>
            <Link
              href='/login'
              className='text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center'
            >
              <ArrowLeftIcon className='h-4 w-4 mr-2' />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
