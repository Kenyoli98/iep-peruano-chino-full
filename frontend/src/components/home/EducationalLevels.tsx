'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Tipos para los datos de niveles educativos
interface EducationalLevel {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
}

// Componente para tarjeta de nivel educativo
const LevelCard = ({
  level,
  index
}: {
  level: EducationalLevel;
  index: number;
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 hover:shadow-xl hover:-translate-y-2 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Image */}
      <div className='relative h-48 bg-blue-50 overflow-hidden'>
        <Image
          src={level.image}
          alt={level.title}
          fill
          className='object-cover transition-transform duration-300 hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
        <div className='absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold'>
          {level.icon}
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        <div className='mb-4'>
          <h3 className='text-xl font-bold text-blue-900 mb-1'>
            {level.title}
          </h3>
          <p className='text-blue-600 font-semibold text-sm'>
            {level.subtitle}
          </p>
        </div>

        <p className='text-gray-600 leading-relaxed mb-6'>
          {level.description}
        </p>

        {/* Features */}
        <div className='space-y-2 mb-6'>
          {level.features.map((feature, featureIndex) => (
            <div
              key={featureIndex}
              className='flex items-center space-x-2 text-gray-700'
            >
              <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
              <span className='text-sm'>{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/niveles/${level.id}`}
          className='inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg'
        >
          Conocer más
        </Link>
      </div>
    </div>
  );
};

const EducationalLevels = () => {
  const { elementRef: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true
  });

  // Datos de los niveles educativos
  const levels: EducationalLevel[] = [
    {
      id: 'inicial',
      title: 'Educación Inicial',
      subtitle: 'Primeros Pasos en el Aprendizaje',
      description:
        'Desarrollamos las habilidades fundamentales a través de metodologías innovadoras y un ambiente seguro de aprendizaje.',
      features: [
        'Desarrollo de creatividad y expresión',
        'Habilidades sociales y emocionales',
        'Estimulación cognitiva temprana',
        'Actividades lúdicas educativas'
      ],
      icon: '🌟',
      image: '/images/inicial-level.svg'
    },
    {
      id: 'primaria',
      title: 'Educación Primaria',
      subtitle: 'Construyendo Bases Sólidas',
      description:
        'Fortalecemos las competencias académicas fundamentales mientras fomentamos la curiosidad y el pensamiento crítico.',
      features: [
        'Lectoescritura y comprensión lectora',
        'Matemáticas aplicadas',
        'Ciencias naturales y sociales',
        'Tecnología educativa'
      ],
      icon: '📚',
      image: '/images/primaria-level.svg'
    },
    {
      id: 'secundaria',
      title: 'Educación Secundaria',
      subtitle: 'Preparación Integral',
      description:
        'Desarrollamos competencias avanzadas y preparamos a nuestros estudiantes para la educación superior y la vida profesional.',
      features: [
        'Preparación preuniversitaria',
        'Laboratorios especializados',
        'Idiomas extranjeros',
        'Proyectos de investigación'
      ],
      icon: '🎓',
      image: '/images/secundaria-level.svg'
    }
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className='bg-gray-50 py-16'
    >
      <div className='container mx-auto px-6'>
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className='text-4xl md:text-5xl font-bold text-blue-900 mb-6'>
            Niveles Educativos
          </h2>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Descubre nuestros programas educativos diseñados para cada etapa del
            desarrollo. Cada nivel está cuidadosamente estructurado para
            maximizar el potencial de aprendizaje.
          </p>
        </div>

        {/* Cards Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {levels.map((level, index) => (
            <div
              key={level.id}
              className={`transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <LevelCard level={level} index={index} />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={`text-center transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className='bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto'>
            <h3 className='text-3xl font-bold text-blue-900 mb-4'>
              ¿Listo para comenzar esta experiencia educativa?
            </h3>
            <p className='text-gray-600 mb-6 leading-relaxed'>
              Únete a nuestra comunidad educativa y descubre el potencial de
              nuestros estudiantes.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/admision'
                className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300'
              >
                Proceso de Admisión
              </Link>
              <Link
                href='/contacto'
                className='bg-gray-200 hover:bg-gray-300 text-blue-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-300'
              >
                Más Información
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationalLevels;
