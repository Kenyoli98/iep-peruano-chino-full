'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash, FaSave, FaUndo, FaDownload, FaUpload, FaGripVertical, FaEdit, FaMagic } from 'react-icons/fa';
import { ModalConfiguracionGradosProps, GradosPorNivel } from '@/types/configuracion';
import { ConfiguracionService } from '@/services/configuracionService';

interface FormularioNivelProps {
  nivel: string;
  grados: string[];
  onNivelChange: (nuevoNivel: string) => void;
  onGradosChange: (grados: string[]) => void;
  onEliminar: () => void;
  esNuevo?: boolean;
}

interface GradoItemProps {
  grado: string;
  index: number;
  onEdit: (index: number, nuevoGrado: string) => void;
  onDelete: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
}

const GradoItem: React.FC<GradoItemProps> = ({
  grado,
  index,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [editando, setEditando] = useState(false);
  const [valorTemporal, setValorTemporal] = useState(grado);

  const handleGuardarEdicion = () => {
    if (valorTemporal.trim() && valorTemporal !== grado) {
      onEdit(index, valorTemporal.trim());
    }
    setEditando(false);
    setValorTemporal(grado);
  };

  const handleCancelarEdicion = () => {
    setEditando(false);
    setValorTemporal(grado);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuardarEdicion();
    } else if (e.key === 'Escape') {
      handleCancelarEdicion();
    }
  };

  return (
    <div
      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border border-gray-200 hover:border-gray-300 transition-colors cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
    >
      <div className="flex items-center flex-1">
        <FaGripVertical className="text-gray-400 mr-2 cursor-grab" size={12} />
        {editando ? (
          <input
            type="text"
            value={valorTemporal}
            onChange={(e) => setValorTemporal(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleGuardarEdicion}
            className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span className="text-sm flex-1">{grado}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {!editando && (
          <button
            onClick={() => setEditando(true)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
            title="Editar grado"
          >
            <FaEdit size={12} />
          </button>
        )}
        <button
          onClick={() => onDelete(index)}
          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
          title="Eliminar grado"
        >
          <FaTimes size={12} />
        </button>
      </div>
    </div>
  );
};

const FormularioNivel: React.FC<FormularioNivelProps> = ({
  nivel,
  grados,
  onNivelChange,
  onGradosChange,
  onEliminar,
  esNuevo = false
}) => {
  const [nuevoGrado, setNuevoGrado] = useState('');
  const [editandoNivel, setEditandoNivel] = useState(esNuevo);
  const [nivelTemporal, setNivelTemporal] = useState(nivel);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const agregarGrado = () => {
    if (nuevoGrado.trim() && !grados.includes(nuevoGrado.trim())) {
      onGradosChange([...grados, nuevoGrado.trim()]);
      setNuevoGrado('');
    }
  };

  const eliminarGrado = (index: number) => {
    onGradosChange(grados.filter((_, i) => i !== index));
  };

  const editarGrado = (index: number, nuevoValor: string) => {
    if (!grados.includes(nuevoValor) || grados[index] === nuevoValor) {
      const nuevosGrados = [...grados];
      nuevosGrados[index] = nuevoValor;
      onGradosChange(nuevosGrados);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarGrado();
    }
  };

  const handleGuardarNivel = () => {
    const nuevoNombre = nivelTemporal.trim().toUpperCase();
    if (nuevoNombre && nuevoNombre !== nivel) {
      onNivelChange(nuevoNombre);
    }
    setEditandoNivel(false);
    setNivelTemporal(nivel);
  };

  const handleCancelarNivel = () => {
    setEditandoNivel(false);
    setNivelTemporal(nivel);
  };

  // Actualizar nivelTemporal cuando cambie el prop nivel
  useEffect(() => {
    setNivelTemporal(nivel);
  }, [nivel]);

  const handleKeyPressNivel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuardarNivel();
    } else if (e.key === 'Escape') {
      handleCancelarNivel();
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const nuevosGrados = [...grados];
    const [gradoMovido] = nuevosGrados.splice(draggedIndex, 1);
    nuevosGrados.splice(dropIndex, 0, gradoMovido);
    
    onGradosChange(nuevosGrados);
    setDraggedIndex(null);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nivel Educativo
          </label>
          <div className="flex items-center gap-2">
            {editandoNivel ? (
              <input
                type="text"
                value={nivelTemporal}
                onChange={(e) => setNivelTemporal(e.target.value)}
                onKeyPress={handleKeyPressNivel}
                onBlur={handleGuardarNivel}
                className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: INICIAL, PRIMARIA, SECUNDARIA"
                autoFocus
              />
            ) : (
              <>
                <input
                  type="text"
                  value={nivel}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: INICIAL, PRIMARIA, SECUNDARIA"
                  readOnly
                  onClick={() => setEditandoNivel(true)}
                />
                <button
                  onClick={() => setEditandoNivel(true)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                  title="Editar nivel"
                >
                  <FaEdit size={14} />
                </button>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onEliminar}
          className="ml-3 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
          title="Eliminar nivel"
        >
          <FaTrash size={18} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grados
        </label>
        
        {/* Lista de grados existentes */}
        <div className="space-y-2 mb-3">
          {grados.length > 0 && (
            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <FaGripVertical size={10} />
              Arrastra para reordenar, haz clic para editar
            </div>
          )}
          {grados.map((grado, index) => (
            <GradoItem
              key={`${grado}-${index}`}
              grado={grado}
              index={index}
              onEdit={editarGrado}
              onDelete={eliminarGrado}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>

        {/* Agregar nuevo grado */}
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevoGrado}
            onChange={(e) => setNuevoGrado(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Ej: 1°, 2°, 3 años, etc."
          />
          <button
            onClick={agregarGrado}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
            disabled={!nuevoGrado.trim()}
          >
            <FaPlus size={16} />
            <span className="text-sm">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalConfiguracionGrados: React.FC<ModalConfiguracionGradosProps> = ({
  isOpen,
  onClose,
  onGuardar,
  configuracionActual,
  loading = false
}) => {
  const [configuracion, setConfiguracion] = useState<GradosPorNivel>(configuracionActual);
  const [errores, setErrores] = useState<string[]>([]);
  const [advertencias, setAdvertencias] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfiguracion(configuracionActual);
      setErrores([]);
      
      // Validar configuración inicial para mostrar advertencias
      const validacion = ConfiguracionService.validarConfiguracion(configuracionActual);
      setAdvertencias(validacion.advertencias || []);
    }
  }, [isOpen, configuracionActual]);

  const validarYGuardar = async () => {
    const validacion = ConfiguracionService.validarConfiguracion(configuracion);
    
    if (!validacion.valida) {
      setErrores(validacion.errores);
      setAdvertencias(validacion.advertencias || []);
      return;
    }

    setErrores([]);
    setAdvertencias([]);
    setGuardando(true);
    
    try {
      ConfiguracionService.guardarGradosPorNivel(configuracion);
      onGuardar(configuracion);
      onClose();
    } catch (error) {
      setErrores(['Error al guardar la configuración']);
    } finally {
      setGuardando(false);
    }
  };

  const agregarNuevoNivel = () => {
    let contador = 1;
    let nuevoNivel = `NUEVO_NIVEL_${contador}`;
    
    // Asegurar que el nombre sea único
    while (configuracion[nuevoNivel]) {
      contador++;
      nuevoNivel = `NUEVO_NIVEL_${contador}`;
    }
    
    setConfiguracion({
      ...configuracion,
      [nuevoNivel]: ['1°']
    });
  };

  const actualizarNivel = (nivelAnterior: string, nuevoNivel: string, grados: string[]) => {
    const nuevaConfiguracion = { ...configuracion };
    
    // Verificar que el nuevo nombre no existe en otros niveles
    if (nivelAnterior !== nuevoNivel && nuevaConfiguracion[nuevoNivel]) {
      setErrores([`Ya existe un nivel con el nombre &quot;${nuevoNivel}&quot;`]);
      return;
    }
    
    if (nivelAnterior !== nuevoNivel) {
      delete nuevaConfiguracion[nivelAnterior];
    }
    
    nuevaConfiguracion[nuevoNivel] = grados;
    setConfiguracion(nuevaConfiguracion);
    setErrores([]);
  };

  const eliminarNivel = (nivel: string) => {
    const nuevaConfiguracion = { ...configuracion };
    delete nuevaConfiguracion[nivel];
    setConfiguracion(nuevaConfiguracion);
  };

  const restaurarDefault = () => {
    const configuracionDefault = ConfiguracionService.restaurarConfiguracionDefault();
    setConfiguracion(configuracionDefault);
    setErrores([]);
    setAdvertencias([]);
  };

  const limpiarGrados = () => {
    const configuracionLimpia = { ...configuracion };
    Object.keys(configuracionLimpia).forEach(nivel => {
      configuracionLimpia[nivel] = configuracionLimpia[nivel].map(grado => 
        ConfiguracionService.limpiarGrado(grado)
      );
    });
    setConfiguracion(configuracionLimpia);
    setAdvertencias([]);
  };

  const exportarConfiguracion = () => {
    const jsonString = ConfiguracionService.exportarConfiguracion();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuracion-grados.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importarConfiguracion = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const nuevaConfiguracion = ConfiguracionService.importarConfiguracion(jsonString);
        setConfiguracion(nuevaConfiguracion);
        setErrores([]);
      } catch (error) {
        setErrores([error instanceof Error ? error.message : 'Error al importar archivo']);
      }
    };
    reader.readAsText(file);
    
    // Limpiar el input
    event.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Configuración de Grados por Nivel
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading || guardando}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Errores */}
          {errores.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-sm font-medium text-red-800 mb-2">Errores encontrados:</h3>
              <ul className="text-sm text-red-700 space-y-1">
                {errores.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Advertencias */}
          {advertencias.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">Recomendaciones:</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {advertencias.map((advertencia, index) => (
                      <li key={index}>• {advertencia}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={limpiarGrados}
                  className="ml-3 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors flex items-center gap-1"
                  title="Limpiar automáticamente todos los grados"
                >
                  <FaMagic size={10} />
                  Limpiar
                </button>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={agregarNuevoNivel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaPlus size={16} />
              Agregar Nivel
            </button>
            
            <button
              onClick={restaurarDefault}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FaUndo size={16} />
              Restaurar Default
            </button>
            
            <button
              onClick={exportarConfiguracion}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaDownload size={16} />
              Exportar
            </button>
            
            <label className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer">
              <FaUpload size={16} />
              Importar
              <input
                type="file"
                accept=".json"
                onChange={importarConfiguracion}
                className="hidden"
              />
            </label>
          </div>

          {/* Formularios de niveles */}
          <div className="space-y-4">
            {Object.entries(configuracion).map(([nivel, grados]) => (
              <FormularioNivel
                key={nivel}
                nivel={nivel}
                grados={grados}
                onNivelChange={(nuevoNivel) => actualizarNivel(nivel, nuevoNivel, grados)}
                onGradosChange={(nuevosGrados) => actualizarNivel(nivel, nivel, nuevosGrados)}
                onEliminar={() => eliminarNivel(nivel)}
                esNuevo={nivel.startsWith('NUEVO_NIVEL_')}
              />
            ))}
          </div>

          {Object.keys(configuracion).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No hay niveles configurados.</p>
              <p className="text-sm mt-2">Haz clic en &quot;Agregar Nivel&quot; para comenzar.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading || guardando}
          >
            Cancelar
          </button>
          <button
            onClick={validarYGuardar}
            disabled={loading || guardando || Object.keys(configuracion).length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {guardando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <FaSave size={16} />
                Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfiguracionGrados;