// Modern, reusable form field component with comprehensive validation support

import React, { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { FormFieldProps } from '@/types/user';
import { getPasswordStrength } from '@/utils/validation';

interface ExtendedFormFieldProps extends FormFieldProps {
  showPasswordStrength?: boolean;
  icon?: React.ReactNode;
  helpText?: string;
  loading?: boolean;
  success?: boolean;
  successMessage?: string;
}

export const FormField = forwardRef<HTMLInputElement, ExtendedFormFieldProps>((
  {
    config,
    value,
    error,
    touched,
    onChange,
    onBlur,
    disabled = false,
    className = '',
    showPasswordStrength = false,
    icon,
    helpText,
    loading = false,
    success = false,
    successMessage
  },
  ref
) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const {
    name,
    label,
    type,
    required,
    placeholder,
    pattern,
    minLength,
    maxLength,
    options
  } = config;

  const hasError = touched && error;
  const hasSuccess = touched && !error && value && success;
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  // Password strength for password fields
  const passwordStrength = showPasswordStrength && isPassword && value
    ? getPasswordStrength(value)
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(name, e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur(name);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  // Base input classes
  const baseInputClasses = `
    w-full px-4 py-3 border rounded-lg transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-1
    placeholder-gray-400 text-gray-900
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : hasSuccess
      ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
      : loading
      ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-200'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    }
    ${isFocused ? 'shadow-sm' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const renderInput = () => {
    if (type === 'select' && options) {
      return (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          required={required}
          className={baseInputClasses}
          ref={ref as React.Ref<HTMLSelectElement>}
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
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={actualType}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          pattern={pattern}
          minLength={minLength}
          maxLength={maxLength}
          className={`${baseInputClasses} ${icon ? 'pl-10' : ''} ${isPassword ? 'pr-12' : ''}`}
        />

        {/* Password visibility toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Success icon */}
        {hasSuccess && !loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <CheckCircleIcon className="h-5 w-5" />
          </div>
        )}

        {/* Error icon */}
        {hasError && !loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <ExclamationCircleIcon className="h-5 w-5" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input */}
      {renderInput()}

      {/* Password strength indicator */}
      {passwordStrength && showPasswordStrength && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  passwordStrength.color === 'red'
                    ? 'bg-red-500'
                    : passwordStrength.color === 'orange'
                    ? 'bg-orange-500'
                    : passwordStrength.color === 'yellow'
                    ? 'bg-yellow-500'
                    : passwordStrength.color === 'blue'
                    ? 'bg-blue-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
            <span className={`text-xs font-medium ${
              passwordStrength.color === 'red'
                ? 'text-red-600'
                : passwordStrength.color === 'orange'
                ? 'text-orange-600'
                : passwordStrength.color === 'yellow'
                ? 'text-yellow-600'
                : passwordStrength.color === 'blue'
                ? 'text-blue-600'
                : 'text-green-600'
            }`}>
              {passwordStrength.label}
            </span>
          </div>
          {passwordStrength.suggestions.length > 0 && (
            <ul className="text-xs text-gray-600 space-y-1">
              {passwordStrength.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center space-x-1">
                  <span className="text-gray-400">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Help text */}
      {helpText && !hasError && !hasSuccess && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}

      {/* Success message */}
      {hasSuccess && successMessage && (
        <p className="text-sm text-green-600 flex items-center space-x-1">
          <CheckCircleIcon className="h-4 w-4" />
          <span>{successMessage}</span>
        </p>
      )}

      {/* Error message */}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <ExclamationCircleIcon className="h-4 w-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';