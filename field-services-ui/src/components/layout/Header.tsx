/**
 * Header Component
 * Main application header with navigation
 */

import { useState } from 'react';
import config from '../../config/env';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <div style={styles.logoIcon}>⚙️</div>
          <h1 style={styles.title}>{config.appName}</h1>
        </div>

        {/* Mobile menu button */}
        <button
          style={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span style={styles.hamburger}>☰</span>
        </button>

        {/* Desktop Navigation */}
        <nav style={styles.nav}>
          <a href="/" style={styles.link}>
            Home
          </a>
          <a href="/work-orders" style={styles.link}>
            Work Orders
          </a>
          <a href="/resources" style={styles.link}>
            Resources
          </a>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav style={styles.mobileNav}>
            <a href="/" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
              Home
            </a>
            <a
              href="/work-orders"
              style={styles.mobileLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Work Orders
            </a>
            <a
              href="/resources"
              style={styles.mobileLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
    color: 'var(--color-text-inverse)',
    boxShadow: 'var(--shadow-md)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: 'var(--spacing-md) var(--spacing-lg)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative' as const,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  },
  logoIcon: {
    fontSize: 'var(--font-size-2xl)',
    lineHeight: 1,
  },
  title: {
    margin: 0,
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-inverse)',
  },
  nav: {
    display: 'flex',
    gap: 'var(--spacing-xl)',
  },
  link: {
    color: 'var(--color-text-inverse)',
    textDecoration: 'none',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-medium)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    position: 'relative' as const,
  } as React.CSSProperties,
  mobileMenuButton: {
    display: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--color-text-inverse)',
    fontSize: 'var(--font-size-2xl)',
    cursor: 'pointer',
    padding: 'var(--spacing-xs)',
  },
  hamburger: {
    display: 'block',
  },
  mobileNav: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-primary)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: 'var(--spacing-md)',
    animation: 'slideDown 0.2s ease-out',
  },
  mobileLink: {
    color: 'var(--color-text-inverse)',
    textDecoration: 'none',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-medium)',
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--radius-md)',
    transition: 'background-color var(--transition-fast)',
  } as React.CSSProperties,
};

// Add media query styles using a style tag
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @media (max-width: 768px) {
      header nav:first-of-type {
        display: none !important;
      }
      header button[aria-label="Toggle menu"] {
        display: block !important;
      }
    }
    @media (min-width: 769px) {
      header nav:last-of-type {
        display: none !important;
      }
    }
    header a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    header a:focus-visible {
      outline: 2px solid var(--color-text-inverse);
      outline-offset: 2px;
    }
    header a:active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `;
  if (!document.getElementById('header-styles')) {
    styleSheet.id = 'header-styles';
    document.head.appendChild(styleSheet);
  }
}

export default Header;
