// Pre-registration form for students (Admin use)

'use client';

import React, { useState } from 'react';
import { UserIcon, IdentificationIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PreRegistrationData, ApiResponse, PreRegisteredStudent } from '@/types/user';
import { preRegistroAdminService } from '@/services/preRegistroService';
import Button from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';

interface PreRegistrationFormProps {
  onSuccess?: (student: PreRegisteredStudent) => void;
  onCancel?: () => void;
  className?: string;
}

export const PreRegistrationForm: React.FC<PreRegistrationFormProps> = ({
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState<PreRegistrationData>({
    nombre: '',
    apellido: '',
    dni: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'El nombre solo puede contener letras';
        return '';
      
      case 'apellido':
        if (!value.trim()) return 'El apellido es requerido';
        if (value.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'El apellido solo puede contener letras';
        return '';
      
      case 'dni':
        if (!value.trim()) return 'El DNI es requerido';
        if (!/^\d{8}$/.test(value)) return 'El DNI debe tener exactamente 8 dígitos';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof PreRegistrationData]);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Event handlers
  const handleFieldChange = (name: string, value: string) => {
    // Format and clean input
    let cleanValue = value;
    
    if (name === 'nombre' || name === 'apellido') {
      // Capitalize first letter of each word and remove extra spaces
      cleanValue = value
        .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    } else if (name === 'dni') {
      // Only allow numbers and limit to 8 digits
      cleanValue = value.replace(/\D/g, '').slice(0, 8);
    }
    
    setFormData(prev => ({ ...prev, [name]: cleanValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFieldBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof PreRegistrationData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      nombre: true,
      apellido: true,
      dni: true
    });
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response: ApiResponse<PreRegisteredStudent> = await preRegistroAdminService.createPreRegistration(formData);
      
      if (response.success && response.data) {
        // Reset form
        setFormData({ nombre: '', apellido: '', dni: '' });
        setErrors({});
        setTouched({});
        
        // Call success callback
        onSuccess?.(response.data);
      } else {
        throw new Error(response.message || 'Error al crear pre-registro');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Check if it's a specific field error
      if (errorMessage.includes('DNI')) {
        setErrors(prev => ({ ...prev, dni: errorMessage }));
      } else {
        setErrors(prev => ({ ...prev, general: errorMessage }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ nombre: '', apellido: '', dni: '' });
    setErrors({});
    setTouched({});
  };

  // Check if form is valid by validating all fields in real-time
  const isFormValid = (() => {
    // First check if all fields have values
    const hasAllValues = Object.values(formData).every(value => value.trim() !== '');
    if (!hasAllValues) return false;
    
    // Then validate each field for errors
    const hasErrors = Object.keys(formData).some(key => {
      const error = validateField(key, formData[key as keyof PreRegistrationData]);
      return error !== '';
    });
    
    return !hasErrors;
  })();

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pre-registrar Estudiante
        </h2>
        <p className="text-gray-600">
          Complete los datos básicos del estudiante. Se generará un código único que el estudiante usará para completar su registro.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          {/* Nombre */}
          <FormField
            config={{
              name: 'nombre',
              label: 'Nombre',
              type: 'text',
              required: true,
              placeholder: 'Ingrese el nombre del estudiante'
            }}
            value={formData.nombre}
            error={touched.nombre ? errors.nombre : undefined}
            touched={touched.nombre}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={isSubmitting}
          />

          {/* Apellido */}
          <FormField
            config={{
              name: 'apellido',
              label: 'Apellido',
              type: 'text',
              required: true,
              placeholder: 'Ingrese el apellido del estudiante'
            }}
            value={formData.apellido}
            error={touched.apellido ? errors.apellido : undefined}
            touched={touched.apellido}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={isSubmitting}
          />

          {/* DNI */}
          <FormField
            config={{
              name: 'dni',
              label: 'DNI',
              type: 'text',
              required: true,
              placeholder: '12345678',
              maxLength: 8
            }}
            value={formData.dni}
            error={touched.dni ? errors.dni : undefined}
            touched={touched.dni}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={isSubmitting}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel || handleReset}
            disabled={isSubmitting}
          >
            {onCancel ? 'Cancelar' : 'Limpiar'}
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid || isSubmitting}
            loading={isSubmitting}
            leftIcon={!isSubmitting ? <PlusIcon className="h-4 w-4" /> : undefined}
          >
            {isSubmitting ? 'Creando...' : 'Pre-registrar Estudiante'}
          </Button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          ¿Qué sucede después?
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Se generará un código único tipo RUC para el estudiante</li>
          <li>• El estudiante tendrá 30 días para completar su registro</li>
          <li>• Podrá usar el código y su DNI en el portal de registro público</li>
          <li>• Una vez completado, podrá acceder al sistema</li>
        </ul>
      </div>
    </div>
  );
};

export default PreRegistrationForm;