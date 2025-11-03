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
}

export const Select = ({
  label,
  error,
  fullWidth = false,
  options,
  placeholder,
  ...props
}: SelectProps) => {
  const inputId = props.id || props.name;

  const containerStyle = {
    marginBottom: '1rem',
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: '#333',
    fontSize: '0.875rem',
  };

  const selectStyle = {
    width: fullWidth ? '100%' : 'auto',
    padding: '0.5rem',
    fontSize: '1rem',
    border: error ? '1px solid #d32f2f' : '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
    backgroundColor: 'white',
    cursor: 'pointer',
  };

  const errorStyle = {
    marginTop: '0.25rem',
    fontSize: '0.75rem',
    color: '#d32f2f',
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
          {props.required && <span style={{ color: '#d32f2f' }}> *</span>}
        </label>
      )}
      <select id={inputId} style={selectStyle} {...props}>
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
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
};

export default Select;
