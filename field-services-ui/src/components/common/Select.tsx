/**
 * Select Component
 * Reusable select dropdown with label and error handling
 */

import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
}

export const Select = ({
  label,
  error,
  fullWidth = false,
  options,
  placeholder,
  helperText,
  className = '',
  ...props
}: SelectProps) => {
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

  const selectWrapperStyle = {
    position: 'relative' as const,
    display: 'inline-block',
    width: fullWidth ? '100%' : 'auto',
  };

  const selectStyle = {
    width: '100%',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    paddingRight: 'var(--spacing-xl)',
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
    cursor: 'pointer',
    lineHeight: 'var(--line-height-normal)',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right var(--spacing-sm) center',
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
      <div style={selectWrapperStyle}>
        <select
          id={inputId}
          className={`select-field ${hasError ? 'select-error' : ''} ${className}`}
          style={selectStyle}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
    .select-field:not(.select-error):hover {
      border-color: var(--color-border-dark);
    }
    .select-field:not(.select-error):focus {
      border-color: var(--color-primary);
      border-width: 2px;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }
    .select-field:disabled {
      background-color: var(--color-gray-100);
      cursor: not-allowed;
      opacity: 0.6;
    }
  `;
  if (!document.getElementById('select-styles')) {
    styleSheet.id = 'select-styles';
    document.head.appendChild(styleSheet);
  }
}

export default Select;
