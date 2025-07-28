import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService } from '../services/auth';

export default function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
      setEmail(rememberedEmail);
      setRememberMe(!!rememberedEmail);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('El formato del correo electrónico no es válido.');
      return;
    }
    if (email.length > 100 || password.length > 100) {
      setError('Correo o contraseña demasiado largos.');
      return;
    }
    setLoading(true);
    try {
      const data = await loginService(email, password, rememberMe);
      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('rememberedEmail', email);
      } else {
        sessionStorage.setItem('token', data.token);
        localStorage.removeItem('rememberedEmail');
      }
      localStorage.setItem('rol', data.usuario.rol);
      localStorage.setItem('nombre', data.usuario.nombre);
      const rol = data.usuario.rol;
      if (rol === 'admin') {
        router.push('/admin');
      } else if (rol === 'profesor') {
        router.push('/profesor/notas');
      } else if (rol === 'alumno') {
        router.push('/alumno/pensiones');
      }
    } catch (err: any) {
      setError(err.error || err.message || 'Error desconocido al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    error,
    handleLogin,
  };
}