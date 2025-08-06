// Custom hook for managing registration form state and logic

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  UserFormData,
  UserRole,
  FormState,
  DNIState,
  ValidationResult,
  UserRegistrationData,
  Gender
} from '@/types/user';
import {
  validateField,
  validateFormForSubmission,
  capitalizeWords,
  sanitizeAndCapitalizeWords,
  formatDNI,
  formatPhone,
  sanitizeInput,
  createDebouncedValidator
} from '@/utils/validation';
import { consultarDNI, formatearDatosParaFormulario, validarFormatoDNI } from '@/services/dniService';

interface UseRegistrationFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserRegistrationData, role: UserRole) => Promise<void>;
}

interface UseRegistrationFormReturn {
  // Form state
  formData: UserFormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  showSuccessModal: boolean;
  isValid: boolean;
  isDirty: boolean;
  canSubmit: boolean;
  role: UserRole | '';
  
  // DNI state
  dniState: DNIState;
  
  // Form actions
  handleFieldChange: (name: string, value: string) => void;
  handleFieldBlur: (name: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setShowSuccessModal: (show: boolean) => void;
}

const initialFormData: UserFormData = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmPassword: '',
  dni: '',
  sexo: '',
  nacionalidad: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  rol: '',
  nombreApoderado: '',
  telefonoApoderado: ''
};

