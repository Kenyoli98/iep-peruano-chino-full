'use client';

import { FaCalendarAlt, FaClipboardList, FaEnvelope, FaUser } from 'react-icons/fa';
import { Profesor } from '@/services/profesoresService';

interface TablaProfesoresProps {
  profesores: Profesor[];
  onVerHorario: (profesor: Profesor) => void;
  onGestionarAsignaciones: (profesor: Profesor) => void;
  loading?: boolean;
}

const TablaProfesores = ({ 
  profesores, 
  onVerHorario, 
  onGestionarAsignaciones, 
  loading = false 
}: TablaProfesoresProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {profesores.map((profesor) => (
          <div
            key={profesor.id}
            className="p-6 hover:bg-gray-50 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              {/* Información del profesor */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                  <FaUser className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {profesor.nombre} {profesor.apellido}
                  </h3>
                  <div className="flex items-center mt-1 text-gray-500">
                    <FaEnvelope className="w-4 h-4 mr-2" />
                    <span className="text-sm">{profesor.email}</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onVerHorario(profesor)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-md"
                >
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  Ver Horario
                </button>
                <button
                  onClick={() => onGestionarAsignaciones(profesor)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FaClipboardList className="w-4 h-4 mr-2" />
                  Gestionar Asignaciones
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaProfesores;