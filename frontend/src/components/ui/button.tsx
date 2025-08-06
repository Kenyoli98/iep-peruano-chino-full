import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success' | 'warning';
  size?: 'sm' | 'default' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500'
};

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  default: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-8 text-lg'
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((
  {
    variant = 'primary',
    size = 'default',
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = true,
    disabled,
    children,
    className = '',
    ...props
  },
  ref
) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      <span>
        {loading && loadingText ? loadingText : children}
      </span>
      
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

// Predefined button components for common use cases
export const SubmitButton: React.FC<Omit<ButtonProps, 'type'>> = (props) => (
  <Button type="submit" {...props} />
);

export const CancelButton: React.FC<ButtonProps> = (props) => (
  <Button variant="outline" {...props} />
);

export const DeleteButton: React.FC<ButtonProps> = (props) => (
  <Button variant="danger" {...props} />
);

export const SaveButton: React.FC<ButtonProps> = (props) => (
  <Button variant="success" {...props} />
);

export const LoadingButton: React.FC<ButtonProps> = ({ loading, children, ...props }) => (
  <Button loading={loading} loadingText="Cargando..." {...props}>
    {children}
  </Button>
);
