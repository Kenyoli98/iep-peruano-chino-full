'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='bg-blue-900 text-white py-12 mt-8'>
      <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 px-4'>
        <div className='flex flex-col items-center md:items-start gap-2'>
          <span className='font-bold text-xl tracking-wide'>
            I.E.P Peruano Chino
          </span>
          <p className='text-blue-200 text-sm max-w-xs text-center md:text-left'>
            Formando líderes del futuro con excelencia académica y valores
            sólidos.
          </p>
          <div className='flex gap-3 mt-4 text-blue-300'>
            <a href='#' aria-label='Facebook'>
              <svg width='20' height='20' fill='none' viewBox='0 0 24 24'>
                <rect
                  x='4'
                  y='4'
                  width='16'
                  height='16'
                  rx='8'
                  stroke='currentColor'
                  strokeWidth='2'
                />
                <path
                  d='M12 8v8M8 12h8'
                  stroke='currentColor'
                  strokeWidth='2'
                />
              </svg>
            </a>
            <a href='#' aria-label='Instagram'>
              <svg width='20' height='20' fill='none' viewBox='0 0 24 24'>
                <circle
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='2'
                />
                <circle
                  cx='12'
                  cy='12'
                  r='4'
                  stroke='currentColor'
                  strokeWidth='2'
                />
                <circle cx='18' cy='6' r='1' fill='currentColor' />
              </svg>
            </a>
            <a href='#' aria-label='YouTube'>
              <svg width='20' height='20' fill='none' viewBox='0 0 24 24'>
                <rect
                  x='4'
                  y='4'
                  width='16'
                  height='16'
                  rx='8'
                  stroke='currentColor'
                  strokeWidth='2'
                />
                <polygon points='10,8 16,12 10,16' fill='currentColor' />
              </svg>
            </a>
          </div>
        </div>
        <div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left'>
          <div>
            <div className='font-semibold mb-3 text-white'>Institución</div>
            <Link
              href='/'
              className='block text-blue-200 hover:text-white transition-colors duration-200 mb-2'
            >
              Inicio
            </Link>
            <Link
              href='/nosotros'
              className='block text-blue-200 hover:text-white transition-colors duration-200 mb-2'
            >
              Nosotros
            </Link>
            <Link
              href='/documentos'
              className='block text-blue-200 hover:text-white transition-colors duration-200 mb-2'
            >
              Documentos
            </Link>
          </div>
          <div>
            <div className='font-semibold mb-3 text-white'>
              Niveles Educativos
            </div>
            <Link
              href='/niveles/inicial'
              className='block text-blue-200 hover:text-white transition-colors duration-200 mb-2'
            >
              Inicial
            </Link>
            <Link
              href='/niveles/primaria'
              className='block text-blue-200 hover:text-white transition-colors duration-200 mb-2'
            >
              Primaria
            </Link>
            <Link
              href='/niveles/secundaria'
              className='block text-blue-200 hover:text-white transition-colors duration-200 mb-2'
            >
              Secundaria
            </Link>
          </div>
          <div>
            <div className='font-semibold mb-3 text-white'>Contacto</div>
            <Link
              href='/contacto'
              className='block text-blue-200 hover:text-white transition-colors duration-200 mb-2'
            >
              Información
            </Link>
            <Link
              href='/admision'
              className='block text-blue-200 hover:text-white transition-colors duration-200 mb-2'
            >
              Admisión
            </Link>
            <Link
              href='/intranet'
              className='block text-blue-200 hover:text-white transition-colors duration-200 mb-2'
            >
              Intranet
            </Link>
          </div>
        </div>
      </div>
      <div className='border-t border-blue-800 mt-8 pt-8 text-center text-blue-200'>
        <p>&copy; 2024 I.E.P Peruano Chino. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
