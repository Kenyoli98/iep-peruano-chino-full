'use client';

import Header from '../components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import EducationalLevels from '@/components/home/EducationalLevels';
import MissionAndValues from '@/components/home/MissionAndValues';
import Testimonials from '@/components/home/Testimonials';
import Gallery from '@/components/home/Gallery';
import CallToAction from '../components/home/CallToAction';
import Footer from '../components/home/Footer';

export default function HomePage() {
  return (
    <div className='bg-white text-gray-900 min-h-screen flex flex-col font-sans'>
      <Header />
      <main>
        <HeroSection />
        <EducationalLevels />
        <MissionAndValues />
        <Testimonials />
        <Gallery />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
