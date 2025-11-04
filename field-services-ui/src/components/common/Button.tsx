/**
 * Button Component
 * Reusable button component with variants
 */

import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-xs)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'var(--font-weight-medium)',
    transition: 'all var(--transition-fast)',
    opacity: disabled ? 0.6 : 1,
    textDecoration: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.5,
    whiteSpace: 'nowrap' as const,
    boxShadow: variant === 'outline' ? 'none' : 'var(--shadow-sm)',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-text-inverse)',
      border: '1px solid var(--color-primary)',
    },
    secondary: {
      backgroundColor: 'var(--color-gray-100)',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border)',
    },
    danger: {
      backgroundColor: 'var(--color-error)',
      color: 'var(--color-text-inverse)',
      border: '1px solid var(--color-error)',
    },
    success: {
      backgroundColor: 'var(--color-success)',
      color: 'var(--color-text-inverse)',
      border: '1px solid var(--color-success)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
    },
  };

  const sizeStyles = {
    small: {
      padding: 'var(--spacing-xs) var(--spacing-sm)',
      fontSize: 'var(--font-size-sm)',
    },
    medium: {
      padding: 'var(--spacing-sm) var(--spacing-md)',
      fontSize: 'var(--font-size-base)',
    },
    large: {
      padding: 'var(--spacing-md) var(--spacing-lg)',
      fontSize: 'var(--font-size-lg)',
    },
  };

  // Create unique button ID for styling
  const buttonId = `btn-${variant}-${size}`;

  return (
    <button
      className={`${buttonId} ${className}`}
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

// Add hover and active styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    button[class*="btn-primary"]:not(:disabled):hover {
      background-color: var(--color-primary-dark) !important;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md) !important;
    }
    button[class*="btn-primary"]:not(:disabled):active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm) !important;
    }
    
    button[class*="btn-secondary"]:not(:disabled):hover {
      background-color: var(--color-gray-200) !important;
      border-color: var(--color-border-dark) !important;
    }
    
    button[class*="btn-danger"]:not(:disabled):hover {
      background-color: var(--color-error-light) !important;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md) !important;
    }
    button[class*="btn-danger"]:not(:disabled):active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm) !important;
    }
    
    button[class*="btn-success"]:not(:disabled):hover {
      background-color: var(--color-success-light) !important;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md) !important;
    }
    button[class*="btn-success"]:not(:disabled):active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm) !important;
    }
    
    button[class*="btn-outline"]:not(:disabled):hover {
      background-color: var(--color-primary) !important;
      color: var(--color-text-inverse) !important;
    }
    
    button:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  `;
  if (!document.getElementById('button-styles')) {
    styleSheet.id = 'button-styles';
    document.head.appendChild(styleSheet);
  }
}

export default Button;
