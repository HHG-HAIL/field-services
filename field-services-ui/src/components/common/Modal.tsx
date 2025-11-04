/**
 * Modal Component
 * Reusable modal dialog for overlays
 */

import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
  showCloseButton?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = '600px',
  showCloseButton = true,
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--color-overlay)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 'var(--z-modal)',
    padding: 'var(--spacing-md)',
    backdropFilter: 'blur(4px)',
    animation: 'fadeIn 0.2s ease-out',
  };

  const modalStyle = {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xl)',
    width,
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    animation: 'slideDown 0.3s ease-out',
  };

  const headerStyle = {
    padding: 'var(--spacing-lg)',
    borderBottom: `1px solid var(--color-border-light)`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--color-gray-50)',
  };

  const titleStyle = {
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
    margin: 0,
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: 'var(--font-size-3xl)',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    padding: 'var(--spacing-xs)',
    lineHeight: 1,
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
  };

  const contentStyle = {
    padding: 'var(--spacing-lg)',
    overflow: 'auto',
    flex: 1,
  };

  return (
    <div
      style={overlayStyle}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 id="modal-title" style={titleStyle}>
            {title}
          </h2>
          {showCloseButton && (
            <button
              className="modal-close-button"
              style={closeButtonStyle}
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
};

// Add hover styles for close button
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .modal-close-button:hover {
      background-color: var(--color-gray-200) !important;
      color: var(--color-text-primary) !important;
    }
    .modal-close-button:active {
      background-color: var(--color-gray-300) !important;
    }
  `;
  if (!document.getElementById('modal-styles')) {
    styleSheet.id = 'modal-styles';
    document.head.appendChild(styleSheet);
  }
}

export default Modal;
