// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { getAuthToken, clearAuthData } from '../utils/auth';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CursoMasivo {
  nombre: string;
  descripcion?: string;
  nivel: string;
  grado: string;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Interceptor to automatically add token to each request
api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle responses and expired tokens
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // If token has expired or is invalid
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      const errorMessage = (error.response.data as any)?.error || '';

      // Check if it's an expired or invalid token error
      if (
        errorMessage.includes('Token inválido') ||
        errorMessage.includes('expirado') ||
        errorMessage.includes('Token no proporcionado')
      ) {
        // Clear session data
        if (typeof window !== 'undefined') {
          clearAuthData();

          // Create and show custom notification
          const notification = document.createElement('div');
          notification.innerHTML = `
            <div style="
              position: fixed;
              top: 20px;
              right: 20px;
              background: #fee2e2;
              border: 2px solid #fecaca;
              border-radius: 12px;
              padding: 16px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              z-index: 9999;
              max-width: 400px;
              font-family: system-ui, -apple-system, sans-serif;
            ">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <div style="color: #dc2626; font-size: 18px;">⚠️</div>
                <h3 style="margin: 0; color: #991b1b; font-weight: 600;">Sesión Expirada</h3>
              </div>
              <p style="margin: 0; color: #7f1d1d; font-size: 14px;">
                Tu sesión ha expirado. Serás redirigido al login en unos segundos.
              </p>
            </div>
          `;
          document.body.appendChild(notification);

          // Remove notification after 3 seconds
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 3000);

          // Redirect to login
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Function for bulk course creation
export const crearCursosMasivo = async (cursos: CursoMasivo[]): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/cursos/create-massive', cursos);
    return response.data;
  } catch (error) {
    console.error('Error en la carga masiva de cursos:', error);
    throw error;
  }
};

export default api;