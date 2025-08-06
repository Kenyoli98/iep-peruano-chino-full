'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { FormField } from '@/components/ui/form-field';
import { SubmitButton } from '@/components/ui/button';
import { preRegistroService } from '@/services/preRegistroService';
import { StudentRegistrationCompletion } from '@/types/user';

export default function CompletarRegistroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [modalMessage, setModalMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  
  const [formData, setFormData] = useState<StudentRegistrationCompletion>({
    codigoEstudiante: '',
    dni: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    sexo: 'M',
    nacionalidad: 'Peruana',
    direccion: '',
    telefono: '',
    nombreApoderado: '',
    telefonoApoderado: ''
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const codigo = searchParams.get('codigo');
    const dni = searchParams.get('dni');
    const token = searchParams.get('token');

    if (!codigo || !dni) {
      router.push('/registro/validar');
      return;
    }

    setFormData(prev => ({
      ...prev,
      codigoEstudiante: codigo,
      dni: dni
    }));
  }, [searchParams, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Real-time validation
    validateField(field, value);
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'email':
        if (!value.trim()) {
          error = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'El formato del email no es válido';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'La contraseña es requerida';
        } else if (value.length < 8) {
          error = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
        }
        break;
        
      case 'telefono':
        if (value && !/^\d{9}$/.test(value)) {
          error = 'El teléfono debe tener 9 dígitos';
        }
        break;
        
      case 'telefonoApoderado':
        if (value && !/^\d{9}$/.test(value)) {
          error = 'El teléfono del apoderado debe tener 9 dígitos';
        }
        break;
        
      case 'fechaNacimiento':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 3 || age > 100) {
            error = 'La edad debe estar entre 3 y 100 años';
          }
        }
        break;
        
      case 'sexo':
      case 'direccion':
      case 'nacionalidad':
      case 'nombreApoderado':
        // Optional fields - no validation required
        break;
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleConfirmPasswordChange = (field: string, value: string) => {
    setConfirmPassword(value);
    setTouched(prev => ({ ...prev, confirmPassword: true }));
    
    // Clear error when user starts typing
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
    
    // Validate confirm password
    let error = '';
    if (!value) {
      error = 'Confirma tu contraseña';
    } else if (formData.password !== value) {
      error = 'Las contraseñas no coinciden';
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, confirmPassword: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos';
    }

    // Guardian phone validation (optional but if provided, must be valid)
    if (formData.telefonoApoderado && !/^\d{9}$/.test(formData.telefonoApoderado)) {
      newErrors.telefonoApoderado = 'El teléfono del apoderado debe tener 9 dígitos';
    }

    // Birth date validation (optional but if provided, must be valid)
    if (formData.fechaNacimiento) {
      const birthDate = new Date(formData.fechaNacimiento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 3 || age > 100) {
        newErrors.fechaNacimiento = 'La edad debe estar entre 3 y 100 años';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await preRegistroService.completeRegistration(formData);
      
      if (response.success) {
        // Redirect to email verification page with user email
        const params = new URLSearchParams({
          email: formData.email,
          codigo: formData.codigoEstudiante,
          dni: formData.dni
        });
        router.push(`/registro/verificar-email?${params.toString()}`);
      } else {
        setModalType('error');
        setModalMessage(response.message || 'Error al completar el registro');
        setShowModal(true);
      }
    } catch (error: any) {
      console.error('Error completing registration:', error);
      setModalType('error');
      setModalMessage(error.message || 'Error al completar el registro. Por favor, intenta nuevamente.');
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhone = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 9);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Completar Registro
            </h1>
            <p className="text-gray-600">
              Completa tu información personal para finalizar tu registro
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {/* Email */}
            <FormField
              config={{
                name: 'email',
                label: 'Correo Electrónico',
                type: 'email',
                placeholder: 'tu.email@ejemplo.com',
                required: true
              }}
              value={formData.email}
              error={errors.email}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              touched={touched.email || false}
            />

            {/* Password */}
            <FormField
              config={{
                name: 'password',
                label: 'Contraseña',
                type: 'password',
                placeholder: 'Mínimo 8 caracteres',
                required: true
              }}
              value={formData.password}
              error={errors.password}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              touched={touched.password || false}
            />

            {/* Confirm Password */}
            <FormField
              config={{
                name: 'confirmPassword',
                label: 'Confirmar Contraseña',
                type: 'password',
                placeholder: 'Repite tu contraseña',
                required: true
              }}
              value={confirmPassword}
              error={errors.confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleFieldBlur}
              touched={touched.confirmPassword || false}
            />

            {/* Required Fields */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  config={{
                    name: 'fechaNacimiento',
                    label: 'Fecha de Nacimiento',
                    type: 'date',
                    required: true
                  }}
                  value={formData.fechaNacimiento || ''}
                  error={errors.fechaNacimiento}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  touched={touched.fechaNacimiento || false}
                />

                <FormField
                  config={{
                    name: 'sexo',
                    label: 'Sexo',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'M', label: 'Masculino' },
                      { value: 'F', label: 'Femenino' }
                    ]
                  }}
                  value={formData.sexo || 'M'}
                  error={errors.sexo}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  touched={touched.sexo || false}
                />
              </div>

              <div className="mt-6">
                <FormField
                  config={{
                    name: 'direccion',
                    label: 'Dirección',
                    type: 'text',
                    placeholder: 'Tu dirección completa',
                    required: true
                  }}
                  value={formData.direccion || ''}
                  error={errors.direccion}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  touched={touched.direccion || false}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                  config={{
                    name: 'telefono',
                    label: 'Teléfono',
                    type: 'tel',
                    placeholder: '987654321',
                    required: true
                  }}
                  value={formData.telefono || ''}
                  error={errors.telefono}
                  onChange={(field, value) => handleInputChange(field, formatPhone(value))}
                  onBlur={handleFieldBlur}
                  touched={touched.telefono || false}
                />

                <FormField
                  config={{
                    name: 'nacionalidad',
                    label: 'Nacionalidad',
                    type: 'text',
                    placeholder: 'Peruana',
                    required: true
                  }}
                  value={formData.nacionalidad || ''}
                  error={errors.nacionalidad}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  touched={touched.nacionalidad || false}
                />
              </div>
            </div>

            {/* Guardian Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Apoderado</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  config={{
                    name: 'nombreApoderado',
                    label: 'Nombre del Apoderado',
                    type: 'text',
                    placeholder: 'Nombre completo del apoderado',
                    required: true
                  }}
                  value={formData.nombreApoderado || ''}
                  error={errors.nombreApoderado}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  touched={touched.nombreApoderado || false}
                />

                <FormField
                  config={{
                    name: 'telefonoApoderado',
                    label: 'Teléfono del Apoderado',
                    type: 'tel',
                    placeholder: '987654321',
                    required: true
                  }}
                  value={formData.telefonoApoderado || ''}
                  error={errors.telefonoApoderado}
                  onChange={(field, value) => handleInputChange(field, formatPhone(value))}
                  onBlur={handleFieldBlur}
                  touched={touched.telefonoApoderado || false}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <SubmitButton
              className="w-full"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Enviando código de verificación...' : 'Continuar'}
            </SubmitButton>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/registro/validar')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Volver a validar código
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                modalType === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {modalType === 'success' ? (
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircleIcon className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                modalType === 'success' ? 'text-green-900' : 'text-red-900'
              }`}>
                {modalType === 'success' ? '¡Éxito!' : 'Error'}
              </h3>
              <p className="text-gray-600 mb-6">{modalMessage}</p>
              {modalType === 'error' && (
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cerrar
                </button>
              )}
              {modalType === 'success' && (
                <p className="text-sm text-gray-500">Redirigiendo a verificación de email...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}