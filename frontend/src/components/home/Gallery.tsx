'use client';

import { useState } from 'react';
import {
  FaExpand,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaUsers
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Interfaces
interface Category {
  id: string;
  name: string;
  count: number;
}

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

// Sub-components
const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange
}: {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.5,
    triggerOnce: true
  });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {categories.map((category, index) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
            selectedCategory === category.id
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {category.name}
          <span className='ml-2 text-sm opacity-75'>({category.count})</span>
        </button>
      ))}
    </div>
  );
};

const GalleryItemCard = ({
  item,
  index,
  onOpenLightbox
}: {
  item: GalleryItem;
  index: number;
  onOpenLightbox: (index: number) => void;
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });
  const getCategoryIcon = (category: string) => {
    switch (category) {
    case 'facilities':
      return '🏫';
    case 'activities':
      return '🎨';
    case 'events':
      return '🎉';
    default:
      return '📚';
    }
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
    case 'facilities':
      return 'bg-blue-100 text-blue-600';
    case 'activities':
      return 'bg-green-100 text-green-600';
    case 'events':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-1000 hover:-translate-y-2 border border-gray-200 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className='relative h-64 overflow-hidden'>
        <div className='w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center'>
          <span className='text-4xl'>{getCategoryIcon(item.category)}</span>
        </div>

        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center'>
          <button
            onClick={() => onOpenLightbox(index)}
            className='opacity-0 group-hover:opacity-100 bg-white text-gray-900 p-3 rounded-full transition-all duration-300 transform scale-75 group-hover:scale-100'
          >
            <FaExpand className='w-5 h-5' />
          </button>
        </div>
      </div>

      <div className='p-6'>
        <h3 className='text-lg font-bold text-gray-900 mb-2'>{item.title}</h3>
        <p className='text-gray-600 text-sm leading-relaxed'>
          {item.description}
        </p>

        <div className='mt-4 flex items-center justify-between'>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(item.category)}`}
          >
            {item.category === 'facilities'
              ? 'Instalaciones'
              : item.category === 'activities'
                ? 'Actividades'
                : 'Eventos'}
          </span>
        </div>
      </div>
    </div>
  );
};

const Lightbox = ({
  selectedImage,
  currentImageIndex,
  filteredItems,
  onClose,
  onNext,
  onPrev
}: {
  selectedImage: number | null;
  currentImageIndex: number;
  filteredItems: GalleryItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  if (!selectedImage) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
    case 'facilities':
      return '🏫';
    case 'activities':
      return '🎨';
    case 'events':
      return '🎉';
    default:
      return '📚';
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4'>
      <div className='relative max-w-4xl w-full'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-white hover:text-gray-300 z-10'
        >
          <FaTimes className='w-6 h-6' />
        </button>

        <div className='bg-white rounded-lg overflow-hidden'>
          <div className='h-96 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center'>
            <span className='text-6xl'>
              {getCategoryIcon(filteredItems[currentImageIndex].category)}
            </span>
          </div>

          <div className='p-6'>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>
              {filteredItems[currentImageIndex].title}
            </h3>
            <p className='text-gray-600'>
              {filteredItems[currentImageIndex].description}
            </p>
          </div>
        </div>

        {filteredItems.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300'
            >
              <FaChevronLeft className='w-8 h-8' />
            </button>

            <button
              onClick={onNext}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300'
            >
              <FaChevronRight className='w-8 h-8' />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const CTASection = () => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`text-center bg-blue-600 rounded-lg p-8 md:p-12 text-white shadow-lg transition-all duration-1000 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95'
      }`}
    >
      <h3
        className={`text-2xl md:text-3xl font-bold mb-4 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        ¿Te gustaría conocer nuestras instalaciones?
      </h3>
      <p
        className={`text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        Agenda una visita guiada y descubre de primera mano todos los espacios
        donde tus hijos desarrollarán su potencial académico y personal.
      </p>

      <div
        className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Link
          href='/contacto'
          className='inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-3 rounded-md transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 transform'
        >
          <FaCalendarAlt className='w-5 h-5 mr-2' />
          <span>Agendar Visita</span>
        </Link>

        <Link
          href='/admisiones'
          className='inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-md transition-all duration-200 hover:scale-105 transform'
        >
          <FaUsers className='w-5 h-5 mr-2' />
          <span>Solicitar Información</span>
        </Link>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { elementRef: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true
  });
  const { elementRef: galleryRef, isVisible: galleryVisible } =
    useScrollAnimation({
      threshold: 0.2,
      triggerOnce: true
    });

  const categories = [
    { id: 'all', name: 'Todo', count: 24 },
    { id: 'facilities', name: 'Instalaciones', count: 8 },
    { id: 'activities', name: 'Actividades', count: 10 },
    { id: 'events', name: 'Eventos', count: 6 }
  ];

  const galleryItems = [
    {
      id: 1,
      title: 'Laboratorio de Ciencias',
      category: 'facilities',
      image: '/images/imagen-login1.jpg',
      description:
        'Moderno laboratorio equipado con tecnología de vanguardia para experimentos científicos.'
    },
    {
      id: 2,
      title: 'Biblioteca Central',
      category: 'facilities',
      image: '/images/imagen-login2.jpg',
      description:
        'Amplia biblioteca con más de 10,000 libros y espacios de estudio colaborativo.'
    },
    {
      id: 3,
      title: 'Aula de Informática',
      category: 'facilities',
      image: '/images/imagen-login3.jpg',
      description:
        'Sala de cómputo con equipos modernos para el aprendizaje digital.'
    },
    {
      id: 4,
      title: 'Festival de Talentos',
      category: 'events',
      image: '/images/imagen-login1.jpg',
      description:
        'Evento anual donde los estudiantes muestran sus habilidades artísticas.'
    },
    {
      id: 5,
      title: 'Clase de Arte',
      category: 'activities',
      image: '/images/imagen-login2.jpg',
      description:
        'Estudiantes desarrollando su creatividad en el taller de artes plásticas.'
    },
    {
      id: 6,
      title: 'Deportes y Recreación',
      category: 'activities',
      image: '/images/imagen-login3.jpg',
      description:
        'Actividades deportivas que promueven el trabajo en equipo y la vida saludable.'
    },
    {
      id: 7,
      title: 'Ceremonia de Graduación',
      category: 'events',
      image: '/images/imagen-login1.jpg',
      description:
        'Momento especial de celebración del logro académico de nuestros estudiantes.'
    },
    {
      id: 8,
      title: 'Laboratorio de Idiomas',
      category: 'facilities',
      image: '/images/imagen-login2.jpg',
      description:
        'Espacio especializado para el aprendizaje de idiomas extranjeros.'
    },
    {
      id: 9,
      title: 'Proyecto de Ciencias',
      category: 'activities',
      image: '/images/imagen-login3.jpg',
      description:
        'Estudiantes trabajando en proyectos de investigación científica.'
    }
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? galleryItems
      : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setSelectedImage(filteredItems[index].id);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredItems.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredItems[nextIndex].id);
  };

  const prevImage = () => {
    const prevIndex =
      (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredItems[prevIndex].id);
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`py-16 bg-gray-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-md text-blue-600 font-medium mb-4'>
            <HiSparkles className='w-5 h-5' />
            <span>Galería</span>
          </div>

          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
            Conoce Nuestras
            <span className='block text-blue-600'>Instalaciones</span>
          </h2>

          <p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Explora nuestros modernos espacios educativos, actividades
            estudiantiles y los momentos más especiales de nuestra comunidad
            académica.
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Gallery Grid */}
        <div
          ref={galleryRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 transition-all duration-1000 ${
            galleryVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {filteredItems.map((item, index) => (
            <GalleryItemCard
              key={item.id}
              item={item}
              index={index}
              onOpenLightbox={openLightbox}
            />
          ))}
        </div>

        {/* Lightbox */}
        <Lightbox
          selectedImage={selectedImage}
          currentImageIndex={currentImageIndex}
          filteredItems={filteredItems}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />

        {/* CTA Section */}
        <CTASection />
      </div>
    </section>
  );
};

export default Gallery;
