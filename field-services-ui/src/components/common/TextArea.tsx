/**
 * TextArea Component
 * Reusable textarea field with label and error handling
 */

import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

export const TextArea = ({
  label,
  error,
  fullWidth = false,
  helperText,
  className = '',
  ...props
}: TextAreaProps) => {
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

  const textareaStyle = {
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
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    minHeight: '100px',
    lineHeight: 'var(--line-height-relaxed)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
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
      <textarea
        id={inputId}
        className={`textarea-field ${hasError ? 'textarea-error' : ''} ${className}`}
        style={textareaStyle}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        {...props}
      />
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
    .textarea-field:not(.textarea-error):hover {
      border-color: var(--color-border-dark);
    }
    .textarea-field:not(.textarea-error):focus {
      border-color: var(--color-primary);
      border-width: 2px;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }
    .textarea-field:disabled {
      background-color: var(--color-gray-100);
      cursor: not-allowed;
      opacity: 0.6;
    }
    .textarea-field::placeholder {
      color: var(--color-text-disabled);
    }
  `;
  if (!document.getElementById('textarea-styles')) {
    styleSheet.id = 'textarea-styles';
    document.head.appendChild(styleSheet);
  }
}

export default TextArea;
