import { Curso, Filtros } from '@/types/cursos';

// Función para filtrar cursos por nombre
export const filtrarCursos = (cursos: Curso[], filtros: Filtros): Curso[] => {
  if (!filtros.nombre.trim()) {
    return cursos;
  }
  
  return cursos.filter(curso => 
    curso.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
  );
};

// Función para validar archivo CSV
export const validarArchivoCsv = (archivo: File): { valido: boolean; mensaje: string } => {
  if (!archivo) {
    return { valido: false, mensaje: 'No se ha seleccionado ningún archivo' };
  }
  
  if (!archivo.name.toLowerCase().endsWith('.csv')) {
    return { valido: false, mensaje: 'El archivo debe tener extensión .csv' };
  }
  
  if (archivo.size > 5 * 1024 * 1024) { // 5MB
    return { valido: false, mensaje: 'El archivo no debe superar los 5MB' };
  }
  
  return { valido: true, mensaje: 'Archivo válido' };
};

// Función para validar datos de curso
export const validarCurso = (curso: { nombre: string; descripcion?: string }): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  
  if (!curso.nombre || curso.nombre.trim().length < 2) {
    errores.push('El nombre del curso debe tener al menos 2 caracteres');
  }
  
  if (curso.nombre && curso.nombre.length > 100) {
    errores.push('El nombre del curso no debe superar los 100 caracteres');
  }
  
  if (curso.descripcion && curso.descripcion.length > 500) {
    errores.push('La descripción no debe superar los 500 caracteres');
  }
  
  return {
    valido: errores.length === 0,
    errores
  };
};

// Función para formatear nombre de curso
export const formatearNombreCurso = (nombre: string): string => {
  return nombre.trim().toUpperCase();
};

// Función para generar mensaje de confirmación de eliminación
export const generarMensajeEliminacion = (curso: Curso): string => {
  return `¿Estás seguro de que deseas eliminar el curso "${curso.nombre}"? Esta acción eliminará todos los datos asociados incluyendo secciones, asignaciones y registros académicos.`;
};

// Función para calcular estadísticas de paginación
export const calcularEstadisticasPaginacion = (
  totalRegistros: number,
  paginaActual: number,
  registrosPorPagina: number
) => {
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina + 1;
  const fin = Math.min(paginaActual * registrosPorPagina, totalRegistros);
  
  return {
    totalPaginas,
    inicio,
    fin,
    hayPaginaAnterior: paginaActual > 1,
    hayPaginaSiguiente: paginaActual < totalPaginas
  };
};

// Función para generar rango de páginas para la paginación
export const generarRangoPaginas = (paginaActual: number, totalPaginas: number, maxPaginas: number = 5): number[] => {
  if (totalPaginas <= maxPaginas) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }
  
  const mitad = Math.floor(maxPaginas / 2);
  let inicio = Math.max(1, paginaActual - mitad);
  let fin = Math.min(totalPaginas, inicio + maxPaginas - 1);
  
  if (fin - inicio + 1 < maxPaginas) {
    inicio = Math.max(1, fin - maxPaginas + 1);
  }
  
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
};

// Función para debounce (útil para búsquedas)
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Función para manejar errores de API
export const manejarErrorApi = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Ha ocurrido un error inesperado';
};

// Función para formatear fecha
export const formatearFecha = (fecha: string | Date): string => {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  
  return fechaObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para exportar cursos a CSV
export const exportarCursosACsv = (cursos: Curso[]): string => {
  const headers = ['ID', 'Nombre', 'Descripción'];
  const csvContent = [
    headers.join(','),
    ...cursos.map(curso => [
      curso.id,
      `"${curso.nombre}"`,
      `"${curso.descripcion || ''}"`
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

// Función para descargar archivo CSV
export const descargarCsv = (contenido: string, nombreArchivo: string): void => {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};