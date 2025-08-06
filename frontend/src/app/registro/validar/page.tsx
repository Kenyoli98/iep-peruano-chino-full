'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IdentificationIcon, UserIcon, KeyIcon } from '@heroicons/react/24/outline';
import { preRegistroService } from '@/services/preRegistroService';
import { CodeValidationResponse } from '@/types/user';
import Button from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';

export default function ValidarCodigoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    codigoEstudiante: '',
    dni: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<CodeValidationResponse | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear general errors and validation result when user changes input
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
    if (validationResult) {
      setValidationResult(null);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors = { ...errors };
    
    if (field === 'codigoEstudiante') {
      if (!formData.codigoEstudiante.trim()) {
        newErrors.codigoEstudiante = 'El código de estudiante es requerido';
      } else if (formData.codigoEstudiante.replace(/-/g, '').length !== 11) {
        newErrors.codigoEstudiante = 'El código debe tener 11 dígitos (20 + DNI + verificador)';
      } else {
        delete newErrors.codigoEstudiante;
      }
    }
    
    if (field === 'dni') {
      if (!formData.dni.trim()) {
        newErrors.dni = 'El DNI es requerido';
      } else if (formData.dni.length !== 8) {
        newErrors.dni = 'El DNI debe tener 8 dígitos';
      } else {
        delete newErrors.dni;
      }
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigoEstudiante.trim()) {
      newErrors.codigoEstudiante = 'El código de estudiante es requerido';
    } else if (formData.codigoEstudiante.replace(/-/g, '').length !== 11) {
      newErrors.codigoEstudiante = 'El código debe tener 11 dígitos (20 + DNI + verificador)';
    }

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (formData.dni.length !== 8) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return formData.codigoEstudiante.replace(/-/g, '').length === 11 && 
           formData.dni.length === 8 && 
           Object.keys(errors).length === 0;
  };

  const handleValidate = async () => {
    if (!validateForm()) return;

    setIsValidating(true);
    try {
      // Remove hyphens from student code before sending to backend
      const cleanCode = formData.codigoEstudiante.replace(/-/g, '');
      
      const response = await preRegistroService.validateCode({
        codigoEstudiante: cleanCode,
        dni: formData.dni
      });
      
      // Check if the response is successful
      if (response.success && response.data) {
        // Create validation result object that matches expected interface
        const validationResult: CodeValidationResponse = {
          valido: true,
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          dni: response.data.dni,
          fechaVencimiento: response.data.fechaVencimiento,
          mensaje: response.message
        };
        
        setValidationResult(validationResult);
        
        // Redirect to completion form with validated data
         const params = new URLSearchParams({
           codigo: cleanCode, // Use clean code without hyphens
           dni: formData.dni,
           nombre: response.data.nombre || '',
           apellido: response.data.apellido || ''
         });
        router.push(`/registro/completar?${params.toString()}`);
      } else {
        // Handle validation failure
        const validationResult: CodeValidationResponse = {
          valido: false,
          mensaje: response.message || 'Código de estudiante inválido'
        };
        setValidationResult(validationResult);
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Error al validar el código' });
    } finally {
      setIsValidating(false);
    }
  };

  const formatStudentCode = (value: string) => {
    // Remove non-numeric characters and limit to 11 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    // Format as XX-XXXXXXXX-X (20-DNI-verificador)
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 10) return cleaned.slice(0, 2) + '-' + cleaned.slice(2);
    return cleaned.slice(0, 2) + '-' + cleaned.slice(2, 10) + '-' + cleaned.slice(10);
  };

  const formatDNI = (value: string) => {
    // Remove non-numeric characters and limit to 8 digits
    return value.replace(/\D/g, '').slice(0, 8);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <KeyIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Validar Código de Registro
            </h1>
            <p className="text-gray-600 mb-3">
              Ingresa tu código de estudiante y DNI para continuar con tu registro
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm font-medium">
                ℹ️ Solo estudiantes pertenecientes a la institución pueden completar su registro
              </p>
            </div>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {validationResult && !validationResult.valido && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium mb-2">Código no válido</p>
              <p className="text-red-600 text-sm">{validationResult.mensaje}</p>
              {validationResult.fechaVencimiento && (
                <p className="text-red-600 text-sm mt-1">
                  Fecha de vencimiento: {new Date(validationResult.fechaVencimiento).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleValidate(); }} className="space-y-6">
            <FormField
              config={{
                name: 'codigoEstudiante',
                label: 'Código de Estudiante',
                type: 'text',
                placeholder: '20-12345678-X',
                required: true
              }}
              value={formData.codigoEstudiante}
              error={touched.codigoEstudiante ? errors.codigoEstudiante : ''}
              onChange={(field, value) => handleInputChange('codigoEstudiante', formatStudentCode(value))}
              onBlur={() => handleBlur('codigoEstudiante')}
              touched={touched.codigoEstudiante || false}
            />

            <FormField
              config={{
                name: 'dni',
                label: 'DNI',
                type: 'text',
                placeholder: '12345678',
                required: true
              }}
              value={formData.dni}
              error={touched.dni ? errors.dni : ''}
              onChange={(field, value) => handleInputChange('dni', formatDNI(value))}
              onBlur={() => handleBlur('dni')}
              touched={touched.dni || false}
            />

            <Button
              type="submit"
              className="w-full"
              variant="primary"
              disabled={isValidating || !isFormValid()}
            >
              {isValidating ? 'Validando...' : 'Validar Código'}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
              >
                ← Volver al Login
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes un código de registro?{' '}
                <span className="text-blue-600">Contacta con la administración</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}