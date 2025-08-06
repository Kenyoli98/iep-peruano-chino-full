'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoadingOverlay() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // cada vez que cambia de página, muestra loader
    setShow(true);
    const timer = setTimeout(() => setShow(false), 400); // puedes ajustar la duración
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-white/70 backdrop-blur-sm z-[9999] flex items-center justify-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid'></div>
    </div>
  );
}
