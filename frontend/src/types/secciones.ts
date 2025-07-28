// Interfaces para el módulo de secciones
export interface Seccion {
  id: number;
  nombre: string;
  nivel: string;
  grado: string;
}

export interface Filtros {
  nombre: string;
  nivel: string;
  grado: string;
}

export interface SeccionInput {
  nombre: string;
  nivel: string;
  grado: string;
}

export interface PaginacionProps {
  paginaActual: number;
  totalRegistros: number;
  registrosPorPagina: number;
  onCambiarPagina: (pagina: number) => void;
  loading: boolean;
}

export interface FiltrosProps {
  filtros: Filtros;
  setFiltros: (filtros: Filtros) => void;
  onBuscar: () => void;
  onLimpiar: () => void;
  loading: boolean;
}

export interface TablaSeccionesProps {
  secciones: Seccion[];
  onEliminar: (seccion: Seccion) => void;
  onEditar: (seccion: Seccion) => void;
  loading: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export interface ModalCrearProps extends ModalProps {
  nuevaSeccion: SeccionInput;
  setNuevaSeccion: (seccion: SeccionInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  gradosPorNivel: Record<string, string[]>;
}

export interface ModalEditarProps extends ModalProps {
  seccion: Seccion | null;
  setSeccion: (seccion: Seccion) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface ModalEliminarProps extends ModalProps {
  seccion: Seccion | null;
  onConfirmar: () => void;
}

export interface ModalCsvProps extends ModalProps {
  archivo: File | null;
  setArchivo: (archivo: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface EmptyStateProps {
  busquedaRealizada: boolean;
  filtros?: Filtros;
}