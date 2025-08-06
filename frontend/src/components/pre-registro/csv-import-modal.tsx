'use client';

import React, { useState, useRef } from 'react';
import { XMarkIcon, DocumentArrowUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { preRegistroAdminService } from '@/services/preRegistroService';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportResult {
  success: boolean;
  message: string;
  data?: {
    procesados: number;
    creados: number;
    fechaVencimiento: string;
  };
  errores?: Array<{
    linea: number;
    error: string;
    datos: any;
  }>;
  dnisExistentes?: Array<{
    dni: string;
    nombre: string;
    apellido: string;
  }>;
  dnisDuplicados?: string[];
}

export default function CSVImportModal({ isOpen, onClose, onSuccess }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      alert('Por favor seleccione un archivo CSV válido');
      return;
    }
    setFile(selectedFile);
    setResult(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setResult(null);

    try {
      const response = await preRegistroAdminService.importFromCSV(file);
      setResult(response);
      
      if (response.success) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setIsUploading(false);
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = 'nombre,apellido,dni\nJuan Carlos,Pérez García,12345678\nMaría Elena,González López,87654321';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_preregistros.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Importar Pre-registros desde CSV
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-2">Formato del archivo CSV:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>El archivo debe contener las columnas: <code>nombre</code>, <code>apellido</code>, <code>dni</code></li>
                  <li>Los DNIs deben tener exactamente 8 dígitos</li>
                  <li>No debe haber DNIs duplicados en el archivo</li>
                  <li>Los DNIs no deben estar ya registrados en el sistema</li>
                </ul>
                <button
                  onClick={downloadTemplate}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Descargar plantilla de ejemplo
                </button>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Arrastra tu archivo CSV aquí o{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  selecciona un archivo
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Solo archivos CSV (máximo 10MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Selected File */}
          {file && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remover
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`rounded-lg p-4 ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className={`text-sm ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                <p className="font-medium mb-2">{result.message}</p>
                
                {result.success && result.data && (
                  <div className="space-y-1">
                    <p>• Estudiantes procesados: {result.data.procesados}</p>
                    <p>• Estudiantes creados: {result.data.creados}</p>
                    <p>• Fecha de vencimiento: {new Date(result.data.fechaVencimiento).toLocaleDateString()}</p>
                  </div>
                )}

                {result.errores && result.errores.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Errores encontrados:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {result.errores.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-xs">
                          Línea {error.linea}: {error.error}
                        </li>
                      ))}
                      {result.errores.length > 5 && (
                        <li className="text-xs">... y {result.errores.length - 5} errores más</li>
                      )}
                    </ul>
                  </div>
                )}

                {result.dnisExistentes && result.dnisExistentes.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">DNIs ya registrados:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {result.dnisExistentes.slice(0, 5).map((usuario, index) => (
                        <li key={index} className="text-xs">
                          {usuario.dni} - {usuario.nombre} {usuario.apellido}
                        </li>
                      ))}
                      {result.dnisExistentes.length > 5 && (
                        <li className="text-xs">... y {result.dnisExistentes.length - 5} más</li>
                      )}
                    </ul>
                  </div>
                )}

                {result.dnisDuplicados && result.dnisDuplicados.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">DNIs duplicados en el archivo:</p>
                    <p className="text-xs">{result.dnisDuplicados.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Importando...' : 'Importar'}
          </button>
        </div>
      </div>
    </div>
  );
}