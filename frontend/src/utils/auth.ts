/**
 * Utilidad para obtener el token de autenticación
 * Busca primero en localStorage (sesión persistente) y luego en sessionStorage (sesión temporal)
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  // Primero intentar obtener el token de localStorage (sesión persistente)
  let token = localStorage.getItem('token');

  // Si no está en localStorage, intentar sessionStorage (sesión temporal)
  if (!token) {
    token = sessionStorage.getItem('token');
  }

  return token;
};

/**
 * Utilidad para limpiar todos los datos de autenticación
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('nombre');
  localStorage.removeItem('rol');
  localStorage.removeItem('rememberedEmail');

  // Limpiar sessionStorage
  sessionStorage.removeItem('token');
};
