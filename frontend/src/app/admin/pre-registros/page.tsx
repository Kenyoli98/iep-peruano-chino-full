'use client';

import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserPlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { preRegistroAdminService, preRegistroUtils } from '@/services/preRegistroService';
import { PreRegisteredStudent, PreRegistrationStats, RegistrationStatus } from '@/types/user';
import Button from '@/components/ui/button';
import CSVImportModal from '@/components/pre-registro/csv-import-modal';
import PreRegistrationForm from '@/components/pre-registro/pre-registration-form';
import { getAuthToken } from '@/utils/auth';

export default function PreRegistrosPage() {
  // Authentication state
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Component state - must be declared before any conditional returns
  const [students, setStudents] = useState<PreRegisteredStudent[]>([]);
  const [stats, setStats] = useState<PreRegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<PreRegisteredStudent | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado: '',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = getAuthToken();
        const rol = localStorage.getItem('rol');
        
        if (!token || !rol) {
          setIsAdmin(false);
        } else if (rol.toLowerCase() === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, []);

  const loadData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    
    try {
      const [studentsResponse, statsResponse] = await Promise.all([
        preRegistroAdminService.getPreRegistrations(filters),
        preRegistroAdminService.getStatistics()
      ]);

      if (studentsResponse.success && studentsResponse.data) {
        setStudents(studentsResponse.data.registros);
        setPagination(studentsResponse.data.pagination);
      }

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data when filters change (except search term changes)
  useEffect(() => {
    if (authChecked && isAdmin) {
      loadData();
    }
  }, [filters.estado, filters.page, filters.limit, authChecked, isAdmin]);

  // Initial load when component mounts
  useEffect(() => {
    if (authChecked && isAdmin) {
      loadData();
    }
  }, [authChecked, isAdmin]);

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Acceso denegado:</strong>
            <span className="block sm:inline"> No tienes permisos para acceder a esta página.</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Solo los administradores pueden acceder a la gestión de pre-registros.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/admin'}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Volver al panel de administración
            </button>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    loadData(true);
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilters(prev => ({ ...prev, search: '', page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleStatusChange = async (studentId: number, newStatus: 'activo' | 'suspendido') => {
    try {
      await preRegistroAdminService.changeStudentStatus(studentId, newStatus);
      await loadData(true);
    } catch (error) {
      console.error('Error changing status:', error);
      alert('Error al cambiar el estado del estudiante');
    }
  };

  const handleReactivatePreRegistration = async (studentId: number, diasExtension: number = 30) => {
    try {
      await preRegistroAdminService.reactivatePreRegistration(studentId, diasExtension);
      await loadData(true);
    } catch (error) {
      console.error('Error reactivating pre-registration:', error);
      alert('Error al reactivar el pre-registro');
    }
  };

  const handleViewDetails = (student: PreRegisteredStudent) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  // Helper function to get effective status
  const getEffectiveStatus = (student: PreRegisteredStudent) => {
    return preRegistroUtils.getEffectiveStatus(student.estadoRegistro, student.fechaVencimiento || null);
  };

  const handleExport = async () => {
    try {
      const exportData = await preRegistroAdminService.getPreRegistrations({
        estado: filters.estado,
        search: filters.search,
        page: 1,
        limit: 1000 // Export all data
      });
      
      if (!exportData.success || !exportData.data) {
        throw new Error('No se pudieron obtener los datos para exportar');
      }

      // Preparar datos para CSV
      const csvData = exportData.data.registros.map(student => ({
        'Código Estudiante': preRegistroUtils.formatStudentCode(student.codigoEstudiante),
        'Nombre Completo': `${student.nombre} ${student.apellido}`,
        'DNI': student.dni,
        'Email': student.email || 'N/A',
        'Estado': student.estadoRegistro,
        'Fecha Pre-registro': new Date(student.fechaPreRegistro).toLocaleDateString('es-PE'),

        'Fecha Vencimiento': student.fechaVencimiento ? new Date(student.fechaVencimiento).toLocaleDateString('es-PE') : 'N/A',
        'Último Login': student.ultimoLogin ? new Date(student.ultimoLogin).toLocaleDateString('es-PE') : 'Nunca'
      }));

      // Convertir a CSV
       const headers = Object.keys(csvData[0] || {});
       const csvContent = [
         headers.join(','),
         ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
       ].join('\n');

      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pre-registros-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar los datos');
    }
  };

  const getStatusColor = (status: string) => {
    return preRegistroUtils.getStatusColor(status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'activo':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'expirado':
      case 'cancelado':
      case 'suspendido':
        return <XCircleIcon className="w-4 h-4" />;
      case 'por vencer':
        return <ClockIcon className="w-4 h-4 text-amber-600" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pre-registros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pre-registros de Estudiantes</h1>
              <p className="text-gray-600 mt-2">Gestiona las solicitudes de pre-inscripción y matrículas pendientes</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowForm(true)}
                variant="primary"
                leftIcon={<UserPlusIcon className="w-4 h-4" />}
              >
                Nuevo Pre-registro
              </Button>
              <Button
                onClick={() => setShowCSVModal(true)}
                variant="secondary"
                leftIcon={<DocumentArrowUpIcon className="w-4 h-4" />}
              >
                Carga Masiva CSV
              </Button>
              <Button
                onClick={handleExport}
                variant="secondary"
                leftIcon={<DocumentArrowDownIcon className="w-4 h-4" />}
              >
                Exportar Lista
              </Button>
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={refreshing}
                leftIcon={<ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
              >
                {refreshing ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{stats.activos}</div>
                <div className="text-sm text-gray-600">Activos</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-red-600">{stats.expirados}</div>
                <div className="text-sm text-gray-600">Expirados</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-600">{stats.suspendidos}</div>
                <div className="text-sm text-gray-600">Suspendidos</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{stats.proximosVencer}</div>
                <div className="text-sm text-gray-600">Por vencer</div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, DNI o código..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                title="Buscar"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
              {filters.search && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  title="Limpiar búsqueda"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>

                <option value="activo">Activo</option>
                <option value="expirado">Expirado</option>
                <option value="suspendido">Suspendido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.nombre} {student.apellido}
                        </div>
                        <div className="text-sm text-gray-500">DNI: {student.dni}</div>
                        {student.email && (
                          <div className="text-sm text-gray-500">{student.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {preRegistroUtils.formatStudentCode(student.codigoEstudiante)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const effectiveStatus = getEffectiveStatus(student);
                        return (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusColor(effectiveStatus)
                          }`}>
                            {getStatusIcon(effectiveStatus)}
                            <span className="ml-1 capitalize">{preRegistroUtils.getStatusLabel(effectiveStatus)}</span>
                          </span>
                        );
                      })()} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Pre-registro: {formatDate(student.fechaPreRegistro)}</div>
                      {student.fechaVencimiento && (
                        <div>Vence: {formatDate(student.fechaVencimiento)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(student)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {student.estadoRegistro === 'activo' && (
                          <button
                            onClick={() => handleStatusChange(student.id, 'suspendido')}
                            className="text-red-600 hover:text-red-900"
                            title="Suspender"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    a{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    de{' '}
                    <span className="font-medium">{pagination.total}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {students.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <ClockIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pre-registros</h3>
            <p className="text-gray-600">
              {filters.search || filters.estado
                ? 'No se encontraron pre-registros con los filtros aplicados.'
                : 'Aún no se han creado pre-registros de estudiantes.'}
            </p>
          </div>
        )}

        {/* Pre-registration Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Nuevo Pre-registro</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <PreRegistrationForm
                onSuccess={(student) => {
                  handleRefresh();
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* CSV Import Modal */}
        <CSVImportModal
          isOpen={showCSVModal}
          onClose={() => setShowCSVModal(false)}
          onSuccess={handleRefresh}
        />

        {/* Student Details Modal */}
        {showDetailsModal && selectedStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detalles del Estudiante</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedStudent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Información Personal */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Información Personal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Código de Estudiante</label>
                      <p className="text-sm text-gray-900 font-mono">{preRegistroUtils.formatStudentCode(selectedStudent.codigoEstudiante)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">DNI</label>
                      <p className="text-sm text-gray-900">{selectedStudent.dni}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Nombre Completo</label>
                      <p className="text-sm text-gray-900">{selectedStudent.nombre} {selectedStudent.apellido}</p>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-600">Email</label>
                       <p className="text-sm text-gray-900">{selectedStudent.email || 'No especificado'}</p>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-600">Último Login</label>
                       <p className="text-sm text-gray-900">
                         {selectedStudent.ultimoLogin ? formatDate(selectedStudent.ultimoLogin) : 'Nunca'}
                       </p>
                     </div>
                  </div>
                </div>

                {/* Estado y Fechas */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Estado del Registro</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Estado Actual</label>
                      {(() => {
                        const effectiveStatus = getEffectiveStatus(selectedStudent);
                        return (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(effectiveStatus)}`}>
                            {getStatusIcon(effectiveStatus)}
                            <span className="ml-1 capitalize">{preRegistroUtils.getStatusLabel(effectiveStatus)}</span>
                          </span>
                        );
                      })()} 
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Fecha de Pre-registro</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedStudent.fechaPreRegistro)}</p>
                    </div>

                    {selectedStudent.fechaVencimiento && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Fecha de Vencimiento</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedStudent.fechaVencimiento)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  {(() => {
                    const effectiveStatus = getEffectiveStatus(selectedStudent);
                    return (
                      <>
                        {(effectiveStatus === 'expirado' || effectiveStatus === 'por vencer') && (
                          <button
                            onClick={() => {
                              handleReactivatePreRegistration(selectedStudent.id);
                              setShowDetailsModal(false);
                              setSelectedStudent(null);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <ClockIcon className="w-4 h-4 mr-2" />
                            Reactivar Pre-registro
                          </button>
                        )}
                        {selectedStudent.estadoRegistro === 'activo' && (
                          <button
                            onClick={() => {
                              handleStatusChange(selectedStudent.id, 'suspendido');
                              setShowDetailsModal(false);
                              setSelectedStudent(null);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Suspender Estudiante
                          </button>
                        )}
                      </>
                    );
                  })()} 
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedStudent(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}