'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registrarUsuario, UsuarioData, ValidationError } from '@/services/registroUsuarioService';

export default function RegistroUsuarioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [rol, setRol] = useState<'admin' | 'profesor' | 'alumno' | ''>('');
  const [form, setForm] = useState<Omit<UsuarioData, 'rol'>>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    dni: '',
    sexo: 'M',
    nacionalidad: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    nombreApoderado: '',
    telefonoApoderado: '',
  });

  // Función para capitalizar cada palabra
  const capitalizarPalabra = (texto: string): string => {
    return texto
      .trim()
      .toLowerCase()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Capitalizar automáticamente nombres y apellidos
    if (name === 'nombre' || name === 'apellido' || name === 'nombreApoderado') {
      setForm((prev) => ({ ...prev, [name]: capitalizarPalabra(value) }));
    } else {
    setForm((prev) => ({ ...prev, [name]: value }));
    }

    setError(null);
    
    // Validar coincidencia de contraseñas
    if (name === 'password') {
      if (confirmPassword && value !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value !== form.password) {
      setPasswordError('Las contraseñas no coinciden');
    } else {
      setPasswordError(null);
    }
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      dni: '',
      sexo: 'M',
      nacionalidad: '',
      telefono: '',
      direccion: '',
      fechaNacimiento: '',
      nombreApoderado: '',
      telefonoApoderado: '',
    });
    setRol('');
    setConfirmPassword('');
    setPasswordError(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rol) {
      setError('Por favor seleccione un rol');
      return;
    }

    if (form.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = { ...form, rol } as UsuarioData;
      await registrarUsuario(payload);
      setShowSuccessModal(true);
      resetForm();
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido al registrar usuario');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-6 text-sm text-gray-600 flex items-center space-x-2">
        <span className="text-gray-800 font-semibold">Gestión de Accesos</span>
        <span>/</span>
        <span className="text-gray-800 font-semibold">Registro de Usuario</span>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registro de Usuario</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {showSuccessModal && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p className="font-medium">¡Éxito!</p>
            <p>Usuario registrado correctamente. Redirigiendo...</p>
          </div>
        )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rol */}
        <div>
            <label className="block font-medium text-gray-700 mb-1">
              Rol del Usuario <span className="text-red-500">*</span>
            </label>
          <select
            name="rol"
            value={rol}
              onChange={(e) => setRol(e.target.value as UsuarioData['rol'])}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            required
          >
              <option value="" className="text-gray-500">Seleccione un rol</option>
              <option value="admin" className="text-gray-900">Administrador</option>
              <option value="profesor" className="text-gray-900">Profesor</option>
              <option value="alumno" className="text-gray-900">Alumno</option>
          </select>
        </div>

        {/* Datos personales (2 columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                DNI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dni"
                value={form.dni}
                onChange={handleChange}
                required
                pattern="\d{8}"
                title="El DNI debe tener 8 dígitos"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="8 dígitos"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
                pattern="\d{9}"
                title="El teléfono debe tener 9 dígitos"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="9 dígitos"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Sexo <span className="text-red-500">*</span>
              </label>
              <select
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Nacionalidad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nacionalidad"
                value={form.nacionalidad}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Ej: Peruana"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Fecha de Nacimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          {/* Dirección (ancho completo) */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Ingrese su dirección completa"
            />
        </div>

        {/* Campos adicionales para alumno */}
        {rol === 'alumno' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Nombre del Apoderado <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombreApoderado"
                  value={form.nombreApoderado}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Nombre completo del apoderado"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Teléfono del Apoderado <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telefonoApoderado"
                  value={form.telefonoApoderado}
                  onChange={handleChange}
                  required
                  pattern="\d{9}"
                  title="El teléfono debe tener 9 dígitos"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="9 dígitos"
                />
              </div>
          </div>
        )}

          {/* Contraseñas (al final) */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Credenciales de Acceso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  minLength={6}
                  className={`w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Repita la contraseña"
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
        <button
          type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                'Registrar Usuario'
              )}
        </button>
          </div>
      </form>
      </div>

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 relative">
            <div className="flex flex-col items-center">
              {/* Ícono de éxito */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Usuario Registrado!</h3>
              <p className="text-gray-600 text-center mb-6">
                El usuario ha sido creado exitosamente en el sistema.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push('/admin/usuarios');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Ver Usuarios
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Registrar Otro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
