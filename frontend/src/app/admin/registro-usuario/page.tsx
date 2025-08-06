'use client';

import React, { useState } from 'react';
import { UserGroupIcon, AcademicCapIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { PreRegistrationForm } from '@/components/pre-registro/pre-registration-form';
import { ModernRegistrationForm } from '@/components/registration/modern-registration-form';
import Button from '@/components/ui/button';

type RegistrationMode = 'selection' | 'pre-student' | 'pre-professor' | 'admin-direct';

export default function RegistroUsuarioPage() {
  const [mode, setMode] = useState<RegistrationMode>('selection');

  const handleSuccess = () => {
    // Redirigir a la lista de usuarios después del registro exitoso
    window.location.href = '/admin/usuarios';
  };

  const handleBack = () => {
    setMode('selection');
  };

  if (mode === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sistema de Registro
              </h1>
              <p className="text-gray-600">
                Selecciona el tipo de registro que deseas realizar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pre-registro de Estudiantes */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Pre-registro de Estudiantes
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Crea códigos de pre-registro para que los estudiantes completen su registro posteriormente
                  </p>
                  <Button
                    onClick={() => window.location.href = '/admin/pre-registros'}
                    className="w-full"
                    variant="primary"
                  >
                    Iniciar Pre-registro
                  </Button>
                </div>
              </div>

              {/* Pre-registro de Profesores */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <AcademicCapIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Pre-registro de Profesores
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Crea códigos de pre-registro para que los profesores completen su registro posteriormente
                  </p>
                  <Button
                    onClick={() => setMode('pre-professor')}
                    className="w-full"
                    variant="primary"
                  >
                    Iniciar Pre-registro
                  </Button>
                </div>
              </div>

              {/* Registro Directo de Administradores */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Registro de Administradores
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Registro directo e inmediato de nuevos administradores del sistema
                  </p>
                  <Button
                    onClick={() => setMode('admin-direct')}
                    className="w-full"
                    variant="primary"
                  >
                    Registrar Admin
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'pre-student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <Button
                onClick={handleBack}
                variant="secondary"
                className="mb-4"
              >
                ← Volver al menú
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Pre-registro de Estudiantes
              </h1>
              <p className="text-gray-600 mt-2">
                Crea un código de pre-registro que el estudiante usará para completar su registro
              </p>
            </div>
            <PreRegistrationForm
              onSuccess={handleSuccess}
              onCancel={handleBack}
            />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'pre-professor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <Button
                onClick={handleBack}
                variant="secondary"
                className="mb-4"
              >
                ← Volver al menú
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Pre-registro de Profesores
              </h1>
              <p className="text-gray-600 mt-2">
                Crea un código de pre-registro que el profesor usará para completar su registro
              </p>
            </div>
            {/* TODO: Crear componente específico para pre-registro de profesores */}
            <div className="text-center py-12">
              <p className="text-gray-500">Componente de pre-registro de profesores en desarrollo</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'admin-direct') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              onClick={handleBack}
              variant="secondary"
              className="mb-4"
            >
              ← Volver al menú
            </Button>
          </div>
          <ModernRegistrationForm 
            onSuccess={handleSuccess}
            onCancel={handleBack}
            className="bg-white rounded-xl shadow-lg"
          />
        </div>
      </div>
    );
  }

  return null;
}
