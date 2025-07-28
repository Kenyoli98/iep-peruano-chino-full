import { GradosPorNivel } from '@/types/configuracion';

const STORAGE_KEY = 'configuracion_grados_por_nivel';

// Configuración por defecto
const CONFIGURACION_DEFAULT: GradosPorNivel = {
  'INICIAL': ['3', '4', '5'],
  'PRIMARIA': ['1', '2', '3', '4', '5', '6'],
  'SECUNDARIA': ['1', '2', '3', '4', '5']
};

export class ConfiguracionService {
  /**
   * Limpia un grado eliminando texto adicional y dejando solo el número
   */
  static limpiarGrado(grado: string): string {
    // Extraer solo números del grado
    const numeroExtraido = grado.match(/\d+/);
    return numeroExtraido ? numeroExtraido[0] : grado;
  }

  /**
   * Migra configuración antigua a formato limpio (solo números)
   */
  static migrarConfiguracion(configuracion: GradosPorNivel): GradosPorNivel {
    const configuracionMigrada: GradosPorNivel = {};
    
    Object.entries(configuracion).forEach(([nivel, grados]) => {
      configuracionMigrada[nivel] = grados.map(grado => this.limpiarGrado(grado));
    });
    
    return configuracionMigrada;
  }

  /**
   * Obtiene la configuración de grados por nivel
   */
  static obtenerGradosPorNivel(): GradosPorNivel {
    try {
      const configuracionGuardada = localStorage.getItem(STORAGE_KEY);
      if (configuracionGuardada) {
        const configuracion = JSON.parse(configuracionGuardada);
        // Migrar automáticamente si contiene texto adicional
        const configuracionMigrada = this.migrarConfiguracion(configuracion);
        
        // Si hubo cambios en la migración, guardar la versión limpia
        if (JSON.stringify(configuracion) !== JSON.stringify(configuracionMigrada)) {
          this.guardarGradosPorNivel(configuracionMigrada);
        }
        
        return configuracionMigrada;
      }
    } catch (error) {
      console.warn('Error al cargar configuración guardada, usando configuración por defecto:', error);
    }
    
    return { ...CONFIGURACION_DEFAULT };
  }

  /**
   * Guarda la configuración de grados por nivel
   */
  static guardarGradosPorNivel(configuracion: GradosPorNivel): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configuracion));
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      throw new Error('No se pudo guardar la configuración');
    }
  }

  /**
   * Restaura la configuración por defecto
   */
  static restaurarConfiguracionDefault(): GradosPorNivel {
    const configuracionDefault = { ...CONFIGURACION_DEFAULT };
    this.guardarGradosPorNivel(configuracionDefault);
    return configuracionDefault;
  }

  /**
   * Valida que la configuración sea válida
   */
  static validarConfiguracion(configuracion: GradosPorNivel): { valida: boolean; errores: string[]; advertencias: string[] } {
    const errores: string[] = [];
    const advertencias: string[] = [];

    // Verificar que hay al menos un nivel
    if (Object.keys(configuracion).length === 0) {
      errores.push('Debe haber al menos un nivel educativo');
    }

    // Verificar cada nivel
    Object.entries(configuracion).forEach(([nivel, grados]) => {
      if (!nivel.trim()) {
        errores.push('Los nombres de nivel no pueden estar vacíos');
      }

      if (!Array.isArray(grados) || grados.length === 0) {
        errores.push(`El nivel "${nivel}" debe tener al menos un grado`);
      }

      // Verificar que no hay grados duplicados
      const gradosUnicos = new Set(grados.filter(g => g.trim()));
      if (gradosUnicos.size !== grados.filter(g => g.trim()).length) {
        errores.push(`El nivel "${nivel}" tiene grados duplicados`);
      }

      // Verificar que no hay grados vacíos
      if (grados.some(g => !g.trim())) {
        errores.push(`El nivel "${nivel}" tiene grados vacíos`);
      }

      // Advertencia sobre grados con texto adicional
      const gradosConTexto = grados.filter(g => {
        const soloNumero = /^\d+$/.test(g.trim());
        return !soloNumero && g.trim();
      });
      
      if (gradosConTexto.length > 0) {
        advertencias.push(`Recomendación: En el nivel "${nivel}", se sugiere usar solo números para los grados (ej: "3" en lugar de "3 años")`);
      }
    });

    return {
      valida: errores.length === 0,
      errores,
      advertencias
    };
  }

  /**
   * Agrega un nuevo nivel
   */
  static agregarNivel(configuracion: GradosPorNivel, nivel: string, grados: string[]): GradosPorNivel {
    return {
      ...configuracion,
      [nivel]: [...grados]
    };
  }

  /**
   * Elimina un nivel
   */
  static eliminarNivel(configuracion: GradosPorNivel, nivel: string): GradosPorNivel {
    const nuevaConfiguracion = { ...configuracion };
    delete nuevaConfiguracion[nivel];
    return nuevaConfiguracion;
  }

  /**
   * Actualiza los grados de un nivel
   */
  static actualizarGradosNivel(configuracion: GradosPorNivel, nivel: string, grados: string[]): GradosPorNivel {
    return {
      ...configuracion,
      [nivel]: [...grados]
    };
  }

  /**
   * Exporta la configuración a JSON
   */
  static exportarConfiguracion(): string {
    const configuracion = this.obtenerGradosPorNivel();
    return JSON.stringify(configuracion, null, 2);
  }

  /**
   * Importa configuración desde JSON
   */
  static importarConfiguracion(jsonString: string): GradosPorNivel {
    try {
      const configuracion = JSON.parse(jsonString);
      const validacion = this.validarConfiguracion(configuracion);
      
      if (!validacion.valida) {
        throw new Error(`Configuración inválida: ${validacion.errores.join(', ')}`);
      }
      
      this.guardarGradosPorNivel(configuracion);
      return configuracion;
    } catch (error) {
      throw new Error(`Error al importar configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Actualiza un nivel educativo (nombre y grados)
   */
  static actualizarNivel(configuracion: GradosPorNivel, nivelAnterior: string, nuevoNombre: string, nuevosGrados: string[]): GradosPorNivel {
    // Verificar que el nivel anterior existe
    if (!configuracion[nivelAnterior]) {
      throw new Error(`El nivel "${nivelAnterior}" no existe`);
    }
    
    // Verificar que el nuevo nombre no existe ya (a menos que sea el mismo nivel)
    if (nuevoNombre !== nivelAnterior && configuracion[nuevoNombre]) {
      throw new Error(`Ya existe un nivel con el nombre "${nuevoNombre}"`);
    }
    
    // Crear nueva configuración
    const nuevaConfiguracion = { ...configuracion };
    
    // Si cambió el nombre del nivel, eliminar el anterior
    if (nivelAnterior !== nuevoNombre) {
      delete nuevaConfiguracion[nivelAnterior];
    }
    
    // Asignar los nuevos grados al nivel (con el nombre nuevo o el mismo)
    nuevaConfiguracion[nuevoNombre] = [...nuevosGrados];
    
    return nuevaConfiguracion;
  }
}