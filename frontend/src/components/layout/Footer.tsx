'use client';

import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebookF className='w-5 h-5' />,
      href: '#',
      color: 'hover:text-blue-500'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className='w-5 h-5' />,
      href: '#',
      color: 'hover:text-pink-500'
    },
    {
      name: 'YouTube',
      icon: <FaYoutube className='w-5 h-5' />,
      href: '#',
      color: 'hover:text-red-500'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedinIn className='w-5 h-5' />,
      href: '#',
      color: 'hover:text-blue-600'
    }
  ];

  const footerSections = [
    {
      title: 'Colegio',
      links: [
        { label: 'Inicio', href: '/' },
        { label: 'Nosotros', href: '/nosotros' },
        { label: 'Historia', href: '/historia' },
        { label: 'Documentos', href: '/documentos' }
      ]
    },
    {
      title: 'Programas',
      links: [
        { label: 'Inicial', href: '/niveles/inicial' },
        { label: 'Primaria', href: '/niveles/primaria' },
        { label: 'Secundaria', href: '/niveles/secundaria' },
        { label: 'Actividades', href: '/actividades' }
      ]
    },
    {
      title: 'Servicios',
      links: [
        { label: 'Admisiones', href: '/admision' },
        { label: 'Becas', href: '/becas' },
        { label: 'Galería', href: '/galeria' },
        { label: 'Noticias', href: '/noticias' }
      ]
    }
  ];

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      {/* Main footer content */}
      <div className='max-w-6xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
          {/* Brand section */}
          <div className='lg:col-span-2'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 bg-[#0a3a7e] rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>IEP</span>
              </div>
              <span className='font-black text-xl tracking-wide'>
                I.E.P Peruano Chino
              </span>
            </div>

            <p className='text-gray-300 mb-6 leading-relaxed'>
              Formamos ciudadanos del mundo con identidad y valores, brindando
              educación integral de excelencia desde hace más de 25 años.
            </p>

            {/* Social links */}
            <div className='flex gap-4 mb-6'>
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-200 ${social.color} hover:scale-110`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div className='space-y-3 text-sm text-gray-300'>
              <div className='flex items-center gap-3'>
                <FaMapMarkerAlt className='w-4 h-4 text-[#0a3a7e]' />
                <span>Av. Principal 123, Ica, Perú</span>
              </div>
              <div className='flex items-center gap-3'>
                <FaPhone className='w-4 h-4 text-[#0a3a7e]' />
                <span>(056) 123-4567</span>
              </div>
              <div className='flex items-center gap-3'>
                <FaEnvelope className='w-4 h-4 text-[#0a3a7e]' />
                <span>info@iepperuanochino.edu.pe</span>
              </div>
            </div>
          </div>

          {/* Navigation sections */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className='font-bold text-lg mb-4 text-white'>
                {section.title}
              </h3>
              <ul className='space-y-2'>
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className='text-gray-300 hover:text-white transition-colors duration-200 text-sm'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className='border-t border-gray-800'>
        <div className='max-w-6xl mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='text-sm text-gray-400'>
              © {currentYear} I.E.P Peruano Chino. Todos los derechos
              reservados.
            </div>

            <div className='flex gap-6 text-sm text-gray-400'>
              <Link
                href='/privacidad'
                className='hover:text-white transition-colors'
              >
                Política de Privacidad
              </Link>
              <Link
                href='/terminos'
                className='hover:text-white transition-colors'
              >
                Términos de Uso
              </Link>
              <Link
                href='/cookies'
                className='hover:text-white transition-colors'
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
