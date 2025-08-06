// Modern form section component for organizing form fields into logical groups

import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { FormSectionProps } from '@/types/user';

interface ExtendedFormSectionProps extends FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
  variant?: 'default' | 'outlined' | 'filled';
}

export const FormSection: React.FC<ExtendedFormSectionProps> = ({
  title,
  children,
  collapsible = false,
  defaultCollapsed = false,
  icon,
  description,
  badge,
  variant = 'default',
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const sectionClasses = {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    outlined: 'border-2 border-gray-200 rounded-lg',
    filled: 'bg-gray-50 border border-gray-200 rounded-lg'
  };

  return (
    <div className={`${sectionClasses[variant]} overflow-hidden transition-all duration-200 ${className}`}>
      {/* Section Header */}
      <div
        className={`px-6 py-4 border-b border-gray-200 ${
          collapsible ? 'cursor-pointer hover:bg-gray-50' : ''
        } transition-colors duration-150`}
        onClick={toggleCollapse}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex-shrink-0 text-gray-600">
                {icon}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                {badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {badge}
                  </span>
                )}
              </div>
              {description && (
                <p className="mt-1 text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {collapsible && (
            <div className="flex-shrink-0 ml-4">
              <button
                type="button"
                className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? 'Expandir sección' : 'Contraer sección'}
              >
                {isCollapsed ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-none opacity-100'
        } overflow-hidden`}
      >
        <div className="px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Predefined section variants for common use cases
export const PersonalInfoSection: React.FC<Omit<ExtendedFormSectionProps, 'title' | 'icon'>> = (props) => (
  <FormSection
    title="Información Personal"
    description="Datos básicos del usuario"
    icon={
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    }
    {...props}
  />
);

export const ContactInfoSection: React.FC<Omit<ExtendedFormSectionProps, 'title' | 'icon'>> = (props) => (
  <FormSection
    title="Información de Contacto"
    description="Datos de contacto y ubicación"
    icon={
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    }
    {...props}
  />
);

export const SecuritySection: React.FC<Omit<ExtendedFormSectionProps, 'title' | 'icon'>> = (props) => (
  <FormSection
    title="Seguridad"
    description="Configuración de contraseña y acceso"
    icon={
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    }
    {...props}
  />
);

export const GuardianInfoSection: React.FC<Omit<ExtendedFormSectionProps, 'title' | 'icon'>> = (props) => (
  <FormSection
    title="Información del Apoderado"
    description="Datos del responsable del estudiante"
    badge="Solo estudiantes"
    icon={
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    }
    {...props}
  />
);