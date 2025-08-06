'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Componente para tarjetas de contacto
const ContactCard = ({
  icon,
  title,
  description,
  action
}: {
  icon: string;
  title: string;
  description: string;
  action: string;
}) => (
  <div className='bg-white rounded-lg p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300'>
    <div className='w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
      <span className='text-2xl'>{icon}</span>
    </div>

    <h3 className='text-xl font-bold text-blue-900 mb-2'>{title}</h3>

    <p className='text-gray-600 mb-4 leading-relaxed'>{description}</p>

    <div className='text-blue-700 font-semibold'>{action}</div>
  </div>
);

const CallToAction = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Datos de contacto
  const contactMethods = [
    {
      icon: '📞',
      title: 'Llámanos',
      description:
        'Habla directamente con nuestro equipo de admisiones para resolver todas tus dudas.',
      action: '+51 123 456 789'
    },
    {
      icon: '📧',
      title: 'Escríbenos',
      description:
        'Envíanos un correo y te responderemos en menos de 24 horas.',
      action: 'admisiones@iepperuanochino.edu.pe'
    },
    {
      icon: '📍',
      title: 'Visítanos',
      description:
        'Ven a conocer nuestras instalaciones y vive la experiencia educativa.',
      action: 'Av. Educación 123, Lima, Perú'
    }
  ];

  if (!mounted) {
    return (
      <section className='relative py-20 px-4 bg-gray-50'>
        <div className='max-w-6xl mx-auto text-center'>
          <div className='animate-pulse'>
            <div className='h-12 bg-gray-200 rounded-lg mb-6 mx-auto max-w-md'></div>
            <div className='h-6 bg-gray-200 rounded-lg mb-12 mx-auto max-w-2xl'></div>
            <div className='grid md:grid-cols-3 gap-8'>
              {[1, 2, 3].map(i => (
                <div key={i} className='h-64 bg-gray-200 rounded-lg'></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='relative py-20 px-4 bg-gray-50'>
      <div className='max-w-6xl mx-auto text-center'>
        {/* Título principal */}
        <div className='mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-blue-900 animate-fade-in'>
            Únete a Nuestra Familia Educativa
          </h2>
          <p
            className='text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-fade-in'
            style={{ animationDelay: '0.2s' }}
          >
            Da el primer paso hacia un futuro brillante. Contáctanos hoy y
            descubre cómo podemos transformar la educación de tu hijo.
          </p>
        </div>

        {/* Métodos de contacto */}
        <div className='grid md:grid-cols-3 gap-8 mb-16'>
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className='animate-fade-in'
              style={{ animationDelay: `${0.4 + index * 0.2}s` }}
            >
              <ContactCard {...method} />
            </div>
          ))}
        </div>

        {/* Botones de acción */}
        <div
          className='flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in'
          style={{ animationDelay: '1s' }}
        >
          <Link
            href='/admision'
            className='bg-blue-900 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:bg-blue-800 shadow-lg hover:shadow-xl min-w-[200px]'
          >
            Proceso de Admisión
          </Link>

          <Link
            href='/contacto'
            className='bg-white text-blue-900 border-2 border-blue-900 font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:bg-blue-50 shadow-lg hover:shadow-xl min-w-[200px]'
          >
            Más Información
          </Link>
        </div>

        {/* Mensaje adicional */}
        <div
          className='mt-12 animate-fade-in'
          style={{ animationDelay: '1.2s' }}
        >
          <p className='text-gray-600 text-lg'>
            <span className='font-semibold text-blue-900'>
              Becas disponibles:
            </span>{' '}
            Consulta por nuestros programas de apoyo educativo
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
