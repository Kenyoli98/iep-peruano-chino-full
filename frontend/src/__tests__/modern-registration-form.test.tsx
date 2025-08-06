import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ModernRegistrationForm } from '../components/registration/modern-registration-form';

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the services with relative paths
jest.mock('../services/registroUsuarioService', () => ({
  registrarUsuario: jest.fn().mockResolvedValue({
    success: true,
    message: 'Usuario registrado exitosamente'
  }),
}));

jest.mock('../services/dniService', () => ({
  consultarDNI: jest.fn().mockResolvedValue({
    success: true,
    data: {
      nombres: 'Juan',
      apellidos: 'Pérez'
    }
  }),
}));

describe('ModernRegistrationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the registration form', () => {
    render(<ModernRegistrationForm />);
    
    // Check if the main form elements are present
    expect(screen.getByText('Registro de Usuario')).toBeInTheDocument();
    expect(screen.getByText('Información Personal')).toBeInTheDocument();
  });

  it('renders role selection', () => {
    render(<ModernRegistrationForm />);
    
    // Check for role selection
    expect(screen.getByText('Tipo de Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Alumno')).toBeInTheDocument();
    expect(screen.getByLabelText('Profesor')).toBeInTheDocument();
    expect(screen.getByLabelText('Administrador')).toBeInTheDocument();
  });

  it('renders form action buttons', () => {
    render(<ModernRegistrationForm />);
    
    // Check for action buttons
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar usuario/i })).toBeInTheDocument();
  });

  it('shows guardian information section for students', async () => {
    const user = userEvent.setup();
    render(<ModernRegistrationForm />);
    
    // Initially, guardian section should not be visible
    expect(screen.queryByText('Información del Apoderado')).not.toBeInTheDocument();
    
    // Select student role
    await user.click(screen.getByLabelText('Alumno'));
    
    // Guardian section should now be visible
    await waitFor(() => {
      expect(screen.getByText('Información del Apoderado')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('allows role selection and shows form sections', async () => {
    const user = userEvent.setup();
    render(<ModernRegistrationForm />);
    
    // Select professor role
    await user.click(screen.getByLabelText('Profesor'));
    
    // Check that the role is selected
    expect(screen.getByLabelText('Profesor')).toBeChecked();
    
    // Wait for form sections to be visible
    await waitFor(() => {
      expect(screen.getByText('Información Personal')).toBeInTheDocument();
      expect(screen.getByText('Información de Contacto')).toBeInTheDocument();
      expect(screen.getByText('Seguridad')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders basic form structure without role-dependent fields initially', () => {
    render(<ModernRegistrationForm />);
    
    // Check that basic structure is present
    expect(screen.getByText('Registro de Usuario')).toBeInTheDocument();
    expect(screen.getByText('Complete el formulario para registrar un nuevo usuario en el sistema.')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Usuario')).toBeInTheDocument();
    
    // Form sections should be present but fields might not be visible until role is selected
    expect(screen.getByText('Información Personal')).toBeInTheDocument();
    expect(screen.getByText('Información de Contacto')).toBeInTheDocument();
    expect(screen.getByText('Seguridad')).toBeInTheDocument();
  });
});