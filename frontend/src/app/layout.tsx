import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ScrollProgressBar from '@/components/common/ScrollProgressBar';
import ScrollToTop from '@/components/common/ScrollToTop';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'I.E.P Peruano Chino - Colegio Tradicional',
  description:
    'Colegio I.E.P Peruano Chino, educación con valores y excelencia en Ica.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es'>
      <body className={`${inter.className} bg-white text-gray-900`}>
        <ScrollProgressBar />
        {children}
        <ScrollToTop />
        <Toaster
          position='top-right'
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff'
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff'
              }
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff'
              }
            }
          }}
        />
      </body>
    </html>
  );
}
