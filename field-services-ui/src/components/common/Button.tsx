/**
 * Button Component
 * Reusable button component with variants
 */

import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = {
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#1976d2',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#f5f5f5',
      color: '#333',
      border: '1px solid #ddd',
    },
    danger: {
      backgroundColor: '#d32f2f',
      color: 'white',
    },
  };

  const sizeStyles = {
    small: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem',
    },
    medium: {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
    },
    large: {
      padding: '0.75rem 1.5rem',
      fontSize: '1.125rem',
    },
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
