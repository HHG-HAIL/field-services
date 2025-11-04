/**
 * Input Component
 * Reusable input field with label and error handling
 */

import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

export const Input = ({
  label,
  error,
  fullWidth = false,
  helperText,
  className = '',
  ...props
}: InputProps) => {
  const inputId = props.id || props.name;
  const hasError = Boolean(error);

  const containerStyle = {
    marginBottom: 'var(--spacing-md)',
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 'var(--spacing-xs)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-sm)',
  };

  const inputWrapperStyle = {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle = {
    width: fullWidth ? '100%' : 'auto',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    fontSize: 'var(--font-size-base)',
    border: hasError
      ? '2px solid var(--color-error)'
      : '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    transition: 'all var(--transition-fast)',
    boxSizing: 'border-box' as const,
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    lineHeight: 'var(--line-height-normal)',
  };

  const errorStyle = {
    marginTop: 'var(--spacing-xs)',
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-error)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
  };

  const helperTextStyle = {
    marginTop: 'var(--spacing-xs)',
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-secondary)',
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
          {props.required && (
            <span style={{ color: 'var(--color-error)', marginLeft: 'var(--spacing-xs)' }}>
              *
            </span>
          )}
        </label>
      )}
      <div style={inputWrapperStyle}>
        <input
          id={inputId}
          className={`input-field ${hasError ? 'input-error' : ''} ${className}`}
          style={inputStyle}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
      </div>
      {error && (
        <div id={`${inputId}-error`} style={errorStyle} role="alert">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {!error && helperText && (
        <div id={`${inputId}-helper`} style={helperTextStyle}>
          {helperText}
        </div>
      )}
    </div>
  );
};

// Add focus and hover styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .input-field:not(.input-error):hover {
      border-color: var(--color-border-dark);
    }
    .input-field:not(.input-error):focus {
      border-color: var(--color-primary);
      border-width: 2px;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }
    .input-field:disabled {
      background-color: var(--color-gray-100);
      cursor: not-allowed;
      opacity: 0.6;
    }
    .input-field::placeholder {
      color: var(--color-text-disabled);
    }
  `;
  if (!document.getElementById('input-styles')) {
    styleSheet.id = 'input-styles';
    document.head.appendChild(styleSheet);
  }
}

export default Input;
