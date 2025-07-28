'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNivelesOpen, setIsNivelesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNiveles = () => {
    setIsNivelesOpen(!isNivelesOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
              <Image 
                src="/images/logo-colegio.png" 
                alt="Logo I.E.P Peruano Chino" 
                width={48} 
                height={48} 
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-blue-900 leading-tight">
                I.E.P
              </span>
              <span className="text-sm font-semibold text-blue-600">
                Peruano Chino
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="relative text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 group"
            >
              <span>Inicio</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            
            <div className="relative group">
              <button
                onClick={toggleNiveles}
                className="flex items-center space-x-1 text-gray-700 font-medium hover:text-blue-600 transition-all duration-300"
              >
                <span>Niveles</span>
                <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                  isNivelesOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {isNivelesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2">
                  <Link
                    href="/niveles/inicial"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 mx-2 rounded"
                  >
                    🌱 Inicial
                  </Link>
                  <Link
                    href="/niveles/primaria"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 mx-2 rounded"
                  >
                    📚 Primaria
                  </Link>
                  <Link
                    href="/niveles/secundaria"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 mx-2 rounded"
                  >
                    🎯 Secundaria
                  </Link>
                </div>
              )}
            </div>
            
            <Link
              href="/nosotros"
              className="relative text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 group"
            >
              <span>Nosotros</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              href="/admision"
              className="relative text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 group"
            >
              <span>Admisión</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              href="/contacto"
              className="relative text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 group"
            >
              <span>Contacto</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 shadow-md"
            >
              🔐 Intranet
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
        </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isMenuOpen 
          ? 'max-h-screen opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            <Link 
              href="/" 
              className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            
            {/* Mobile Niveles */}
            <div>
              <button
                onClick={toggleNiveles}
                className="flex items-center justify-between w-full py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <span>Niveles</span>
                <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                  isNivelesOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                isNivelesOpen 
                  ? 'max-h-40 opacity-100 mt-1' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="pl-4 space-y-1">
                  <Link 
                    href="/niveles/inicial" 
                    className="block py-2 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🌱 Inicial
                  </Link>
                  <Link 
                    href="/niveles/primaria" 
                    className="block py-2 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📚 Primaria
                  </Link>
                  <Link 
                    href="/niveles/secundaria" 
                    className="block py-2 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🎯 Secundaria
                  </Link>
                </div>
              </div>
            </div>
            
            <Link 
              href="/nosotros" 
              className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            
            <Link 
              href="/admision" 
              className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Admisión
            </Link>
            
            <Link 
              href="/contacto" 
              className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            
            {/* Mobile CTA */}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/login"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                🔐 Intranet
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;