import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, clearAuthData } from '../utils/auth';

interface UseInactivityLogoutProps {
  timeout?: number; // Tiempo en milisegundos (por defecto 30 minutos)
  onLogout?: () => void; // Función personalizada de logout
}

interface NotificationState {
  show: boolean;
  type: 'warning' | 'expired';
  message: string;
}

export function useInactivityLogout({
  timeout = 30 * 60 * 1000, // 30 minutos por defecto
  onLogout
}: UseInactivityLogoutProps = {}) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isWarningShownRef = useRef(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'warning',
    message: ''
  });

  const handleLogout = useCallback(() => {
    if (onLogout) {
      onLogout();
    } else {
      // Logout por defecto
      if (typeof window !== 'undefined') {
        clearAuthData();

        // Mostrar notificación de sesión expirada
        setNotification({
          show: true,
          type: 'expired',
          message:
            'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.'
        });

        // Redirigir después de un breve delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    }
  }, [onLogout, router]);

  const showWarning = useCallback(() => {
    if (!isWarningShownRef.current) {
      isWarningShownRef.current = true;

      // Mostrar notificación de advertencia
      setNotification({
        show: true,
        type: 'warning',
        message:
          'Tu sesión expirará en 2 minutos por inactividad. ¿Deseas continuar?'
      });
    }
  }, []);

  const handleWarningConfirm = useCallback(() => {
    // El usuario quiere continuar
    setNotification({ show: false, type: 'warning', message: '' });
    resetTimer();
    isWarningShownRef.current = false;
  }, []);

  const handleWarningCancel = useCallback(() => {
    // El usuario quiere cerrar sesión
    setNotification({ show: false, type: 'warning', message: '' });
    handleLogout();
  }, [handleLogout]);

  const handleNotificationClose = useCallback(() => {
    setNotification({ show: false, type: 'warning', message: '' });
  }, []);

  const resetTimer = useCallback(() => {
    // Limpiar temporizadores existentes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    isWarningShownRef.current = false;

    // Configurar advertencia 2 minutos antes del logout
    warningTimeoutRef.current = setTimeout(
      () => {
        showWarning();
      },
      timeout - 2 * 60 * 1000
    ); // 2 minutos antes

    // Configurar logout automático
    timeoutRef.current = setTimeout(() => {
      if (!isWarningShownRef.current) {
        handleLogout();
      }
    }, timeout);
  }, [timeout, handleLogout, showWarning]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Solo activar si hay un token (usuario logueado)
    const token = getAuthToken();
    if (!token) return;

    // Delay inicial de 5 segundos antes de activar el sistema de inactividad
    const initialDelay = setTimeout(() => {
      // Eventos que indican actividad del usuario
      const events = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click',
        'keydown'
      ];

      // Agregar listeners
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      // Iniciar el temporizador
      resetTimer();

      // Cleanup function para los eventos
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
      };
    }, 5000); // 5 segundos de delay

    // Cleanup
    return () => {
      clearTimeout(initialDelay);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [handleActivity, resetTimer]);

  return {
    resetTimer,
    handleLogout,
    notification,
    handleWarningConfirm,
    handleWarningCancel,
    handleNotificationClose
  };
}

export default useInactivityLogout;
