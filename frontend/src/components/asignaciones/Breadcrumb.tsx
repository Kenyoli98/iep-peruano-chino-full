'use client';

import Link from 'next/link';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const Breadcrumb = () => {
  return (
    <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-6'>
      <Link
        href='/admin'
        className='flex items-center hover:text-blue-600 transition-colors duration-200'
      >
        <FaHome className='w-4 h-4 mr-1' />
        <span>Inicio</span>
      </Link>

      <FaChevronRight className='w-3 h-3 text-gray-400' />

      <span className='text-gray-800 font-semibold'>
        Gestión de Asignaciones
      </span>
    </nav>
  );
};

export default Breadcrumb;
