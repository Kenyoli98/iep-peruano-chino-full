'use client';

import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCheckCircle, FaExclamationTriangle, FaClock, FaCalendarAlt } from 'react-icons/fa';

export default function PensionesAlumnoPage() {
  const [mounted, setMounted] = useState(false);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setNombre(localStorage.getItem('nombre') || '');
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Mis Pensiones</h1>
        <p className="text-green-100">Consulta el estado de tus pagos y pensiones</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaCheckCircle className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagadas</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FaClock className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <FaExclamationTriangle className="text-red-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencidas</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaMoneyBillWave className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Adeudado</p>
              <p className="text-2xl font-semibold text-gray-900">S/ 0.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pensiones Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Estado de Pensiones</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pensiones registradas</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron registros de pensiones para tu cuenta.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Métodos de Pago</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-blue-600 mb-2">
                <FaMoneyBillWave size={32} className="mx-auto" />
              </div>
              <h3 className="font-medium text-gray-900">Pago en Efectivo</h3>
              <p className="text-sm text-gray-500 mt-1">En la oficina de administración</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-green-600 mb-2">
                <FaCheckCircle size={32} className="mx-auto" />
              </div>
              <h3 className="font-medium text-gray-900">Transferencia Bancaria</h3>
              <p className="text-sm text-gray-500 mt-1">Cuenta corriente del colegio</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-purple-600 mb-2">
                <FaClock size={32} className="mx-auto" />
              </div>
              <h3 className="font-medium text-gray-900">Pago Online</h3>
              <p className="text-sm text-gray-500 mt-1">Próximamente disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}