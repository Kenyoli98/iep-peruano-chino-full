// Interfaces para el módulo de cursos
export interface Curso {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Filtros {
  nombre: string;
}

export interface CursoInput {
  nombre: string;
  descripcion?: string;
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

export interface TablaCursosProps {
  cursos: Curso[];
  onEliminar: (curso: Curso) => void;
  onEditar: (curso: Curso) => void;
  loading: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export interface ModalCrearProps extends ModalProps {
  nuevoCurso: CursoInput;
  setNuevoCurso: (curso: CursoInput) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface ModalEditarProps extends ModalProps {
  curso: Curso | null;
  setCurso: (curso: Curso) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface ModalEliminarProps extends ModalProps {
  curso: Curso | null;
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
