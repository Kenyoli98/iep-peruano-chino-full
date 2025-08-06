'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { obtenerAsignacionesPorProfesor } from '@/services/asignacionesService';
import { HorarioProfesor } from '@/components/asignaciones/modals/ModalAsignaciones';
import type { Asignacion } from '@/services/asignacionesService';
import type { Profesor } from '@/services/profesoresService';

export default function ImprimirHorario() {
  const searchParams = useSearchParams();
  const [profesor, setProfesor] = useState<Profesor | null>(null);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profesorId = searchParams.get('profesorId');
    const profesorNombre = searchParams.get('profesorNombre');
    const profesorApellido = searchParams.get('profesorApellido');

    if (profesorId && profesorNombre && profesorApellido) {
      const cargarDatos = async () => {
        try {
          // Crear objeto profesor con los datos de la URL
          const profesorData: Profesor = {
            id: parseInt(profesorId),
            nombre: profesorNombre,
            apellido: profesorApellido,
            email: '',
            rol: 'profesor'
          };

          const asignacionesData = await obtenerAsignacionesPorProfesor(
            parseInt(profesorId)
          );

          setProfesor(profesorData);
          setAsignaciones(asignacionesData);

          // Imprimir automáticamente después de cargar
          setTimeout(() => {
            window.print();
          }, 1000);
        } catch (error) {
          console.error('Error al cargar datos:', error);
        } finally {
          setLoading(false);
        }
      };

      cargarDatos();
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!profesor) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p>No se encontró el profesor</p>
      </div>
    );
  }

  return (
    <div className='p-8'>
      {/* Título para impresión */}
      <div className='text-center mb-6 print:mb-4'>
        <h1 className='text-2xl font-bold text-gray-900 print:text-lg'>
          Horario de Clases
        </h1>
        <h2 className='text-lg text-gray-600 print:text-sm'>
          {profesor.nombre} {profesor.apellido}
        </h2>
      </div>

      {/* El mismo componente que se usa en el modal */}
      <HorarioProfesor asignaciones={asignaciones} />
    </div>
  );
}
