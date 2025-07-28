// src/app/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para agregar token automáticamente a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas y tokens expirados
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token ha expirado o es inválido
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const errorMessage = error.response.data?.error || '';
      
      // Verificar si es un error de token expirado o inválido
      if (errorMessage.includes('Token inválido') || errorMessage.includes('expirado') || errorMessage.includes('Token no proporcionado')) {
        // Limpiar datos de sesión
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('nombre');
          localStorage.removeItem('rol');
          
          // Crear y mostrar notificación personalizada
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
          
          // Remover notificación después de 3 segundos
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 3000);
          
          // Redirigir al login
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Función para carga masiva de cursos
export const crearCursosMasivo = async (cursos) => {
  try {
    const response = await api.post('/cursos/create-massive', cursos);
    return response.data;
  } catch (error) {
    console.error('Error en la carga masiva de cursos:', error);
    throw error;
  }
};

export default api;
