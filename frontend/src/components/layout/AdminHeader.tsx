'use client';

import Image from 'next/image';
import { FaChevronDown, FaSignOutAlt, FaUser, FaBell } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

type Props = {
  nombre: string;
  showUserMenu: boolean;
  toggleUserMenu: () => void;
  handleLogout: () => void;
};

export default function AdminHeader({
  nombre,
  showUserMenu,
  toggleUserMenu,
  handleLogout
}: Props) {
  return (
    <header className='bg-white border-b border-gray-300 fixed w-full z-50 shadow-sm'>
      <div className='flex items-center justify-between px-6 py-2'>
        {/* Logo y título institucional */}
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg'>
              <span className='text-white font-bold text-lg'>IEP</span>
            </div>
          </div>
          <div className='flex flex-col justify-center'>
            <span className='font-bold text-xl text-slate-800 tracking-tight'>
              I.E.P Peruano Chino
            </span>
            <span className='text-xs text-slate-500 font-medium'>
              Panel de Administración
            </span>
          </div>
        </div>

        {/* Acciones del usuario */}
        <div className='flex items-center gap-2'>
          {/* Notificaciones */}
          <button className='relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
            <FaBell size={18} />
            <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium'>
              3
            </span>
          </button>

          {/* Menú de usuario */}
          <div className='relative ml-2'>
            <button
              onClick={toggleUserMenu}
              className='flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200'
            >
              <div className='w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center'>
                <FaUser className='text-white text-xs' />
              </div>
              <span className='font-medium text-sm'>{nombre}</span>
              <FaChevronDown
                className={`text-xs transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown del menú de usuario */}
            {showUserMenu && (
              <div className='absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                <div className='py-1'>
                  <button
                    onClick={() => {}}
                    className='flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                  >
                    <MdDashboard className='text-gray-500' />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => {}}
                    className='flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                  >
                    <FaUser className='text-gray-500' />
                    <span>Mi Perfil</span>
                  </button>
                  <hr className='my-1 border-gray-200' />
                  <button
                    onClick={handleLogout}
                    className='flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200'
                  >
                    <FaSignOutAlt className='text-red-500' />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
