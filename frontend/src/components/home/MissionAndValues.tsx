'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Tipos para los datos
interface Value {
  icon: string;
  title: string;
  description: string;
}

// Componente para tarjeta de valor
const ValueCard = ({ value, index }: { value: Value; index: number }) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-1000 hover:shadow-xl hover:-translate-y-2 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 transform transition-transform duration-300 hover:scale-110'>
        {value.icon}
      </div>

      <h4 className='text-xl font-bold text-blue-900 mb-3'>{value.title}</h4>
      <p className='text-gray-600 leading-relaxed'>{value.description}</p>
    </div>
  );
};

const MissionAndValues = () => {
  const { elementRef: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true
  });
  const { elementRef: missionRef, isVisible: missionVisible } =
    useScrollAnimation({
      threshold: 0.2,
      triggerOnce: true
    });
  const { elementRef: valuesRef, isVisible: valuesVisible } =
    useScrollAnimation({
      threshold: 0.2,
      triggerOnce: true
    });

  const values: Value[] = [
    {
      icon: '🤝',
      title: 'Respeto',
      description:
        'Valoramos la diversidad y promovemos un ambiente de respeto mutuo en nuestra comunidad educativa.'
    },
    {
      icon: '⭐',
      title: 'Excelencia',
      description:
        'Buscamos la calidad en todos nuestros procesos educativos y administrativos.'
    },
    {
      icon: '🎯',
      title: 'Compromiso',
      description:
        'Nos dedicamos con responsabilidad al desarrollo integral de nuestros estudiantes.'
    },
    {
      icon: '💡',
      title: 'Innovación',
      description:
        'Implementamos metodologías modernas y tecnología educativa de vanguardia.'
    },
    {
      icon: '🌟',
      title: 'Integridad',
      description:
        'Actuamos con transparencia, honestidad y ética en todas nuestras acciones.'
    },
    {
      icon: '❤️',
      title: 'Vocación de Servicio',
      description:
        'Servimos con pasión y dedicación a la formación de las futuras generaciones.'
    }
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className='bg-white py-16'
    >
      <div className='container mx-auto px-6'>
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className='text-4xl md:text-5xl font-bold text-blue-900 mb-6'>
            Misión, Visión y Valores
          </h2>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Los principios fundamentales que guían nuestra institución educativa
            hacia la excelencia académica y la formación integral.
          </p>
        </div>

        {/* Mission and Vision */}
        <div
          ref={missionRef as React.RefObject<HTMLDivElement>}
          className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'
        >
          {/* Mission */}
          <div
            className={`bg-blue-50 rounded-lg p-8 transition-all duration-1000 ${
              missionVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className='w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 text-white text-2xl'>
              🎯
            </div>

            <h3 className='text-2xl font-bold text-blue-900 mb-4'>
              Nuestra Misión
            </h3>
            <p className='text-gray-700 leading-relaxed'>
              Brindar una educación integral de calidad que forme estudiantes
              competentes, críticos y comprometidos con su desarrollo personal y
              social, preparándolos para los desafíos del futuro.
            </p>
          </div>

          {/* Vision */}
          <div
            className={`bg-gray-50 rounded-lg p-8 transition-all duration-1000 ${
              missionVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className='w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-6 text-white text-2xl'>
              👁️
            </div>

            <h3 className='text-2xl font-bold text-blue-900 mb-4'>
              Nuestra Visión
            </h3>
            <p className='text-gray-700 leading-relaxed'>
              Ser una institución educativa líder y reconocida por su excelencia
              académica, innovación pedagógica y formación de ciudadanos
              íntegros que contribuyan al desarrollo de la sociedad.
            </p>
          </div>
        </div>

        {/* Values */}
        <div
          ref={valuesRef as React.RefObject<HTMLDivElement>}
          className='mb-12'
        >
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              valuesVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className='text-3xl font-bold text-blue-900 mb-4'>
              Nuestros Valores
            </h3>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Los principios que guían nuestro quehacer educativo y definen
              nuestra identidad institucional.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {values.map((value, index) => (
              <ValueCard key={index} value={value} index={index} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center transition-all duration-1000 delay-1000 ${
            valuesVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className='bg-blue-50 rounded-lg p-8'>
            <h3 className='text-3xl font-bold text-blue-900 mb-4'>
              ¿Quieres conocer más sobre nosotros?
            </h3>
            <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
              Descubre todo lo que nuestra institución puede ofrecer para el
              desarrollo integral de nuestros estudiantes.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/nosotros'
                className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg transform'
              >
                Conoce Más
              </Link>

              <Link
                href='/contacto'
                className='bg-gray-200 hover:bg-gray-300 text-blue-900 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg transform'
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionAndValues;
