import React from 'react';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
    </div>
    <div className="mt-6 text-center">
      <p className="text-slate-600 font-medium">Cargando cursos...</p>
      <p className="text-slate-400 text-sm mt-1">Por favor espere un momento</p>
    </div>
  </div>
);

export default LoadingSpinner;