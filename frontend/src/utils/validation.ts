// Comprehensive validation utilities for user registration

import { UserFormData, ValidationResult, UserRole } from '@/types/user';

// Regular expressions for validation
const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  dni: /^\d{8}$/,
  phone: /^\d{9}$/,
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  address: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]{5,200}$/
} as const;

// Error messages
const ERROR_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingrese un correo electrónico válido',
  dni: 'El DNI debe tener exactamente 8 dígitos',
  phone: 'El teléfono debe tener exactamente 9 dígitos',
  name: 'Solo se permiten letras y espacios (2-50 caracteres)',
  password: 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número',
  passwordMatch: 'Las contraseñas no coinciden',
  address: 'La dirección debe tener entre 5 y 200 caracteres',
  minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max: number) => `No puede exceder ${max} caracteres`,
  minAge: 'Debe ser mayor de edad (18 años)',
  maxAge: 'La edad no puede ser mayor a 100 años',
  futureDate: 'La fecha no puede ser en el futuro',
  invalidDate: 'Ingrese una fecha válida'
} as const;

// Individual field validators
export const validators = {
  required: (value: string): string | null => {
    return !value?.trim() ? ERROR_MESSAGES.required : null;
  },

  email: (value: string): string | null => {
    if (!value) return null;
    return REGEX_PATTERNS.email.test(value) ? null : ERROR_MESSAGES.email;
  },

  dni: (value: string): string | null => {
    if (!value) return null;
    return REGEX_PATTERNS.dni.test(value) ? null : ERROR_MESSAGES.dni;
  },

  phone: (value: string): string | null => {
    if (!value) return null;
    return REGEX_PATTERNS.phone.test(value) ? null : ERROR_MESSAGES.phone;
  },

  name: (value: string): string | null => {
    if (!value) return null;
    return REGEX_PATTERNS.name.test(value) ? null : ERROR_MESSAGES.name;
  },

  password: (value: string): string | null => {
    if (!value) return null;
    if (value.length < 6) {
      return ERROR_MESSAGES.minLength(6);
    }
    return REGEX_PATTERNS.password.test(value) ? null : ERROR_MESSAGES.password;
  },

  address: (value: string): string | null => {
    if (!value) return null;
    return REGEX_PATTERNS.address.test(value) ? null : ERROR_MESSAGES.address;
  },

  birthDate: (value: string): string | null => {
    if (!value) return null;
    
    const date = new Date(value);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return ERROR_MESSAGES.invalidDate;
    }
    
    if (date > now) {
      return ERROR_MESSAGES.futureDate;
    }
    
    const age = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();
    const dayDiff = now.getDate() - date.getDate();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    
    if (actualAge < 18) {
      return ERROR_MESSAGES.minAge;
    }
    
    if (actualAge > 100) {
      return ERROR_MESSAGES.maxAge;
    }
    
    return null;
  },

  confirmPassword: (value: string, originalPassword: string): string | null => {
    if (!value) return null;
    return value === originalPassword ? null : ERROR_MESSAGES.passwordMatch;
  },

  minLength: (min: number) => (value: string): string | null => {
    if (!value) return null;
    return value.length >= min ? null : ERROR_MESSAGES.minLength(min);
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (!value) return null;
    return value.length <= max ? null : ERROR_MESSAGES.maxLength(max);
  }
};

// Field validation rules
const FIELD_RULES: Record<string, Array<(value: string) => string | null>> = {
  nombre: [validators.required, validators.name],
  apellido: [validators.required, validators.name],
  email: [validators.required, validators.email],
  password: [validators.required, validators.password],
  confirmPassword: [], // Special handling in validateForm
  dni: [validators.required, validators.dni],
  sexo: [validators.required],
  nacionalidad: [validators.required, validators.name],
  telefono: [validators.required, validators.phone],
  direccion: [validators.required, validators.address],
  fechaNacimiento: [validators.required, validators.birthDate],
  nombreApoderado: [validators.name], // Required only for students
  telefonoApoderado: [validators.phone] // Required only for students
};

