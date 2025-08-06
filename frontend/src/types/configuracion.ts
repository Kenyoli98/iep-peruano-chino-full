// Tipos para la configuración de grados por nivel
export interface GradosPorNivel {
  [nivel: string]: string[];
}

export interface ConfiguracionNivel {
  nivel: string;
  grados: string[];
  id?: string; // Para identificar niveles únicamente durante edición
}

export interface ModalConfiguracionGradosProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (configuracion: GradosPorNivel) => void;
  configuracionActual: GradosPorNivel;
  loading?: boolean;
}

export interface FormularioNivelProps {
  nivel: string;
  grados: string[];
  onGradosChange: (grados: string[]) => void;
  onEliminarNivel?: () => void;
  esNuevo?: boolean;
}
