// Reusable form field component with comprehensive validation and styling

import React, { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { FormFieldProps } from '@/types/user';
import { getPasswordStrength } from '@/utils/validation';

interface ExtendedFormFieldProps extends Omit<FormFieldProps, 'config'> {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'select';
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  options?: Array<{ value: string; label: string }>;
  helpText?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  autoComplete?: string;
}

export const FormField = forwardRef<HTMLInputElement | HTMLSelectElement, ExtendedFormFieldProps>(
  ({
    name,
    label,
    type = 'text',
    value,
    error,
    touched,
    onChange,
    onBlur,
    placeholder,
    required = false,
    pattern,
    minLength,
    maxLength,
    options,
    helpText,
    icon,
    loading = false,
    success = false,
    disabled = false,
    className = '',
    autoComplete,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    
    const hasError = touched && error;
    const hasSuccess = touched && !error && value && success;
    
    // Password strength for password fields
    const passwordStrength = type === 'password' && value ? getPasswordStrength(value) : null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(name, e.target.value);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFocused(false);
      onBlur(name);
    };
    
    const handleFocus = () => {
      setFocused(true);
    };
    
    const getInputClasses = () => {
      const baseClasses = `
        w-full px-4 py-3 rounded-lg border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-1
        placeholder-gray-400 text-gray-900
        ${icon ? 'pl-12' : ''}
        ${type === 'password' ? 'pr-12' : ''}
        ${loading ? 'pr-12' : ''}
      `;
      
      if (disabled) {
        return `${baseClasses} bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500`;
      }
      
      if (hasError) {
        return `${baseClasses} border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200`;
      }
      
      if (hasSuccess) {
        return `${baseClasses} border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200`;
      }
      
      if (focused) {
        return `${baseClasses} border-blue-400 bg-blue-50 focus:border-blue-500 focus:ring-blue-200`;
      }
      
      return `${baseClasses} border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-200`;
    };
    
    const getLabelClasses = () => {
      const baseClasses = 'block text-sm font-medium mb-2 transition-colors duration-200';
      
      if (hasError) {
        return `${baseClasses} text-red-700`;
      }
      
      if (hasSuccess) {
        return `${baseClasses} text-green-700`;
      }
      
      if (focused) {
        return `${baseClasses} text-blue-700`;
      }
      
      return `${baseClasses} text-gray-700`;
    };
    
    const renderInput = () => {
      if (type === 'select' && options) {
        return (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            required={required}
            className={getInputClasses()}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }
      
      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          pattern={pattern}
          minLength={minLength}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={getInputClasses()}
          {...props}
        />
      );
    };
    
    return (
      <div className={`space-y-1 ${className}`}>
        {/* Label */}
        <label htmlFor={name} className={getLabelClasses()}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          {/* Input Field */}
          {renderInput()}
          
          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {/* Loading Spinner */}
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            )}
            
            {/* Success Icon */}
            {hasSuccess && !loading && (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            )}
            
            {/* Error Icon */}
            {hasError && !loading && (
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            )}
            
            {/* Password Toggle */}
            {type === 'password' && !loading && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Password Strength Indicator */}
        {type === 'password' && value && passwordStrength && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Fortaleza de contraseña:</span>
              <span className={`font-medium text-${passwordStrength.color}-600`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              ></div>
            </div>
            {passwordStrength.suggestions.length > 0 && (
              <ul className="mt-1 text-xs text-gray-600 space-y-1">
                {passwordStrength.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {/* Error Message */}
        {hasError && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Help Text */}
        {helpText && !hasError && (
          <p className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;