export const useRegistrationForm = ({
  initialData = {},
  onSubmit
}: UseRegistrationFormProps): UseRegistrationFormReturn => {
  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    ...initialFormData,
    ...initialData
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [role, setRole] = useState<UserRole | ''>(initialData.rol || '');
  const [dniState, setDniState] = useState<DNIState>({
    isLoading: false,
    isConsulted: false,
    error: null,
    data: null
  });
  const [originalData] = useState<UserFormData>({ ...initialFormData, ...initialData });
  
  // Debounced validator
  const debouncedValidator = useMemo(() => createDebouncedValidator(300), []);
  
  // Sync role state with formData.rol
  useEffect(() => {
    if (formData.rol !== role) {
      setRole(formData.rol as UserRole | '');
      console.log('🔄 Syncing role state:', formData.rol);
    }
  }, [formData.rol, role]);
  
  // Computed values
  const isValid = useMemo(() => {
    if (!role) return false;
    const validation = validateFormForSubmission(formData, role);
    return validation.isValid;
  }, [formData, role]);
  
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);
  
  const canSubmit = useMemo(() => {
    if (!role) {
      console.log('🔍 Validation Debug: No role selected');
      return false;
    }
    
    const validationResult = validateFormForSubmission(formData, role);
    const isValidValue = validationResult.isValid;
    const canSubmitValue = isValidValue && !isSubmitting;
    
    console.log('🔍 Validation Debug:', {
      formData,
      role,
      isValid: isValidValue,
      isSubmitting,
      canSubmit: canSubmitValue,
      errors: validationResult.errors
    });
    
    return canSubmitValue;
  }, [formData, role, isSubmitting]);
  
  // DNI consultation
  const consultDNI = useCallback(async (dni: string) => {
    if (!validarFormatoDNI(dni)) {
      setDniState(prev => ({
        ...prev,
        error: 'El DNI debe tener exactamente 8 dígitos',
        isConsulted: false
      }));
      return;
    }
    
    setDniState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await consultarDNI(dni);
      
      if (response.success && response.data) {
        const formattedData = formatearDatosParaFormulario(response.data);
        
        if (formattedData) {
          // Auto-fill form with DNI data
          setFormData(prev => ({
            ...prev,
            nombre: formattedData.nombre,
            apellido: formattedData.apellido,
            sexo: formattedData.sexo,
            direccion: formattedData.direccion,
            fechaNacimiento: formattedData.fechaNacimiento,
            nacionalidad: formattedData.nacionalidad
          }));
          
          setDniState(prev => ({
            ...prev,
            isLoading: false,
            isConsulted: true,
            data: response.data,
            error: null
          }));
          
          // Clear related field errors
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.nombre;
            delete newErrors.apellido;
            delete newErrors.sexo;
            delete newErrors.direccion;
            delete newErrors.fechaNacimiento;
            delete newErrors.nacionalidad;
            return newErrors;
          });
        }
      } else {
        setDniState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'No se pudieron obtener los datos del DNI',
          isConsulted: false
        }));
      }
    } catch (error) {
      console.error('Error consultando DNI:', error);
      setDniState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al consultar el DNI. Puede continuar llenando manualmente.',
        isConsulted: false
      }));
    }
  }, []);
  
  // Field update handler
  const handleFieldChange = useCallback((name: string, value: string) => {
    const fieldName = name as keyof UserFormData;
    let processedValue = value;
    
    // Apply field-specific formatting
    switch (name) {
      case 'nombre':
      case 'apellido':
      case 'nombreApoderado':
        // Capitalize each word as user types
        processedValue = capitalizeWords(value);
        break;
      case 'dni':
        processedValue = formatDNI(value);
        break;
      case 'telefono':
      case 'telefonoApoderado':
        processedValue = formatPhone(value);
        break;
      case 'email':
        processedValue = sanitizeInput(value).toLowerCase();
        break;
      case 'direccion':
        // Allow spaces in addresses during typing
        processedValue = value;
        break;
      case 'nacionalidad':
        processedValue = sanitizeInput(value);
        break;
    }
    
    setFormData(prev => ({ ...prev, [fieldName]: processedValue }));
    
    // Special handling for role field
    if (fieldName === 'rol') {
      setRole(processedValue as UserRole);
      console.log('🎭 Role updated to:', processedValue);
    }
    
    // Clear field error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    
    // Special handling for DNI field
    if (fieldName === 'dni') {
      setDniState(prev => ({ ...prev, error: null, isConsulted: false }));
      
      // Auto-consult DNI when 8 digits are entered
      if (processedValue.length === 8 && /^\d{8}$/.test(processedValue)) {
        consultDNI(processedValue);
      }
    }
    
    // Special handling for password confirmation
    if (fieldName === 'password' && formData.confirmPassword) {
      debouncedValidator(() => {
        const confirmError = validateField('confirmPassword', formData.confirmPassword, {
          ...formData,
          [fieldName]: processedValue
        }, role as UserRole);
        
        if (confirmError) {
          setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.confirmPassword;
            return newErrors;
          });
        }
      });
    }
    
    // Debounced validation for the current field
    debouncedValidator(() => {
      validateFieldAsync(fieldName);
    });
  }, [formData, errors, role, debouncedValidator, consultDNI]);
  
  // Role update handler
  const updateRole = useCallback((newRole: UserRole | '') => {
    setRole(newRole);
    
    // Clear guardian fields if not a student
    if (newRole !== 'alumno') {
      setFormData(prev => ({
        ...prev,
        nombreApoderado: '',
        telefonoApoderado: ''
      }));
      
      // Clear guardian field errors
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.nombreApoderado;
        delete newErrors.telefonoApoderado;
        return newErrors;
      });
    }
  }, []);
  
  // Field blur handler
  const handleFieldBlur = useCallback((name: string) => {
    const fieldName = name as keyof UserFormData;
    
    // Apply sanitization and capitalization on blur for name fields
    if (fieldName === 'nombre' || fieldName === 'apellido' || fieldName === 'nombreApoderado') {
      const currentValue = formData[fieldName] as string;
      if (currentValue) {
        const sanitizedValue = sanitizeAndCapitalizeWords(currentValue);
        setFormData(prev => ({ ...prev, [fieldName]: sanitizedValue }));
      }
    }
    
    // Trim whitespace for address field on blur
    if (fieldName === 'direccion') {
      const currentValue = formData[fieldName] as string;
      if (currentValue) {
        const trimmedValue = currentValue.trim();
        setFormData(prev => ({ ...prev, [fieldName]: trimmedValue }));
      }
    }
    
    validateFieldAsync(fieldName);
  }, [formData, sanitizeAndCapitalizeWords]);
  
  // Field validation
  const validateFieldAsync = useCallback((name: keyof UserFormData) => {
    if (!role) return;
    
    const error = validateField(name, String(formData[name] || ''), formData, role as UserRole);
    
    setErrors(prev => {
      if (error) {
        return { ...prev, [name]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
    });
    
    setTouched(prev => ({ ...prev, [name]: true }));
  }, [formData, role]);
  
  // Form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 Form submission started');
    console.log('📋 Form data:', formData);
    console.log('👤 Role:', role);
    console.log('✅ Can submit:', canSubmit);
    console.log('📝 Is valid:', isValid);
    console.log('⚠️ Errors:', errors);
    
    if (!role || !canSubmit) {
      console.log('❌ Submission blocked - role:', role, 'canSubmit:', canSubmit);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Final validation
      const validation = validateFormForSubmission(formData, role);
      
      console.log('🔍 Final validation result:', validation);
      
      if (!validation.isValid) {
        console.log('❌ Validation failed:', validation.errors);
        setErrors(validation.errors);
        // Mark all fields as touched to show errors
        const allTouched = Object.keys(formData).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);
        return;
      }
      
      console.log('✅ Validation passed, proceeding with submission...');
      
      // Prepare data for submission
      const submissionData: UserRegistrationData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        dni: formData.dni,
        sexo: formData.sexo as Gender,
        nacionalidad: formData.nacionalidad,
        telefono: formData.telefono,
        direccion: formData.direccion,
        fechaNacimiento: formData.fechaNacimiento,
        rol: role,
        ...(role === 'alumno' && {
          nombreApoderado: formData.nombreApoderado,
          telefonoApoderado: formData.telefonoApoderado
        })
      };
      
      await onSubmit(submissionData, role);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error; // Re-throw to let parent component handle
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, role, canSubmit, onSubmit]);
  
  // Legacy form submission for backward compatibility
  const submitForm = useCallback(async () => {
    if (!role || !canSubmit) return;
    
    setIsSubmitting(true);
    
    try {
      // Final validation
      const validation = validateFormForSubmission(formData, role);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        // Mark all fields as touched to show errors
        const allTouched = Object.keys(formData).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);
        return;
      }
      
      // Prepare data for submission
      const submissionData: UserRegistrationData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        dni: formData.dni,
        sexo: formData.sexo as Gender,
        nacionalidad: formData.nacionalidad,
        telefono: formData.telefono,
        direccion: formData.direccion,
        fechaNacimiento: formData.fechaNacimiento,
        rol: role,
        ...(role === 'alumno' && {
          nombreApoderado: formData.nombreApoderado,
          telefonoApoderado: formData.telefonoApoderado
        })
      };
      
      await onSubmit(submissionData, role);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error; // Re-throw to let parent component handle
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, role, canSubmit, onSubmit]);
  
  // Reset form
  const resetForm = useCallback(() => {
    setFormData({ ...initialFormData, ...initialData });
    setErrors({});
    setTouched({});
    setRole('');
    setDniState({
       isLoading: false,
       isConsulted: false,
       error: null,
       data: null
     });
    setIsSubmitting(false);
    setShowSuccessModal(false);
  }, [initialData]);
  
  // Helper functions
  const getFieldError = useCallback((name: keyof UserFormData) => {
    return touched[name] ? errors[name] : undefined;
  }, [errors, touched]);
  
  const isFieldTouched = useCallback((name: keyof UserFormData) => {
    return Boolean(touched[name]);
  }, [touched]);
  
  const isFieldRequired = useCallback((name: keyof UserFormData) => {
    const alwaysRequired = [
      'nombre', 'apellido', 'email', 'password', 'confirmPassword',
      'dni', 'sexo', 'nacionalidad', 'telefono', 'direccion', 'fechaNacimiento'
    ];
    
    if (alwaysRequired.includes(name)) {
      return true;
    }
    
    if ((name === 'nombreApoderado' || name === 'telefonoApoderado') && role === 'alumno') {
      return true;
    }
    
    return false;
  }, [role]);
  
  const shouldShowField = useCallback((name: keyof UserFormData) => {
    if (name === 'nombreApoderado' || name === 'telefonoApoderado') {
      return role === 'alumno';
    }
    return true;
  }, [role]);
  
  // Form state object
  const formState: FormState = {
    data: formData,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty
  };
  
  return {
    formData,
    errors,
    touched,
    isSubmitting,
    showSuccessModal,
    isValid,
    isDirty,
    canSubmit,
    role,
    dniState,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    resetForm,
    setShowSuccessModal
  };
};