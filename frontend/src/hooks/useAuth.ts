import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(allowedRoles: string[]): boolean | null {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || '');
      setRol(localStorage.getItem('rol') || '');
    }
  }, []);

  const memoizedAllowedRoles = useMemo(() => allowedRoles, [allowedRoles.join(',')]);

  const checkAuth = useCallback(() => {
    if (!mounted) return;
    if (!token || !rol) {
      setAllowed(false);
      router.push('/login');
      return;
    }
    if (memoizedAllowedRoles.includes(rol)) {
      setAllowed(true);
    } else {
      setAllowed(false);
      router.push('/login');
    }
  }, [mounted, token, rol, memoizedAllowedRoles, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return allowed;
}
