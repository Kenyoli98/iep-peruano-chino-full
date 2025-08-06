'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { preRegistroService } from '@/services/preRegistroService';
import { FormField } from '@/components/forms/FormField';

interface FormData {
  codigoVerificacion: string;
}

interface FormErrors {
  codigoVerificacion?: string;
  general?: string;
}

export default function VerificarEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState<FormData>({
    codigoVerificacion: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  // Obtener parámetros de la URL
  const codigoEstudiante = searchParams.get('codigo') || '';
  const dni = searchParams.get('dni') || '';
  const emailParam = searchParams.get('email') || '';

  useEffect(() => {
    // Verificar que tenemos los parámetros necesarios
    if (!codigoEstudiante || !dni) {
      router.push('/registro/validar');
      return;
    }
    
    setEmail(emailParam);
    
    // Iniciar countdown para reenvío
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [codigoEstudiante, dni, emailParam, router]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Solo permitir números y limitar a 6 dígitos
    if (field === 'codigoVerificacion') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInputBlur = (field: keyof FormData) => {
    const value = formData[field];
    let error = '';

    switch (field) {
      case 'codigoVerificacion':
        if (!value.trim()) {
          error = 'El código de verificación es requerido';
        } else if (value.length !== 6) {
          error = 'El código debe tener 6 dígitos';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.codigoVerificacion.trim()) {
      newErrors.codigoVerificacion = 'El código de verificación es requerido';
    } else if (formData.codigoVerificacion.length !== 6) {
      newErrors.codigoVerificacion = 'El código debe tener 6 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await preRegistroService.verifyEmailAndCompleteRegistration({
        codigoEstudiante,
        dni,
        codigoVerificacion: formData.codigoVerificacion
      });

      if (response.success) {
        // Redirigir a página de éxito o login
        router.push('/login?message=registro-completado');
      } else {
        setErrors({ general: response.message || 'Error al verificar el código' });
      }
    } catch (error) {
      console.error('Error verificando código:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'Error al verificar el código' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await preRegistroService.resendVerificationCode({
        codigoEstudiante,
        dni
      });

      if (response.success) {
        setCanResend(false);
        setCountdown(60);
        
        // Reiniciar countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Mostrar mensaje de éxito
        alert('Código reenviado exitosamente');
      } else {
        setErrors({ general: response.message || 'Error al reenviar el código' });
      }
    } catch (error) {
      console.error('Error reenviando código:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'Error al reenviar el código' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verificar Email
          </h1>
          <p className="text-gray-600 text-sm">
            Hemos enviado un código de 6 dígitos a:
          </p>
          <p className="text-blue-600 font-medium mt-1">
            {email || 'tu email'}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Revisa tu bandeja de entrada y spam. El código expira en 15 minutos.
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          <FormField
            name="codigoVerificacion"
            label="Código de Verificación"
            type="text"
            value={formData.codigoVerificacion}
            onChange={(value) => handleInputChange('codigoVerificacion', value)}
            onBlur={() => handleInputBlur('codigoVerificacion')}
            error={errors.codigoVerificacion}
            placeholder="123456"
            maxLength={6}
            className="text-center text-2xl font-mono tracking-widest"
            required
          />

          <button
            onClick={handleVerify}
            disabled={isLoading || formData.codigoVerificacion.length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verificando...
              </div>
            ) : (
              'Verificar Código'
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">
              ¿No recibiste el código?
            </p>
            {canResend ? (
              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm underline disabled:opacity-50"
              >
                Reenviar código
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Podrás reenviar en {countdown} segundos
              </p>
            )}
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <button
              onClick={() => router.push('/registro/validar')}
              className="text-gray-600 hover:text-gray-700 text-sm underline"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}