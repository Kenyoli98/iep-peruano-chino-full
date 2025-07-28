import React from 'react';
import { EmptyStateProps } from '@/types/cursos';

const EmptyState: React.FC<EmptyStateProps> = ({ busquedaRealizada, filtros }) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-8 shadow-lg">
        <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">
          {busquedaRealizada ? 'No se encontraron cursos' : 'No hay cursos registrados'}
        </h3>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {busquedaRealizada 
            ? 'Intenta ajustar los filtros de búsqueda para encontrar cursos que coincidan con tus criterios.' 
            : 'Comienza creando tu primer curso para gestionar la información académica de manera eficiente.'
          }
        </p>
        {busquedaRealizada && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200/50">
            <p className="text-sm text-blue-700 font-medium">💡 Sugerencia</p>
            <p className="text-sm text-blue-600 mt-1">Prueba limpiando los filtros o usando términos de búsqueda más generales</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;