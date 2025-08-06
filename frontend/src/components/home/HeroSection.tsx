'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParallaxScroll } from '@/hooks/useScrollAnimation';
import BackgroundCarousel from '@/components/common/BackgroundCarousel';

// Componente para estadísticas
const StatCard = ({
  number,
  label,
  delay = 0,
  isVisible
}: {
  number: string;
  label: string;
  delay?: number;
  isVisible: boolean;
}) => (
  <div
    className={`bg-white/95 rounded-lg p-6 border border-gray-200 shadow-lg transition-all duration-1000 transform ${
      isVisible
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-8 scale-95'
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className='text-3xl font-bold text-blue-900 mb-2'>{number}</div>
    <div className='text-gray-600 font-medium'>{label}</div>
  </div>
);

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { elementRef: parallaxRef, offsetY } = useParallaxScroll(0.3);

  useEffect(() => {
    setMounted(true);
    // Activar animaciones inmediatamente después del montaje
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Renderizado de carga mientras se monta el componente
  if (!mounted) {
    return (
      <section className='relative flex flex-col items-center justify-center text-center py-16 md:py-28 px-4 min-h-[80vh] bg-gradient-to-b from-blue-50 to-white'>
        <div className='relative z-10 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-blue-900 leading-tight'>
            I.E.P Peruano Chino
          </h1>
          <h2 className='text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto'>
            Formando líderes del mañana con excelencia académica y valores
            sólidos
          </h2>
        </div>
      </section>
    );
  }

  const stats = [
    { number: '25+', label: 'Años de experiencia' },
    { number: '500+', label: 'Estudiantes activos' },
    { number: '3', label: 'Idiomas' }
  ];

  // Imágenes del carrusel de fondo
  const backgroundImages = [
    '/images/imagen-login1.jpg',
    '/images/colegio-exterior.svg',
    '/images/imagen-login2.jpg',
    '/images/aula-clases.svg',
    '/images/imagen-login3.jpg',
    '/images/patio-recreo.svg'
  ];

  // Descripciones para cada imagen
  const imageDescriptions = [
    'Instalaciones modernas y acogedoras',
    'Nuestro hermoso campus educativo',
    'Espacios diseñados para el aprendizaje',
    'Aulas equipadas con tecnología moderna',
    'Ambiente propicio para la educación',
    'Espacios de recreación y deporte'
  ];

  return (
    <section className='relative flex flex-col items-center justify-center text-center py-16 md:py-28 px-4 min-h-[80vh] overflow-hidden'>
      {/* Carrusel de imágenes de fondo */}
      <BackgroundCarousel
        images={backgroundImages}
        imageDescriptions={imageDescriptions}
        interval={6000}
        className='z-0'
      />

      {/* Elementos decorativos con parallax */}
      <div
        ref={parallaxRef as React.RefObject<HTMLDivElement>}
        className='absolute inset-0 opacity-20 z-10'
        style={{ transform: `translateY(${offsetY * 0.3}px)` }}
      >
        <div className='absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse'></div>
        <div
          className='absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-xl animate-pulse'
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className='absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-xl animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Contenido principal */}
      <div
        className={`relative z-20 max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl leading-tight transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          I.E.P Peruano Chino
        </h1>
        <h2
          className={`text-xl md:text-2xl lg:text-3xl font-medium text-white/90 drop-shadow-lg mb-8 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Formando líderes del mañana con excelencia académica y valores sólidos
        </h2>

        {/* Botones de acción */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href='/login'
            className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105'
          >
            Acceder al Sistema
          </Link>
          <Link
            href='#niveles'
            className='bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-lg font-semibold border-2 border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105'
          >
            Conocer Más
          </Link>
        </div>

        {/* Estadísticas */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <StatCard
            number='25+'
            label='Años de Experiencia'
            delay={1000}
            isVisible={isVisible}
          />
          <StatCard
            number='500+'
            label='Estudiantes Graduados'
            delay={1200}
            isVisible={isVisible}
          />
          <StatCard
            number='98%'
            label='Satisfacción Familiar'
            delay={1400}
            isVisible={isVisible}
          />
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20'>
        <div className='w-6 h-10 border-2 border-white/70 rounded-full flex justify-center'>
          <div className='w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse' />
        </div>
      </div>
    </section>
  );
}
