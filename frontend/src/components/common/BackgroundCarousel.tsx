'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
  imageDescriptions?: string[];
}

const BackgroundCarousel = ({
  images,
  interval = 5000,
  className = '',
  imageDescriptions = []
}: BackgroundCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded || images.length === 0) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}
      />
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`Imagen de la institución ${index + 1}`}
            fill
            className='object-cover'
            priority={index === 0}
            quality={85}
          />
          {/* Overlay para mejorar legibilidad del texto */}
          <div className='absolute inset-0 bg-black/30' />
          <div className='absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-blue-900/40' />
        </div>
      ))}

      {/* Descripción de la imagen actual */}
      {imageDescriptions.length > 0 && imageDescriptions[currentIndex] && (
        <div className='absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10'>
          <div className='bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium'>
            {imageDescriptions[currentIndex]}
          </div>
        </div>
      )}

      {/* Indicadores de carrusel */}
      <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white shadow-lg scale-110'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundCarousel;