// Validate a single field
export const validateField = (
  name: keyof UserFormData,
  value: string,
  formData?: UserFormData,
  role?: UserRole
): string | null => {
  const rules = FIELD_RULES[name] || [];
  
  // Special handling for confirm password
  if (name === 'confirmPassword' && formData) {
    const requiredError = validators.required(value);
    if (requiredError) return requiredError;
    return validators.confirmPassword(value, formData.password);
  }
  
  // Special handling for guardian fields (only required for students)
  if ((name === 'nombreApoderado' || name === 'telefonoApoderado') && role === 'alumno') {
    const requiredError = validators.required(value);
    if (requiredError) return requiredError;
  }
  
  // Apply all rules for the field
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  
  return null;
};

// Validate entire form
export const validateForm = (
  formData: UserFormData,
  role: UserRole
): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate all fields
  Object.keys(formData).forEach((key) => {
    const fieldName = key as keyof UserFormData;
    const value = formData[fieldName];
    
    // Skip guardian fields if not a student
    if (role !== 'alumno' && (fieldName === 'nombreApoderado' || fieldName === 'telefonoApoderado')) {
      return;
    }
    
    const error = validateField(fieldName, String(value || ''), formData, role);
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate form on submit (more strict)
export const validateFormForSubmission = (
  formData: UserFormData,
  role: UserRole
): ValidationResult => {
  const result = validateForm(formData, role);
  
  // Additional submission validations
  if (role === 'alumno') {
    if (!formData.nombreApoderado?.trim()) {
      result.errors.nombreApoderado = 'El nombre del apoderado es obligatorio para alumnos';
    }
    if (!formData.telefonoApoderado?.trim()) {
      result.errors.telefonoApoderado = 'El teléfono del apoderado es obligatorio para alumnos';
    }
  }
  
  result.isValid = Object.keys(result.errors).length === 0;
  return result;
};

// Utility functions
export const sanitizeInput = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};

export const capitalizeWords = (text: string): string => {
  // Don't sanitize while typing to allow spaces
  return text
    .split(' ')
    .map(word => {
      if (word.length === 0) return word; // Preserve empty strings (multiple spaces)
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

// Function to sanitize and capitalize for final processing
export const sanitizeAndCapitalizeWords = (text: string): string => {
  return sanitizeInput(text)
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatDNI = (dni: string): string => {
  return dni.replace(/\D/g, '').slice(0, 8);
};

export const formatPhone = (phone: string): string => {
  return phone.replace(/\D/g, '').slice(0, 9);
};

// Check if field should be shown based on role
export const shouldShowField = (fieldName: string, role: UserRole): boolean => {
  if (fieldName === 'nombreApoderado' || fieldName === 'telefonoApoderado') {
    return role === 'alumno';
  }
  return true;
};

// Form configuration
export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'date' | 'select';
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  options?: Array<{ value: string; label: string }>;
  visibleFor?: UserRole[];
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export interface RegistrationFormConfig {
  sections: FormSection[];
}

export const FORM_CONFIG: RegistrationFormConfig = {
  sections: [
    {
      title: 'Información Personal',
      fields: [
        {
          name: 'rol',
          label: 'Tipo de Usuario',
          type: 'select',
          required: true,
          options: [
            { value: 'admin', label: 'Administrador' },
            { value: 'profesor', label: 'Profesor' },
            { value: 'alumno', label: 'Alumno' }
          ]
        },
        {
          name: 'nombre',
          label: 'Nombres',
          type: 'text',
          required: true,
          placeholder: 'Ingrese los nombres'
        },
        {
          name: 'apellido',
          label: 'Apellidos',
          type: 'text',
          required: true,
          placeholder: 'Ingrese los apellidos'
        },
        {
          name: 'dni',
          label: 'DNI',
          type: 'text',
          required: true,
          placeholder: '12345678',
          maxLength: 8,
          pattern: '[0-9]{8}'
        },
        {
          name: 'sexo',
          label: 'Género',
          type: 'select',
          required: true,
          options: [
            { value: '', label: 'Seleccionar género' },
            { value: 'M', label: 'Masculino' },
            { value: 'F', label: 'Femenino' }
          ]
        },
        {
          name: 'nacionalidad',
          label: 'Nacionalidad',
          type: 'select',
          required: true,
          options: [
            { value: '', label: 'Seleccionar nacionalidad' },
            { value: 'Peruana', label: 'Peruana' },
            { value: 'Argentina', label: 'Argentina' },
            { value: 'Boliviana', label: 'Boliviana' },
            { value: 'Brasileña', label: 'Brasileña' },
            { value: 'Chilena', label: 'Chilena' },
            { value: 'Colombiana', label: 'Colombiana' },
            { value: 'Ecuatoriana', label: 'Ecuatoriana' },
            { value: 'Española', label: 'Española' },
            { value: 'Estadounidense', label: 'Estadounidense' },
            { value: 'Francesa', label: 'Francesa' },
            { value: 'Italiana', label: 'Italiana' },
            { value: 'Mexicana', label: 'Mexicana' },
            { value: 'Paraguaya', label: 'Paraguaya' },
            { value: 'Uruguaya', label: 'Uruguaya' },
            { value: 'Venezolana', label: 'Venezolana' },
            { value: 'Otra', label: 'Otra' }
          ]
        },
        {
          name: 'fechaNacimiento',
          label: 'Fecha de Nacimiento',
          type: 'date',
          required: true
        }
      ]
    },
    {
      title: 'Información de Contacto',
      fields: [
        {
          name: 'email',
          label: 'Correo Electrónico',
          type: 'email',
          required: true,
          placeholder: 'usuario@ejemplo.com'
        },
        {
          name: 'telefono',
          label: 'Teléfono',
          type: 'tel',
          required: true,
          placeholder: '987654321',
          maxLength: 9
        },
        {
          name: 'direccion',
          label: 'Dirección',
          type: 'text',
          required: true,
          placeholder: 'Ingrese la dirección completa'
        }
      ]
    },
    {
      title: 'Información del Apoderado',
      fields: [
        {
          name: 'nombreApoderado',
          label: 'Nombre del Apoderado',
          type: 'text',
          required: true,
          placeholder: 'Nombre completo del apoderado',
          visibleFor: ['alumno']
        },
        {
          name: 'telefonoApoderado',
          label: 'Teléfono del Apoderado',
          type: 'tel',
          required: true,
          placeholder: '987654321',
          maxLength: 9,
          visibleFor: ['alumno']
        }
      ]
    },
    {
      title: 'Seguridad',
      fields: [
        {
          name: 'password',
          label: 'Contraseña',
          type: 'password',
          required: true,
          placeholder: 'Mínimo 6 caracteres',
          minLength: 6
        },
        {
          name: 'confirmPassword',
          label: 'Confirmar Contraseña',
          type: 'password',
          required: true,
          placeholder: 'Repita la contraseña'
        }
      ]
    }
  ]
};

// Get field requirements based on role
export const isFieldRequired = (fieldName: string, role: UserRole): boolean => {
  const config = FORM_CONFIG.sections
    .flatMap(section => section.fields)
    .find(field => field.name === fieldName);
  
  if (!config) return false;
  
  return config.required && (!config.visibleFor || config.visibleFor.includes(role));
};

// Get field visibility based on role
export const isFieldVisible = (fieldName: string, role: UserRole | ''): boolean => {
  if (!role) return true;
  
  const config = FORM_CONFIG.sections
    .flatMap(section => section.fields)
    .find(field => field.name === fieldName);
  
  if (!config) return true;
  
  // Guardian fields are only visible for students
  if (fieldName === 'nombreApoderado' || fieldName === 'telefonoApoderado') {
    return role === 'alumno';
  }
  
  return !config.visibleFor || config.visibleFor.includes(role as UserRole);
};

// Password strength evaluation
export interface PasswordStrength {
  score: number; // 0-5
  label: string;
  color: 'red' | 'orange' | 'yellow' | 'blue' | 'green';
  suggestions: string[];
}

export const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const suggestions: string[] = [];
  
  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    suggestions.push('Usa al menos 8 caracteres');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Incluye al menos una letra mayúscula');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Incluye al menos una letra minúscula');
  }
  
  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Incluye al menos un número');
  }
  
  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Incluye al menos un carácter especial (!@#$%^&*)');
  }
  
  // Determine label and color
  let label: string;
  let color: PasswordStrength['color'];
  
  if (score <= 1) {
    label = 'Muy débil';
    color = 'red';
  } else if (score === 2) {
    label = 'Débil';
    color = 'orange';
  } else if (score === 3) {
    label = 'Regular';
    color = 'yellow';
  } else if (score === 4) {
    label = 'Fuerte';
    color = 'blue';
  } else {
    label = 'Muy fuerte';
    color = 'green';
  }
  
  return {
    score,
    label,
    color,
    suggestions
  };
};

// Real-time validation debouncer
export const createDebouncedValidator = (delay: number = 300) => {
  let timeoutId: NodeJS.Timeout;
  
  return (fn: () => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
  };
};