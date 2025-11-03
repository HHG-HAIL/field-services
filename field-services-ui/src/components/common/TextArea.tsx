/**
 * TextArea Component
 * Reusable textarea field with label and error handling
 */

import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const TextArea = ({ label, error, fullWidth = false, ...props }: TextAreaProps) => {
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

  const textareaStyle = {
    width: fullWidth ? '100%' : 'auto',
    padding: '0.5rem',
    fontSize: '1rem',
    border: error ? '1px solid #d32f2f' : '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
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
      <textarea id={inputId} style={textareaStyle} {...props} />
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
};

export default TextArea;
