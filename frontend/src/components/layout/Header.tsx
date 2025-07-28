'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
        ? 'backdrop-blur-lg bg-white/10 border-b border-white/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-black font-bold text-lg">🎓</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white leading-tight">
                I.E.P
              </span>
              <span className="text-sm font-medium text-yellow-300">
                Peruano Chino
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="relative text-white font-medium hover:text-yellow-300 transition-all duration-300 group"
            >
              <span>Inicio</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            
            <div className="relative group">
              <button
                onClick={toggleNiveles}
                className="flex items-center space-x-1 text-white font-medium hover:text-yellow-300 transition-all duration-300"
              >
                <span>Niveles</span>
                <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                  isNivelesOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {isNivelesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl py-3 animate-fade-in">
                  <Link
                    href="/niveles/inicial"
                    className="block px-6 py-3 text-white hover:bg-white/10 hover:text-yellow-300 transition-all duration-200 rounded-lg mx-2"
                  >
                    🌱 Inicial
                  </Link>
                  <Link
                    href="/niveles/primaria"
                    className="block px-6 py-3 text-white hover:bg-white/10 hover:text-yellow-300 transition-all duration-200 rounded-lg mx-2"
                  >
                    📚 Primaria
                  </Link>
                  <Link
                    href="/niveles/secundaria"
                    className="block px-6 py-3 text-white hover:bg-white/10 hover:text-yellow-300 transition-all duration-200 rounded-lg mx-2"
                  >
                    🎯 Secundaria
                  </Link>
                </div>
              )}
            </div>
            
            <Link
              href="/nosotros"
              className="relative text-white font-medium hover:text-yellow-300 transition-all duration-300 group"
            >
              <span>Nosotros</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              href="/admision"
              className="relative text-white font-medium hover:text-yellow-300 transition-all duration-300 group"
            >
              <span>Admisión</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              href="/contacto"
              className="relative text-white font-medium hover:text-yellow-300 transition-all duration-300 group"
            >
              <span>Contacto</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/intranet"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-2xl border border-white/20 backdrop-blur-sm"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-700"></div>
              
              {/* Icon and text */}
              <div className="relative z-10 flex items-center space-x-2">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-bold tracking-wide">Intranet</span>
                <div className="w-1 h-1 bg-white/60 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-300"
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
        <div className="backdrop-blur-lg bg-white/10 border-t border-white/20">
          <div className="px-4 py-4 space-y-2">
            <Link 
              href="/" 
              className="block py-2 px-3 text-white hover:text-yellow-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            
            {/* Mobile Niveles */}
            <div>
              <button
                onClick={toggleNiveles}
                className="flex items-center justify-between w-full py-2 px-3 text-white hover:text-yellow-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
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
                    className="block py-2 px-3 text-blue-200 hover:text-yellow-300 hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🌱 Inicial
                  </Link>
                  <Link 
                    href="/niveles/primaria" 
                    className="block py-2 px-3 text-blue-200 hover:text-yellow-300 hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📚 Primaria
                  </Link>
                  <Link 
                    href="/niveles/secundaria" 
                    className="block py-2 px-3 text-blue-200 hover:text-yellow-300 hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🎯 Secundaria
                  </Link>
                </div>
              </div>
            </div>
            
            <Link 
              href="/nosotros" 
              className="block py-2 px-3 text-white hover:text-yellow-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            
            <Link 
              href="/admision" 
              className="block py-2 px-3 text-white hover:text-yellow-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Admisión
            </Link>
            
            <Link 
              href="/contacto" 
              className="block py-2 px-3 text-white hover:text-yellow-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            
            <Link
              href="/intranet"
              className="group relative overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-500 mt-4 shadow-lg hover:shadow-xl border border-white/20"
              onClick={() => setIsMenuOpen(false)}
            >
              {/* Mobile shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-700"></div>
              
              <div className="relative z-10 flex items-center space-x-2">
                <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-bold tracking-wide">Intranet</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;