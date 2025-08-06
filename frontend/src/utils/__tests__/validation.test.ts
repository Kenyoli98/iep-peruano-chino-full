import {
  validateField,
  validateForm,
  sanitizeInput,
  capitalizeWords,
  formatDNI,
  formatPhone,
  getPasswordStrength,
  isFieldRequired,
  isFieldVisible,
  FORM_CONFIG
} from '../validation';
import { UserFormData, UserRole } from '../../types/user';

describe('Validation Utils', () => {
  const mockFormData: UserFormData = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    dni: '12345678',
    sexo: 'M',
    nacionalidad: 'Peruana',
    telefono: '987654321',
    direccion: 'Av. Principal 123',
    fechaNacimiento: '1990-01-01',
    rol: 'profesor',
    nombreApoderado: 'María Pérez',
    telefonoApoderado: '987654322'
  };

  describe('validateField', () => {
    it('validates required fields correctly', () => {
      expect(validateField('nombre', '', mockFormData, 'profesor')).toBe('Este campo es obligatorio');
      expect(validateField('nombre', 'Juan', mockFormData, 'profesor')).toBeNull();
    });

    it('validates email format', () => {
      expect(validateField('email', 'invalid-email', mockFormData, 'profesor')).toBe('Ingrese un correo electrónico válido');
      expect(validateField('email', 'valid@example.com', mockFormData, 'profesor')).toBeNull();
    });

    it('validates DNI format', () => {
      expect(validateField('dni', '123', mockFormData, 'profesor')).toBe('El DNI debe tener exactamente 8 dígitos');
      expect(validateField('dni', '12345678', mockFormData, 'profesor')).toBeNull();
    });

    it('validates phone format', () => {
      expect(validateField('telefono', '123', mockFormData, 'profesor')).toBe('El teléfono debe tener exactamente 9 dígitos');
      expect(validateField('telefono', '987654321', mockFormData, 'profesor')).toBeNull();
    });

    it('validates password strength', () => {
      expect(validateField('password', '123', mockFormData, 'profesor')).toBe('Debe tener al menos 6 caracteres');
      expect(validateField('password', 'Password123!', mockFormData, 'profesor')).toBeNull();
    });

    it('validates password confirmation', () => {
      const formDataWithPassword = { ...mockFormData, password: 'Password123!' };
      expect(validateField('confirmPassword', 'DifferentPassword', formDataWithPassword, 'profesor')).toBe('Las contraseñas no coinciden');
      expect(validateField('confirmPassword', 'Password123!', formDataWithPassword, 'profesor')).toBeNull();
    });

    it('validates name format', () => {
      expect(validateField('nombre', 'Juan123', mockFormData, 'profesor')).toBe('Solo se permiten letras y espacios (2-50 caracteres)');
      expect(validateField('nombre', 'Juan Carlos', mockFormData, 'profesor')).toBeNull();
    });

    it('validates address format', () => {
      expect(validateField('direccion', 'Ab', mockFormData, 'profesor')).toBe('La dirección debe tener entre 5 y 200 caracteres');
      expect(validateField('direccion', 'Av. Principal 123', mockFormData, 'profesor')).toBeNull();
    });
  });

  describe('validateForm', () => {
    it('returns no errors for valid form data', () => {
      const result = validateForm(mockFormData, 'profesor');
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('returns errors for invalid form data', () => {
      const invalidData: UserFormData = {
        ...mockFormData,
        nombre: '',
        email: 'invalid-email',
        dni: '123'
      };
      
      const result = validateForm(invalidData, 'profesor');
      expect(result.isValid).toBe(false);
      expect(result.errors.nombre).toBe('Este campo es obligatorio');
      expect(result.errors.email).toBe('Ingrese un correo electrónico válido');
      expect(result.errors.dni).toBe('El DNI debe tener exactamente 8 dígitos');
    });

    it('validates guardian fields for student role', () => {
      const studentData: UserFormData = {
        ...mockFormData,
        rol: 'alumno',
        nombreApoderado: '',
        telefonoApoderado: ''
      };
      
      const result = validateForm(studentData, 'alumno');
      expect(result.isValid).toBe(false);
      expect(result.errors.nombreApoderado).toBe('Este campo es obligatorio');
      expect(result.errors.telefonoApoderado).toBe('Este campo es obligatorio');
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });

    it('removes extra spaces', () => {
      expect(sanitizeInput('test   multiple   spaces')).toBe('test multiple spaces');
    });

    it('handles empty strings', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });
  });

  describe('capitalizeWords', () => {
    it('capitalizes first letter of each word', () => {
      expect(capitalizeWords('juan carlos')).toBe('Juan Carlos');
      expect(capitalizeWords('MARÍA JOSÉ')).toBe('María José');
    });

    it('handles single words', () => {
      expect(capitalizeWords('juan')).toBe('Juan');
    });

    it('handles empty strings', () => {
      expect(capitalizeWords('')).toBe('');
    });
  });

  describe('formatDNI', () => {
    it('extracts only digits', () => {
      expect(formatDNI('abc12345678def')).toBe('12345678');
    });

    it('limits to 8 digits', () => {
      expect(formatDNI('123456789012')).toBe('12345678');
    });

    it('handles empty strings', () => {
      expect(formatDNI('')).toBe('');
    });
  });

  describe('formatPhone', () => {
    it('extracts only digits', () => {
      expect(formatPhone('abc987654321def')).toBe('987654321');
    });

    it('limits to 9 digits', () => {
      expect(formatPhone('98765432123456')).toBe('987654321');
    });

    it('handles empty strings', () => {
      expect(formatPhone('')).toBe('');
    });
  });

  describe('getPasswordStrength', () => {
    it('returns weak for short passwords', () => {
      const result = getPasswordStrength('123');
      expect(result.score).toBe(1); // Only has numbers
      expect(result.label).toBe('Muy débil');
      expect(result.color).toBe('red');
    });

    it('returns medium for moderate passwords', () => {
      const result = getPasswordStrength('Password123');
      expect(result.score).toBe(4); // Length + uppercase + lowercase + numbers
      expect(result.label).toBe('Fuerte');
      expect(result.color).toBe('blue');
    });

    it('returns strong for complex passwords', () => {
      const result = getPasswordStrength('Password123!@#');
      expect(result.score).toBe(5);
      expect(result.label).toBe('Muy fuerte');
      expect(result.color).toBe('green');
    });

    it('provides helpful suggestions', () => {
      const result = getPasswordStrength('password');
      expect(result.suggestions).toContain('Incluye al menos una letra mayúscula');
      expect(result.suggestions).toContain('Incluye al menos un número');
      expect(result.suggestions).toContain('Incluye al menos un carácter especial (!@#$%^&*)');
    });
  });

  describe('isFieldRequired', () => {
    it('returns true for required fields', () => {
      expect(isFieldRequired('nombre', 'profesor')).toBe(true);
      expect(isFieldRequired('email', 'alumno')).toBe(true);
    });

    it('returns true for guardian fields when role is student', () => {
      expect(isFieldRequired('nombreApoderado', 'alumno')).toBe(true);
      expect(isFieldRequired('telefonoApoderado', 'alumno')).toBe(true);
    });

    it('returns false for guardian fields when role is not student', () => {
      expect(isFieldRequired('nombreApoderado', 'profesor')).toBe(false);
      expect(isFieldRequired('telefonoApoderado', 'admin')).toBe(false);
    });
  });

  describe('isFieldVisible', () => {
    it('returns true for always visible fields', () => {
      expect(isFieldVisible('nombre', 'profesor')).toBe(true);
      expect(isFieldVisible('email', 'alumno')).toBe(true);
    });

    it('returns true for guardian fields when role is student', () => {
      expect(isFieldVisible('nombreApoderado', 'alumno')).toBe(true);
      expect(isFieldVisible('telefonoApoderado', 'alumno')).toBe(true);
    });

    it('returns false for guardian fields when role is not student', () => {
      expect(isFieldVisible('nombreApoderado', 'profesor')).toBe(false);
      expect(isFieldVisible('telefonoApoderado', 'admin')).toBe(false);
    });
  });

  describe('FORM_CONFIG', () => {
    it('has all required sections', () => {
      expect(FORM_CONFIG.sections).toHaveLength(4);
      expect(FORM_CONFIG.sections[0].title).toBe('Información Personal');
      expect(FORM_CONFIG.sections[1].title).toBe('Información de Contacto');
      expect(FORM_CONFIG.sections[2].title).toBe('Información del Apoderado');
      expect(FORM_CONFIG.sections[3].title).toBe('Seguridad');
    });

    it('has proper field configurations', () => {
      const personalSection = FORM_CONFIG.sections[0];
      const fieldNames = personalSection.fields.map(field => field.name);
      expect(fieldNames).toContain('nombre');
      expect(fieldNames).toContain('apellido');
      expect(fieldNames).toContain('dni');
    });

    it('has proper field structure', () => {
      const allFields = FORM_CONFIG.sections.flatMap(section => section.fields);
      const fieldNames = allFields.map(field => field.name);
      expect(fieldNames).toContain('nombre');
      expect(fieldNames).toContain('email');
      expect(fieldNames).toContain('password');
    });
  });
});