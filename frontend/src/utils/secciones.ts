import { Seccion, Filtros } from '@/types/secciones';

// Función para filtrar secciones
export const filtrarSecciones = (secciones: Seccion[], filtros: Filtros): Seccion[] => {
  return secciones.filter(seccion => {
    const coincideNombre = !filtros.nombre.trim() || 
      seccion.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    
    const coincideNivel = !filtros.nivel || seccion.nivel === filtros.nivel;
    
    const coincideGrado = !filtros.grado || seccion.grado === filtros.grado;
    
    return coincideNombre && coincideNivel && coincideGrado;
  });
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

// Función para validar datos de sección
export const validarSeccion = (seccion: { nombre: string; nivel: string; grado: string }): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  
  if (!seccion.nombre || seccion.nombre.trim().length < 1) {
    errores.push('El nombre de la sección es obligatorio');
  }
  
  if (seccion.nombre && seccion.nombre.length > 50) {
    errores.push('El nombre de la sección no debe superar los 50 caracteres');
  }
  
  if (!seccion.nivel) {
    errores.push('El nivel educativo es obligatorio');
  }
  
  if (!seccion.grado) {
    errores.push('El grado es obligatorio');
  }
  
  return {
    valido: errores.length === 0,
    errores
  };
};

// Función para formatear nombre de sección
export const formatearNombreSeccion = (nombre: string): string => {
  return nombre.trim().toUpperCase();
};

// Función para generar mensaje de confirmación de eliminación
export const generarMensajeEliminacion = (seccion: Seccion): string => {
  return `¿Estás seguro de que deseas eliminar la sección "${seccion.nombre}" del ${seccion.nivel} - ${seccion.grado}? Esta acción eliminará todos los datos asociados incluyendo estudiantes y registros académicos.`;
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

// Función para exportar secciones a CSV
export const exportarSeccionesACsv = (secciones: Seccion[]): string => {
  const headers = ['ID', 'Nombre', 'Nivel', 'Grado'];
  const csvContent = [
    headers.join(','),
    ...secciones.map(seccion => [
      seccion.id,
      `"${seccion.nombre}"`,
      `"${seccion.nivel}"`,
      `"${seccion.grado}"`
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

// Función para obtener grados por nivel (ahora usa el servicio de configuración)
export const obtenerGradosPorNivel = (): Record<string, string[]> => {
  // Importación dinámica para evitar problemas de SSR
  if (typeof window !== 'undefined') {
    try {
      const { ConfiguracionService } = require('@/services/configuracionService');
      return ConfiguracionService.obtenerGradosPorNivel();
    } catch (error) {
      console.warn('Error al cargar configuración, usando valores por defecto:', error);
    }
  }
  
  // Fallback para SSR o errores
  return {
    'INICIAL': ['3 años', '4 años', '5 años'],
    'PRIMARIA': ['1°', '2°', '3°', '4°', '5°', '6°'],
    'SECUNDARIA': ['1°', '2°', '3°', '4°', '5°']
  };
};

// Función para formatear nivel y grado
export const formatearNivelGrado = (nivel: string, grado: string): string => {
  return `${nivel} - ${grado}`;
};