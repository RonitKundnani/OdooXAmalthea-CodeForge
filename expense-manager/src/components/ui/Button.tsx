import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 border-transparent',
  secondary: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 border-gray-300',
  outline: 'bg-transparent text-teal-700 hover:bg-teal-50 focus:ring-teal-500 border-teal-300',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  const variantClass = variantClasses[variant] || variantClasses.primary;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const widthClass = fullWidth ? 'w-full' : '';
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={props.type || 'button'}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className={`animate-spin ${children ? 'mr-2' : ''} h-4 w-4`} />
      )}
      
      {!isLoading && icon && iconPosition === 'left' && (
        <span className={`${children ? 'mr-2' : ''} flex-shrink-0`}>
          {icon}
        </span>
      )}
      
      {children}
      
      {!isLoading && icon && iconPosition === 'right' && (
        <span className={`${children ? 'ml-2' : ''} flex-shrink-0`}>
          {icon}
        </span>
      )}
    </button>
  );
};

// Example usage:
// <Button 
//   variant="primary" 
//   size="md" 
//   isLoading={isLoading}
//   onClick={handleClick}
//   icon={<Mail size={16} />}
// >
//   Click me
// </Button>
