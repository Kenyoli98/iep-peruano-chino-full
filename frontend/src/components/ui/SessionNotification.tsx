'use client';

import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaClock, FaTimes } from 'react-icons/fa';

interface SessionNotificationProps {
  type: 'warning' | 'expired';
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  autoClose?: number; // tiempo en ms para cerrar automáticamente
}

export default function SessionNotification({
  type,
  message,
  onConfirm,
  onCancel,
  onClose,
  autoClose
}: SessionNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(
    autoClose ? Math.floor(autoClose / 1000) : 0
  );

  useEffect(() => {
    if (autoClose && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoClose && timeLeft === 0) {
      handleClose();
    }
  }, [timeLeft, autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleConfirm = () => {
    setIsVisible(false);
    onConfirm?.();
  };

  const handleCancel = () => {
    setIsVisible(false);
    onCancel?.();
  };

  if (!isVisible) return null;

  const isWarning = type === 'warning';
  const bgColor = isWarning ? 'bg-amber-50' : 'bg-red-50';
  const borderColor = isWarning ? 'border-amber-200' : 'border-red-200';
  const iconColor = isWarning ? 'text-amber-600' : 'text-red-600';
  const buttonColor = isWarning
    ? 'bg-amber-600 hover:bg-amber-700'
    : 'bg-red-600 hover:bg-red-700';

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4'>
      <div
        className={`${bgColor} ${borderColor} border-2 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300`}
      >
        <div className='p-6'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              {isWarning ? (
                <FaClock className={`${iconColor} text-2xl`} />
              ) : (
                <FaExclamationTriangle className={`${iconColor} text-2xl`} />
              )}
              <h3 className='text-lg font-bold text-gray-900'>
                {isWarning ? 'Advertencia de Sesión' : 'Sesión Expirada'}
              </h3>
            </div>
            {!isWarning && (
              <button
                onClick={handleClose}
                className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
              >
                <FaTimes size={16} />
              </button>
            )}
          </div>

          {/* Message */}
          <div className='mb-6'>
            <p className='text-gray-700 text-sm leading-relaxed'>{message}</p>
            {timeLeft > 0 && (
              <div className='mt-3 flex items-center gap-2'>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${isWarning ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{
                      width: `${(timeLeft / (autoClose! / 1000)) * 100}%`
                    }}
                  ></div>
                </div>
                <span className='text-xs text-gray-500 font-medium min-w-fit'>
                  {timeLeft}s
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className='flex gap-3'>
            {isWarning ? (
              <>
                <button
                  onClick={handleCancel}
                  className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors duration-200'
                >
                  Cerrar Sesión
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-2 ${buttonColor} text-white rounded-lg font-medium transition-colors duration-200`}
                >
                  Continuar
                </button>
              </>
            ) : (
              <button
                onClick={handleClose}
                className={`w-full px-4 py-2 ${buttonColor} text-white rounded-lg font-medium transition-colors duration-200`}
              >
                Entendido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
