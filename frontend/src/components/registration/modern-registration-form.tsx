// Modern user registration form component with comprehensive validation and professional UI

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon, MapPinIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { FormField } from '@/components/ui/form-field';
import { PersonalInfoSection, ContactInfoSection, SecuritySection, GuardianInfoSection } from '@/components/ui/form-section';
import { CancelButton, SubmitButton } from '@/components/ui/button';
import { SuccessModal } from '@/components/ui/modal';
import { UserRole } from '@/types/user';
import { FORM_CONFIG } from '@/utils/validation';

interface ModernRegistrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const ModernRegistrationForm: React.FC<ModernRegistrationFormProps> = ({
  onSuccess,
  onCancel,
  className = ''
}) => {
  const router = useRouter();
  
  const handleFormSubmit = async (data: any, role: any) => {
    try {
      // Import the registration service
      const { registrarUsuario } = await import('@/services/registroUsuarioService');
      await registrarUsuario(data);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const {
    formData,
    errors,
    touched,
    isSubmitting,
    showSuccessModal,
    canSubmit,
    dniState,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    resetForm,
    setShowSuccessModal
  } = useRegistrationForm({
    onSubmit: handleFormSubmit
  });

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/admin/usuarios');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    if (onSuccess) {
      onSuccess();
    } else {
      router.push('/admin/usuarios');
    }
  };

  const handleRegisterAnother = () => {
    setShowSuccessModal(false);
    // Reset form would be handled by the hook
    window.location.reload();
  };

  const renderFormField = (fieldConfig: any) => {
    const fieldName = fieldConfig.name;
    const isVisible = !fieldConfig.visibleFor || fieldConfig.visibleFor.includes(formData.rol as UserRole);
    
    if (!isVisible) return null;

    // Special handling for DNI field
    if (fieldName === 'dni') {
      return (
        <FormField
          key={fieldName}
          config={fieldConfig}
          value={formData[fieldName as keyof typeof formData] as string}
          error={errors[fieldName]}
          touched={touched[fieldName]}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          icon={<IdentificationIcon className="h-5 w-5" />}
          loading={dniState.isLoading}
          success={dniState.isValid}
          helpText="El DNI será validado automáticamente"
        />
      );
    }

    // Special handling for password fields
    if (fieldName === 'password') {
      return (
        <FormField
          key={fieldName}
          config={fieldConfig}
          value={formData[fieldName as keyof typeof formData] as string}
          error={errors[fieldName]}
          touched={touched[fieldName]}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          icon={<KeyIcon className="h-5 w-5" />}
          showPasswordStrength={true}
          helpText="Mínimo 6 caracteres, se recomienda incluir mayúsculas, números y símbolos"
        />
      );
    }

    // Get appropriate icon for field
    const getFieldIcon = (name: string) => {
      switch (name) {
        case 'nombres':
        case 'apellidos':
        case 'nombreApoderado':
          return <UserIcon className="h-5 w-5" />;
        case 'email':
          return <EnvelopeIcon className="h-5 w-5" />;
        case 'telefono':
        case 'telefonoApoderado':
          return <PhoneIcon className="h-5 w-5" />;
        case 'direccion':
          return <MapPinIcon className="h-5 w-5" />;
        default:
          return undefined;
      }
    };

    return (
      <FormField
        key={fieldName}
        config={fieldConfig}
        value={formData[fieldName as keyof typeof formData] as string}
        error={errors[fieldName]}
        touched={touched[fieldName]}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        icon={getFieldIcon(fieldName)}
      />
    );
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-8 px-6 pt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Registro de Usuario
        </h1>
        <p className="text-gray-600">
          Complete el formulario para registrar un nuevo usuario en el sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Role Selection */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tipo de Usuario
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FORM_CONFIG.sections[0].fields[0].options?.map((option) => (
              <label
                key={option.value}
                className={`
                  relative flex cursor-pointer rounded-lg border p-4 focus:outline-none
                  ${
                    formData.rol === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  }
                `.replace(/\s+/g, ' ').trim()}
              >
                <input
                  type="radio"
                  name="rol"
                  value={option.value}
                  checked={formData.rol === option.value}
                  onChange={(e) => {
                    handleFieldChange('rol', e.target.value);
                  }}
                  className="sr-only"
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium">{option.label}</p>
                    </div>
                  </div>
                  {formData.rol === option.value && (
                    <div className="shrink-0 text-blue-600">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <PersonalInfoSection
          section={FORM_CONFIG.sections.find(s => s.title === 'Información Personal')!}
          formData={formData}
          errors={errors}
          touched={touched}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FORM_CONFIG.sections
              .find(section => section.title === 'Información Personal')
              ?.fields.slice(1) // Skip role field
              .map(renderFormField)}
          </div>
        </PersonalInfoSection>

        {/* Contact Information */}
        <ContactInfoSection
          section={FORM_CONFIG.sections.find(s => s.title === 'Información de Contacto')!}
          formData={formData}
          errors={errors}
          touched={touched}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FORM_CONFIG.sections
              .find(section => section.title === 'Información de Contacto')
              ?.fields.map(renderFormField)}
          </div>
        </ContactInfoSection>

        {/* Guardian Information (only for students) */}
        {formData.rol === 'alumno' && (
          <GuardianInfoSection
            section={FORM_CONFIG.sections.find(s => s.title === 'Información del Apoderado')!}
            formData={formData}
            errors={errors}
            touched={touched}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FORM_CONFIG.sections
                .find(section => section.title === 'Información del Apoderado')
                ?.fields.map(renderFormField)}
            </div>
          </GuardianInfoSection>
        )}

        {/* Security */}
        <SecuritySection
          section={FORM_CONFIG.sections.find(s => s.title === 'Seguridad')!}
          formData={formData}
          errors={errors}
          touched={touched}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FORM_CONFIG.sections
              .find(section => section.title === 'Seguridad')
              ?.fields.map(renderFormField)}
          </div>
        </SecuritySection>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 px-6 pb-6 border-t border-gray-200 sm:justify-end">
          <CancelButton
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="order-2 sm:order-1 w-full sm:w-auto px-8 py-3 text-base font-medium"
          >
            Cancelar
          </CancelButton>
          
          <SubmitButton
            loading={isSubmitting}
            loadingText="Registrando Usuario..."
            disabled={!canSubmit || isSubmitting}
            className="order-1 sm:order-2 w-full sm:w-auto px-8 py-3 text-base font-medium"
          >
            Registrar Usuario
          </SubmitButton>
        </div>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="¡Usuario registrado exitosamente!"
        message="El usuario ha sido creado correctamente en el sistema."
        primaryAction={{
          label: 'Ver Usuarios',
          onClick: handleSuccessModalClose
        }}
        secondaryAction={{
          label: 'Registrar Otro',
          onClick: handleRegisterAnother
        }}
      />
    </div>
  );
};

export default ModernRegistrationForm;