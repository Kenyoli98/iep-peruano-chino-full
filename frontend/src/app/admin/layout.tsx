'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import LoadingOverlay from '../../components/LoadingOverlay';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { useAuth } from '../../hooks/useAuth';
import { useInactivityLogout } from '../../hooks/useInactivityLogout';
import SessionNotification from '../../components/ui/SessionNotification';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submenuAcademicoOpen, setSubmenuAcademicoOpen] = useState(false);
  const [submenuAccesosOpen, setSubmenuAccesosOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const allowed = useAuth(['admin']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setNombre(localStorage.getItem('nombre') || '');
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nombre');
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
    }
    router.push('/login');
  }

  // Hook para logout automático por inactividad (60 minutos)
  const {
    notification,
    handleWarningConfirm,
    handleWarningCancel,
    handleNotificationClose
  } = useInactivityLogout({
    timeout: 60 * 60 * 1000, // 60 minutos
    onLogout: handleLogout
  });

  if (!mounted || allowed === null) {
    return <div className='p-10'>Cargando...</div>;
  }
  if (!nombre) {
    return <div className='p-10'>Cargando...</div>;
  }

  return (
    <>
      {/* Cabecera */}
      <AdminHeader
        nombre={nombre}
        showUserMenu={showUserMenu}
        toggleUserMenu={() => setShowUserMenu(!showUserMenu)}
        handleLogout={handleLogout}
      />

      {/* Sidebar */}
      <AdminSidebar
        nombre={nombre}
        sidebarOpen={sidebarOpen}
        sidebarRef={sidebarRef}
        submenuAcademicoOpen={submenuAcademicoOpen}
        submenuAccesosOpen={submenuAccesosOpen}
        toggleSubmenuAcademico={() => setSubmenuAcademicoOpen(prev => !prev)}
        toggleSubmenuAccesos={() => setSubmenuAccesosOpen(prev => !prev)}
        toggleSidebar={() => setSidebarOpen(prev => !prev)}
      />

      {/* Contenido principal */}
      <div className='flex flex-col pt-16 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
        <LoadingOverlay />
        <main className='flex-1 p-6 overflow-auto'>
          <div className='max-w-7xl mx-auto'>{children}</div>
        </main>
      </div>

      {/* Notificación de sesión */}
      {notification.show && (
        <SessionNotification
          type={notification.type}
          message={notification.message}
          onConfirm={
            notification.type === 'warning' ? handleWarningConfirm : undefined
          }
          onCancel={
            notification.type === 'warning' ? handleWarningCancel : undefined
          }
          onClose={handleNotificationClose}
          autoClose={notification.type === 'expired' ? 3000 : undefined}
        />
      )}
    </>
  );
}
