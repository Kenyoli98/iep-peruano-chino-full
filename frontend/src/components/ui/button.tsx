import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-[#c82333] hover:bg-red-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-800 text-white',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`w-full font-bold py-2 rounded-md transition shadow-md text-sm sm:text-base ${
        variantClasses[variant]
      } ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
};

export default Button;
