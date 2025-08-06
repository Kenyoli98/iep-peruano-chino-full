// Types for the backend application

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: 'admin' | 'profesor' | 'alumno';
  fechaNacimiento: string;
  sexo?: string;
  nacionalidad?: string;
  dni?: string;
  direccion?: string;
  telefono?: string;
  nombreApoderado?: string;
  telefonoApoderado?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsuarioInput {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: 'admin' | 'profesor' | 'alumno';
  fechaNacimiento: string;
  sexo?: string;
  nacionalidad?: string;
  dni?: string;
  direccion?: string;
  telefono?: string;
  nombreApoderado?: string;
  telefonoApoderado?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  usuario?: Omit<Usuario, 'password'>;
  error?: string;
  code?: string;
}

export interface Curso {
  id: number;
  nombre: string;
  descripcion?: string;
  nivel: string;
  grado: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CursoInput {
  nombre: string;
  descripcion?: string;
  nivel: string;
  grado: string;
}

export interface Seccion {
  id: number;
  nombre: string;
  nivel: string;
  grado: string;
  turno: string;
  aula?: string;
  capacidadMaxima?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeccionInput {
  nombre: string;
  nivel: string;
  grado: string;
  turno: string;
  aula?: string;
  capacidadMaxima?: number;
}

export interface Asignacion {
  id: number;
  profesorId: number;
  cursoId: number;
  seccionId: number;
  horario: string;
  createdAt: Date;
  updatedAt: Date;
  profesor?: Usuario;
  curso?: Curso;
  seccion?: Seccion;
}

export interface AsignacionInput {
  profesorId: number;
  cursoId: number;
  seccionId: number;
  horario: string;
}

export interface Matricula {
  id: number;
  alumnoId: number;
  seccionId: number;
  fechaMatricula: Date;
  estado: 'activo' | 'inactivo' | 'retirado';
  createdAt: Date;
  updatedAt: Date;
  alumno?: Usuario;
  seccion?: Seccion;
}

export interface MatriculaInput {
  alumnoId: number;
  seccionId: number;
  estado?: 'activo' | 'inactivo' | 'retirado';
}

export interface Nota {
  id: number;
  alumnoId: number;
  cursoId: number;
  seccionId: number;
  bimestre: number;
  nota: number;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
  alumno?: Usuario;
  curso?: Curso;
  seccion?: Seccion;
}

export interface NotaInput {
  alumnoId: number;
  cursoId: number;
  seccionId: number;
  bimestre: number;
  nota: number;
  observaciones?: string;
}

export interface Pension {
  id: number;
  alumnoId: number;
  mes: number;
  año: number;
  monto: number;
  fechaVencimiento: Date;
  fechaPago?: Date;
  estado: 'pendiente' | 'pagado' | 'vencido';
  metodoPago?: string;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
  alumno?: Usuario;
}

export interface PensionInput {
  alumnoId: number;
  mes: number;
  año: number;
  monto: number;
  fechaVencimiento: Date;
  estado?: 'pendiente' | 'pagado' | 'vencido';
  metodoPago?: string;
  observaciones?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface FilterQuery {
  search?: string;
  nivel?: string;
  grado?: string;
  turno?: string;
  estado?: string;
}

// Email types
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// JWT Payload
export interface JWTPayload {
  userId: number;
  email: string;
  rol: string;
  iat?: number;
  exp?: number;
}

// Express Request with user
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

// File upload types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// CSV Import types
export interface CsvImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  duplicates?: number;
}

// Statistics types
export interface EstadisticasGenerales {
  totalUsuarios: number;
  totalAlumnos: number;
  totalProfesores: number;
  totalCursos: number;
  totalSecciones: number;
  totalMatriculas: number;
  pensionesVencidas: number;
  pensionesDelMes: number;
}

// Error types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Database transaction types
export type TransactionClient = any; // This would be the Prisma transaction client type

// Utility types (using built-in TypeScript utility types)
// Omit, Partial, and Required are already available in TypeScript

// Environment variables
export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  FRONTEND_URL: string;
  CORS_ORIGIN: string;
}