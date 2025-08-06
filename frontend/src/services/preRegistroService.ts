// Service for pre-registration API calls

import {
  PreRegistrationData,
  StudentCode,
  StudentRegistrationCompletion,
  PreRegistrationStats,
  PreRegistrationListResponse,
  CodeValidationResponse,
  ApiResponse,
  PreRegisteredStudent
} from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  return response.json();
};

// Public endpoints (no authentication required)
export const preRegistroService = {
  // Validate student code and DNI
  async validateCode(data: StudentCode): Promise<ApiResponse<CodeValidationResponse>> {
    const response = await fetch(`${API_BASE_URL}/pre-registro/validar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.json();
  },

  // Complete student registration (now sends verification code)
  async completeRegistration(data: StudentRegistrationCompletion): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/pre-registro/completar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.json();
  },

  // Verify email code and complete registration
  async verifyEmailAndCompleteRegistration(data: {
    codigoEstudiante: string;
    dni: string;
    codigoVerificacion: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/pre-registro/verificar-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.json();
  },

  // Resend verification code
  async resendVerificationCode(data: {
    codigoEstudiante: string;
    dni: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/pre-registro/reenviar-codigo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.json();
  },
};

// Admin endpoints (authentication required)
export const preRegistroAdminService = {
  // Create pre-registration
  async createPreRegistration(data: PreRegistrationData): Promise<ApiResponse<PreRegisteredStudent>> {
    return makeAuthenticatedRequest('/pre-registro/admin/crear', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get pre-registration list with filters
  async getPreRegistrations(params: {
    estado?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<ApiResponse<PreRegistrationListResponse>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = `/pre-registro/admin/listar${queryString ? `?${queryString}` : ''}`;
    
    return makeAuthenticatedRequest(url);
  },

  // Get statistics
  async getStatistics(): Promise<ApiResponse<PreRegistrationStats>> {
    return makeAuthenticatedRequest('/pre-registro/admin/estadisticas');
  },

  // Change student status (activate/suspend)
  async changeStudentStatus(id: number, estado: 'activo' | 'suspendido'): Promise<ApiResponse> {
    return makeAuthenticatedRequest(`/pre-registro/admin/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    });
  },

  // Reactivate expired pre-registration
  async reactivatePreRegistration(id: number, diasExtension: number = 30): Promise<ApiResponse> {
    return makeAuthenticatedRequest(`/pre-registro/admin/${id}/reactivar`, {
      method: 'PATCH',
      body: JSON.stringify({ diasExtension }),
    });
  },

  // Bulk create pre-registrations
  async bulkCreatePreRegistrations(students: PreRegistrationData[]): Promise<ApiResponse> {
    const results = [];
    const errors = [];

    for (const student of students) {
      try {
        const result = await this.createPreRegistration(student);
        results.push(result);
      } catch (error) {
        errors.push({
          student,
          error: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0 
        ? `${results.length} estudiantes pre-registrados exitosamente`
        : `${results.length} exitosos, ${errors.length} errores`,
      data: {
        successful: results,
        errors
      }
    };
  },

  // Import pre-registrations from CSV
  async importFromCSV(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('csv', file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pre-registro/admin/importar-csv`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.json();
  },

  // Export to Excel (placeholder - would need backend implementation)
  async exportToExcel(filters: {
    estado?: string;
    search?: string;
  } = {}): Promise<Blob> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = `/pre-registro/admin/export${queryString ? `?${queryString}` : ''}`;
    
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Error al exportar datos');
    }

    return response.blob();
  },
};

// Utility functions
export const preRegistroUtils = {
  // Format student code for display
  formatStudentCode(code: string): string {
    if (!code || code.length !== 11) return code;
    // Format as: 20-12345678-X
    return `${code.substring(0, 2)}-${code.substring(2, 10)}-${code.substring(10)}`;
  },

  // Extract DNI from student code
  extractDNIFromCode(code: string): string | null {
    if (!code || code.length !== 11 || !code.startsWith('20')) {
      return null;
    }
    return code.substring(2, 10);
  },

  // Validate DNI format
  validateDNI(dni: string): boolean {
    return /^\d{8}$/.test(dni);
  },

  // Get status color for UI
  getStatusColor(status: string): string {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      activo: 'bg-green-100 text-green-800',
      suspendido: 'bg-red-100 text-red-800',
      cancelado: 'bg-gray-100 text-gray-800',
      expirado: 'bg-orange-100 text-orange-800',
      'por vencer': 'bg-amber-100 text-amber-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  },

  // Get status label in Spanish
  getStatusLabel(status: string): string {
    const labels = {
      pendiente: 'Pendiente',
      activo: 'Activo',
      suspendido: 'Suspendido',
      cancelado: 'Cancelado',
      expirado: 'Expirado',
      'por vencer': 'Por Vencer',
    };
    return labels[status as keyof typeof labels] || status;
  },

  // Check if registration is expired
  isExpired(fechaVencimiento: string): boolean {
    return new Date() > new Date(fechaVencimiento);
  },

  // Get days until expiration
  getDaysUntilExpiration(fechaVencimiento: string): number {
    const now = new Date();
    const expiry = new Date(fechaVencimiento);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Check if registration is about to expire (within 7 days)
  isAboutToExpire(fechaVencimiento: string): boolean {
    const daysUntilExpiration = this.getDaysUntilExpiration(fechaVencimiento);
    return daysUntilExpiration > 0 && daysUntilExpiration <= 7;
  },

  // Get effective status (considering expiration)
  getEffectiveStatus(estadoRegistro: string, fechaVencimiento: string | null): string {
    if (!fechaVencimiento) return estadoRegistro;
    
    if (estadoRegistro === 'pendiente') {
      if (this.isExpired(fechaVencimiento)) {
        return 'expirado';
      } else if (this.isAboutToExpire(fechaVencimiento)) {
        return 'por vencer';
      }
    }
    
    return estadoRegistro;
  },
};