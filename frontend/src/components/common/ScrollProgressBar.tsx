'use client';

import { useScrollProgress } from '@/hooks/useScrollAnimation';

const ScrollProgressBar = () => {
  const scrollProgress = useScrollProgress();

  return (
    <div className='fixed top-0 left-0 w-full h-1 bg-gray-100 z-50'>
      <div
        className='h-full bg-gradient-to-r from-slate-700 via-gray-800 to-slate-900 transition-all duration-150 ease-out shadow-sm'
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
