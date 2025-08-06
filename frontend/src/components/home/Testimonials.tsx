'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Tipos para los datos
interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  emoji: string;
  gradient: string;
  highlight: string;
}

interface Stat {
  number: string;
  label: string;
  emoji: string;
  gradient: string;
}

// Componente para tarjeta de testimonio
const TestimonialCard = ({
  testimonial,
  isVisible
}: {
  testimonial: Testimonial;
  isVisible: boolean;
}) => (
  <div
    className={`bg-white rounded-lg shadow-lg p-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
  >
    <div className='text-center mb-6'>
      <p className='text-lg text-gray-700 leading-relaxed mb-4 italic'>
        &ldquo;{testimonial.content}&rdquo;
      </p>
    </div>

    {/* Rating Stars */}
    <div className='flex justify-center space-x-1 mb-6'>
      {[...Array(testimonial.rating)].map((_, i) => (
        <span key={i} className='text-yellow-500 text-xl'>
          ★
        </span>
      ))}
    </div>

    {/* Author */}
    <div className='text-center'>
      <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-blue-900'>
        {testimonial.name.charAt(0)}
      </div>

      <h4 className='text-lg font-bold text-blue-900 mb-1'>
        {testimonial.name}
      </h4>
      <p className='text-gray-600'>{testimonial.role}</p>
    </div>
  </div>
);

// Componente para tarjeta de estadística
const StatCard = ({ stat, index }: { stat: Stat; index: number }) => (
  <div className='bg-white rounded-lg shadow-lg p-8 text-center transition-all duration-300 hover:shadow-xl'>
    <div className='w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl'>
      {stat.emoji}
    </div>

    <div className='text-3xl font-bold text-blue-900 mb-2'>{stat.number}</div>
    <div className='text-gray-600'>{stat.label}</div>
  </div>
);

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Datos de testimonios
  const testimonials: Testimonial[] = [
    {
      name: 'María González',
      role: 'Madre de Familia ⭐',
      content:
        'Esta institución ha transformado completamente la vida de mi hijo. Los profesores son magos de la educación que despiertan la pasión por aprender.',
      rating: 5,
      emoji: '🌟',
      gradient: 'from-pink-400 via-rose-400 to-red-400',
      highlight: 'Transformación Total'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Ex Alumno 🎓',
      content:
        'Los valores cósmicos que aprendí aquí me han llevado a conquistar el universo profesional. ¡Eternamente agradecido por esta experiencia épica!',
      rating: 5,
      emoji: '🚀',
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      highlight: 'Éxito Galáctico'
    },
    {
      name: 'Ana Martínez',
      role: 'Docente Estrella ✨',
      content:
        'Trabajar aquí es como ser parte de una constelación educativa. Cada día brillamos más fuerte iluminando el futuro de nuestros estudiantes.',
      rating: 5,
      emoji: '💫',
      gradient: 'from-purple-400 via-violet-400 to-indigo-400',
      highlight: 'Brillantez Educativa'
    },
    {
      name: 'Luis Fernández',
      role: 'Padre Orgulloso 👨‍👧',
      content:
        'Mi hija ha florecido como una supernova en este ambiente mágico. La atención personalizada es simplemente extraordinaria.',
      rating: 5,
      emoji: '🌺',
      gradient: 'from-emerald-400 via-green-400 to-lime-400',
      highlight: 'Florecimiento Estelar'
    }
  ];

  // Datos de estadísticas
  const stats: Stat[] = [
    {
      number: '1000+',
      label: 'Estrellas Graduadas',
      emoji: '🎓',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      number: '5.0/5',
      label: 'Satisfacción Cósmica',
      emoji: '⭐',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      number: '20+',
      label: 'Años de Magia',
      emoji: '🔮',
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className='relative py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden'>
      {/* Cosmic Background */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-float'></div>
        <div className='absolute top-40 right-20 w-24 h-24 bg-pink-400 rounded-full opacity-15 animate-float-delayed'></div>
        <div className='absolute bottom-32 left-32 w-28 h-28 bg-blue-400 rounded-full opacity-12 animate-float-slow'></div>
        <div className='absolute bottom-20 right-10 w-36 h-36 bg-purple-400 rounded-full opacity-8 animate-float'></div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-20'>
          <div className='inline-flex items-center space-x-2 bg-blue-600 px-6 py-3 rounded-lg text-white font-semibold mb-8'>
            <span>📝</span>
            <span>Testimonios</span>
          </div>

          <h2 className='text-5xl md:text-6xl font-bold text-white mb-8 leading-tight'>
            Lo que dicen nuestras
            <span className='block text-blue-200'>familias</span>
          </h2>

          <p className='text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed'>
            Descubre las experiencias transformadoras de padres y estudiantes
            que han confiado en nuestra educación integral
          </p>
        </div>

        {/* Floating Testimonial Card */}
        <div className='relative max-w-5xl mx-auto mb-20'>
          <TestimonialCard
            testimonial={testimonials[currentTestimonial]}
            isVisible={isVisible}
          />

          {/* Navigation Dots */}
          <div className='flex justify-center space-x-3 mt-8'>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentTestimonial
                    ? 'w-12 h-4 bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'w-4 h-4 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className='bg-white/10 border border-white/20 rounded-xl p-12 text-center'>
          <h3 className='text-3xl md:text-4xl font-bold text-white mb-8'>
            ¿Listo para formar parte de nuestra comunidad?
          </h3>
          <p className='text-xl text-blue-100 mb-12 max-w-3xl mx-auto'>
            Únete a nuestra institución educativa donde cada estudiante
            desarrolla su máximo potencial.
          </p>

          <div className='flex flex-col sm:flex-row gap-6 justify-center'>
            <Link
              href='/admisiones'
              className='bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg'
            >
              Proceso de Admisión
            </Link>

            <Link
              href='/contacto'
              className='bg-white border border-blue-600 text-blue-600 font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-colors duration-300'
            >
              Solicitar Información
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
