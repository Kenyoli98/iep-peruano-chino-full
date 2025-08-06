// Types for user registration and management

export type UserRole = 'admin' | 'profesor' | 'alumno';
export type Gender = 'M' | 'F';
export type RegistrationStatus = 'pendiente' | 'activo' | 'suspendido' | 'cancelado' | 'expirado';

export interface BaseUser {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  sexo: Gender;
  nacionalidad: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  rol: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRegistrationData extends BaseUser {
  password: string;
  nombreApoderado?: string;
  telefonoApoderado?: string;
}

export interface UserFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  dni: string;
  sexo: Gender | '';
  nacionalidad: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  rol: UserRole | '';
  nombreApoderado?: string;
  telefonoApoderado?: string;
}

export interface GuardianInfo {
  nombreApoderado: string;
  telefonoApoderado: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface DNIConsultationResult {
  success: boolean;
  data?: {
    dni: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento?: string;
    sexo?: Gender;
    direccion?: string;
    nacionalidad?: string;
  };
  message?: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'date' | 'select';
  required: boolean;
  placeholder?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: string) => string | null;
  dependsOn?: string;
  showWhen?: (formData: any) => boolean;
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  showWhen?: (formData: any) => boolean;
}

export interface RegistrationFormConfig {
  sections: FormSection[];
}

// Error types
export class ValidationError extends Error {
  public field?: string;
  public code?: string;

  constructor(message: string, field?: string, code?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}

export class APIError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

// Form state types
export interface FormState {
  data: UserFormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface DNIState {
  isLoading: boolean;
  isConsulted: boolean;
  isValid?: boolean;
  error: string | null;
  data: DNIConsultationResult['data'] | null;
}

// Component props types
export interface FormFieldProps {
  config: FormFieldConfig;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface FormSectionProps {
  section: FormSection;
  formData: UserFormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
  disabled?: boolean;
}

export interface RegistrationFormProps {
  onSubmit: (data: UserRegistrationData) => Promise<void>;
  initialData?: Partial<UserFormData>;
  isLoading?: boolean;
  className?: string;
}

// Pre-registration types
export interface PreRegistrationData {
  nombre: string;
  apellido: string;
  dni: string;
}

export interface StudentCode {
  codigoEstudiante: string;
  dni: string;
}

export interface PreRegisteredStudent {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email?: string;
  codigoEstudiante: string;
  estadoRegistro: RegistrationStatus;
  fechaPreRegistro: string;

  fechaActivacion?: string;
  fechaVencimiento?: string;
  ultimoLogin?: string;
}

export interface StudentRegistrationCompletion {
  codigoEstudiante: string;
  dni: string;
  email: string;
  password: string;
  fechaNacimiento?: string;
  sexo?: Gender;
  nacionalidad?: string;
  direccion?: string;
  telefono?: string;
  nombreApoderado?: string;
  telefonoApoderado?: string;
}

export interface PreRegistrationStats {
  total: number;
  pendientes: number;
  activos: number;
  expirados: number;
  suspendidos: number;
  cancelados: number;
  proximosVencer: number;
  registrosRecientes: number;
}

export interface PreRegistrationListResponse {
  registros: PreRegisteredStudent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CodeValidationResponse {
  valido: boolean;
  mensaje?: string;
  nombre?: string;
  apellido?: string;
  dni?: string;
  fechaVencimiento?: string;
  token?: string;
}