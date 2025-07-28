'use client';

import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSignOutAlt, FaUser, FaBook, FaClipboardList } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuth(['profesor']); // 🔒 Solo permite acceso a rol "profesor"
  const [nombre, setNombre] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setNombre(localStorage.getItem('nombre') || '');
    }
  }, []);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nombre');
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      sessionStorage.removeItem('token');
    }
    router.push('/login');
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Panel Profesor
              </h1>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">Bienvenido, {nombre}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <FaSignOutAlt />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              href="/profesor/notas"
              className="border-b-2 border-transparent hover:border-blue-500 py-4 px-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaClipboardList className="inline mr-2" />
              Gestión de Notas
            </Link>
            <Link
              href="/profesor/cursos"
              className="border-b-2 border-transparent hover:border-blue-500 py-4 px-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaBook className="inline mr-2" />
              Mis Cursos
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}