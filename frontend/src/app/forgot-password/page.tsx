'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  requestPasswordReset,
  validateEmail,
  verifyEmailExists
} from '../../services/passwordRecoveryService';

interface RecoveryUserData {
  dni: string;
  nombre: string;
  apellido: string;
  email: {
    full: string;
    masked: string;
  };
  telefono: {
    full: string;
    masked: string;
  };
  method: 'email';
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userData, setUserData] = useState<RecoveryUserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay datos del usuario en sessionStorage
    const storedData = sessionStorage.getItem('recoveryUserData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.method === 'email') {
          setUserData(parsedData);
          // No predeterminar el email, dejar que el usuario lo ingrese
        } else {
          // Si el método no es email, redirigir a verificación de DNI
          router.push('/forgot-password-dni');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/forgot-password-dni');
      }
    } else {
      // Si no hay datos, redirigir a verificación de DNI
      router.push('/forgot-password-dni');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Validar email
    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      setIsLoading(false);
      return;
    }

    try {
      // Si viene de verificación de DNI, validar que el email corresponda al usuario
      if (userData) {
        if (email.toLowerCase() !== userData.email.full.toLowerCase()) {
          setError(
            'El correo electrónico ingresado no corresponde al usuario identificado por DNI.'
          );
          setIsLoading(false);
          return;
        }
      } else {
        // Si no viene de DNI, verificar si el email existe en la base de datos
        const emailVerification = await verifyEmailExists(email);

        if (!emailVerification.exists) {
          setError(
            'El correo electrónico no está registrado en nuestro sistema.'
          );
          setIsLoading(false);
          return;
        }
      }

      // Proceder con la solicitud de reset
      const data = await requestPasswordReset(email);
      setMessage(data.message);
      setIsSubmitted(true);

      // En desarrollo, mostrar el enlace de reset
      if (data.dev?.resetUrl) {
        console.log('URL de reset (desarrollo):', data.dev.resetUrl);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error de conexión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full space-y-8'>
        <div className='bg-white rounded-2xl shadow-xl p-8 relative'>
          {/* Close Button */}
          <button
            onClick={() => {
              sessionStorage.removeItem('recoveryUserData');
              router.push('/login');
            }}
            className='absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'
            aria-label='Cerrar y volver al login'
          >
            <XMarkIcon className='h-5 w-5' />
          </button>

          {/* Header */}
          <div className='text-center mb-8'>
            {userData ? (
              <>
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                  Hola, {userData.nombre}
                </h2>
                <p className='text-gray-600'>
                  Confirma tu correo electrónico para recibir el enlace de
                  recuperación.
                </p>
              </>
            ) : (
              <>
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                  ¿Olvidaste tu contraseña?
                </h2>
                <p className='text-gray-600'>
                  Ingresa tu correo electrónico y te enviaremos un enlace para
                  restablecer tu contraseña.
                </p>
              </>
            )}
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Email Input */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Correo electrónico
                </label>
                {userData && (
                  <p className='text-sm text-gray-500 mb-2'>
                    Sugerencia: {userData.email.masked}
                  </p>
                )}
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                  placeholder={
                    userData ? userData.email.masked : 'tu@email.com'
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                    Enviando...
                  </div>
                ) : (
                  'Enviar enlace de recuperación'
                )}
              </button>
            </form>
          ) : (
            /* Success Message */
            <div className='text-center space-y-4'>
              <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg'>
                {message}
              </div>
              <p className='text-sm text-gray-600'>
                Revisa tu bandeja de entrada y la carpeta de spam.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className='mt-6 space-y-3'>
            {/* Back to DNI verification */}
            <div className='text-center'>
              <button
                onClick={() => {
                  sessionStorage.removeItem('recoveryUserData');
                  router.push('/forgot-password-dni');
                }}
                className='inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors'
              >
                <ArrowLeftIcon className='h-4 w-4 mr-2' />
                Cambiar usuario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
