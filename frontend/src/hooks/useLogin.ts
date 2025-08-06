import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService } from '../services/auth';

export default function useLogin() {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberedDni = localStorage.getItem('rememberedDni') || '';
      setDni(rememberedDni);
      setRememberMe(!!rememberedDni);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!dni || !password) {
      setError('Por favor, ingresa tu DNI y contraseña.');
      return;
    }
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(dni)) {
      setError('El DNI debe tener exactamente 8 dígitos.');
      return;
    }
    if (dni.length > 8 || password.length > 100) {
      setError('DNI o contraseña demasiado largos.');
      return;
    }
    setLoading(true);
    try {
      const data = await loginService(dni, password, rememberMe);
      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('rememberedDni', dni);
      } else {
        sessionStorage.setItem('token', data.token);
        localStorage.removeItem('rememberedDni');
      }
      localStorage.setItem('rol', data.usuario.rol);
      localStorage.setItem('nombre', data.usuario.nombre);
      const rol = data.usuario.rol.toLowerCase(); // Convertir a minúsculas para comparación
      if (rol === 'admin') {
        router.push('/admin');
      } else if (rol === 'profesor') {
        router.push('/profesor/notas');
      } else if (rol === 'alumno') {
        router.push('/alumno/pensiones');
      }
    } catch (err: any) {
      setError(
        err.error || err.message || 'Error desconocido al iniciar sesión.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    dni,
    setDni,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    error,
    handleLogin
  };
}
