'use client';

import Link from 'next/link';
import {
  FaBook,
  FaUsers,
  FaChalkboardTeacher,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaMoneyBillWave,
  FaHome,
  FaGraduationCap,
  FaUserGraduate,
  FaClipboardList,
  FaCog,
  FaChartBar,
  FaCalendarAlt,
  FaFileAlt,
  FaBell,
  FaSignOutAlt,
  FaUserShield
} from 'react-icons/fa';
import { MdDashboard, MdSchool, MdAssignment } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { HiAcademicCap } from 'react-icons/hi';

type Props = {
  nombre: string;
  sidebarOpen: boolean;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  submenuAcademicoOpen: boolean;
  submenuAccesosOpen: boolean;
  toggleSubmenuAcademico: () => void;
  toggleSubmenuAccesos: () => void;
  toggleSidebar: () => void;
};

export default function AdminSidebar({
  nombre,
  sidebarOpen,
  sidebarRef,
  submenuAcademicoOpen,
  submenuAccesosOpen,
  toggleSubmenuAcademico,
  toggleSubmenuAccesos,
  toggleSidebar,
}: Props) {
  const collapsed = !sidebarOpen;
  const sidebarWidth = collapsed ? 32 : 224; // w-8 (32px) o w-56 (224px)
  return (
    <>
      {/* Sidebar */}
      <div
          ref={sidebarRef as React.RefObject<HTMLDivElement>}
          className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-50 to-white shadow-xl transform transition-all duration-300 ease-in-out backdrop-blur-sm
             ${collapsed ? 'w-8' : 'w-72'} z-40 pt-20 flex flex-col border-r border-slate-200`}
          style={{ minWidth: collapsed ? 32 : 288 }}
        >
        {/* Botón toggle perfectamente centrado y mitad dentro/mitad fuera */}
        <button
          onClick={toggleSidebar}
          className="absolute top-1/2 -right-5 z-50 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 border-4 border-white transition-colors duration-200"
          aria-label="Alternar menú lateral"
          style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)' }}
        >
          {sidebarOpen ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
        </button>
        
        <div className={`flex-1 p-4 flex flex-col bg-white/95 backdrop-blur-sm transition-all duration-300 overflow-hidden ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
          {/* Bienvenida */}
          <div className="mb-8 px-2">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-slate-800 whitespace-nowrap">
                Hola, <span className="text-blue-600 font-semibold">{nombre?.toUpperCase()}</span>
              </h3>
              <p className="text-sm text-slate-600 mt-2 font-medium whitespace-nowrap">
                ¡Te damos la bienvenida!
              </p>
            </div>
          </div>

          {/* Dashboard Principal */}
          <div className="mb-2">
            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group hover:bg-blue-50 hover:shadow-sm">
              <MdDashboard className="text-blue-600 text-lg flex-shrink-0" />
              <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors duration-200 whitespace-nowrap">Panel Principal</span>
            </Link>
          </div>
          
          {/* Menú Académico */}
          <div className="mb-2">
            <div className="space-y-1">
              <button
                onClick={toggleSubmenuAcademico}
                className="flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 group hover:bg-emerald-50 hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <HiAcademicCap className="text-emerald-600 text-lg flex-shrink-0" />
                  <span className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors duration-200 whitespace-nowrap">Académico</span>
                </span>
                <FaChevronDown className={`${submenuAcademicoOpen ? 'rotate-180' : ''} transition-transform duration-200 text-slate-500 text-sm`} />
              </button>
              {submenuAcademicoOpen && (
                <div className="ml-4 space-y-1 pl-3 border-l-2 border-emerald-200 py-2 animate-in slide-in-from-left-2 duration-300">
                  <Link href="/admin/cursos" className="flex items-center gap-3 p-2 rounded-md text-sm transition-all duration-200 group hover:bg-emerald-50">
                    <FaBook className="text-emerald-500 text-sm" /> <span className="text-slate-600 group-hover:text-emerald-700 font-medium">Cursos</span>
                  </Link>
                  <Link href="/admin/secciones" className="flex items-center gap-3 p-2 rounded-md text-sm transition-all duration-200 group hover:bg-emerald-50">
                    <MdSchool className="text-emerald-500 text-sm" /> <span className="text-slate-600 group-hover:text-emerald-700 font-medium">Secciones</span>
                  </Link>
                  <Link href="/admin/asignaciones" className="flex items-center gap-3 p-2 rounded-md text-sm transition-all duration-200 group hover:bg-emerald-50">
                    <FaChalkboardTeacher className="text-emerald-500 text-sm" /> <span className="text-slate-600 group-hover:text-emerald-700 font-medium">Asignaciones</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Menú Usuarios */}
          <div className="mb-2">
            <div className="space-y-1">
              <button
                onClick={toggleSubmenuAccesos}
                className="flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 group hover:bg-violet-50 hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <FaUsers className="text-violet-600 text-lg flex-shrink-0" />
                  <span className="font-semibold text-slate-700 group-hover:text-violet-700 transition-colors duration-200 whitespace-nowrap">Usuarios</span>
                </span>
                <FaChevronDown className={`${submenuAccesosOpen ? 'rotate-180' : ''} transition-transform duration-200 text-slate-500 text-sm`} />
              </button>
              {submenuAccesosOpen && (
                <div className="ml-4 space-y-1 pl-3 border-l-2 border-violet-200 py-2 animate-in slide-in-from-left-2 duration-300">
                  <Link href="/admin/registro-usuario" className="flex items-center gap-3 p-2 rounded-md text-sm transition-all duration-200 group hover:bg-violet-50">
                    <FaUserGraduate className="text-violet-500 text-sm" /> <span className="text-slate-600 group-hover:text-violet-700 font-medium">Registrar</span>
                  </Link>
                  <Link href="/admin/usuarios" className="flex items-center gap-3 p-2 rounded-md text-sm transition-all duration-200 group hover:bg-violet-50">
                    <FaUsers className="text-violet-500 text-sm" /> <span className="text-slate-600 group-hover:text-violet-700 font-medium">Gestionar</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Otros elementos del menú */}
          <div className="space-y-1">
            <div className="mb-2">
              <Link href="/admin/matriculas" className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group hover:bg-amber-50 hover:shadow-sm">
                <FaUserGraduate className="text-amber-600 text-lg flex-shrink-0" />
                <span className="font-semibold text-slate-700 group-hover:text-amber-700 transition-colors duration-200 whitespace-nowrap">Matrículas</span>
              </Link>
            </div>

            <div className="mb-2">
              <Link href="/admin/calificaciones" className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group hover:bg-teal-50 hover:shadow-sm">
                <MdAssignment className="text-teal-600 text-lg flex-shrink-0" />
                <span className="font-semibold text-slate-700 group-hover:text-teal-700 transition-colors duration-200 whitespace-nowrap">Calificaciones</span>
              </Link>
            </div>
          </div>

          {/* Pensiones */}
          <div className="space-y-1">
            <div className="mb-2">
              <Link href="/admin/pensiones" className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group hover:bg-rose-50 hover:shadow-sm">
                <FaMoneyBillWave className="text-rose-600 text-lg flex-shrink-0" />
                <span className="font-semibold text-slate-700 group-hover:text-rose-700 transition-colors duration-200 whitespace-nowrap">Pensiones</span>
              </Link>
            </div>
          </div>

          {/* Reportes */}
          <div className="space-y-1">
            <div className="mb-2">
              <Link href="/admin/reportes" className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group hover:bg-indigo-50 hover:shadow-sm">
                <FaChartBar className="text-indigo-600 text-lg flex-shrink-0" />
                <span className="font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors duration-200 whitespace-nowrap">Reportes</span>
              </Link>
            </div>
          </div>

          {/* Configuración */}
          <div className="mt-auto pt-3 border-t border-slate-200">
            <div className="mb-2">
              <Link href="/admin/configuracion" className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group hover:bg-slate-50 hover:shadow-sm">
                <IoMdSettings className="text-slate-600 text-lg flex-shrink-0" />
                <span className="font-semibold text-slate-700 group-hover:text-slate-800 transition-colors duration-200 whitespace-nowrap">Configuración</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}