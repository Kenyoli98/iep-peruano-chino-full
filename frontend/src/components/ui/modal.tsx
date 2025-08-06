'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Button from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'error' | 'info';
  loading?: boolean;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  buttonText?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-[90%] max-h-[90vh]'
};

const variantIcons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
  warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />,
  error: <XCircleIcon className="h-6 w-6 text-red-600" />,
  info: <InformationCircleIcon className="h-6 w-6 text-blue-600" />,
  default: null
};

const variantColors = {
  success: 'border-t-4 border-green-500',
  warning: 'border-t-4 border-yellow-500',
  error: 'border-t-4 border-red-500',
  info: 'border-t-4 border-blue-500',
  default: ''
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleOverlayClick}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`
            relative w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300
            ${sizeClasses[size]}
            ${variantColors[variant]}
            ${className}
          `.replace(/\s+/g, ' ').trim()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center space-x-3">
                {variantIcons[variant]}
                {title && (
                  <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="Cerrar modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          )}
          
          <div className={`px-6 ${title || showCloseButton ? 'pb-6' : 'py-6'}`}>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: 'calc(90vh - 200px)' }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Confirmation Modal
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      size="sm"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>
        
        <div className="flex space-x-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            fullWidth={false}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'error' ? 'danger' : 'warning'}
            onClick={onConfirm}
            loading={loading}
            fullWidth={false}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Alert Modal
export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info',
  buttonText = 'Entendido'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>
        
        <div className="flex justify-end">
          <Button
            variant={variant === 'success' ? 'success' : 'primary'}
            onClick={onClose}
            fullWidth={false}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Success Modal
export const SuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}> = ({
  isOpen,
  onClose,
  title,
  message,
  primaryAction,
  secondaryAction
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="success"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>
        
        <div className="flex space-x-3 justify-end">
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              fullWidth={false}
            >
              {secondaryAction.label}
            </Button>
          )}
          
          <Button
            variant="success"
            onClick={primaryAction?.onClick || onClose}
            fullWidth={false}
          >
            {primaryAction?.label || 'Continuar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
