/**
 * Footer Component
 * Application footer
 */

import config from '../../config/env';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>About</h3>
            <p style={styles.text}>{config.appName}</p>
            <p style={styles.textSmall}>Professional field services management</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Quick Links</h3>
            <nav style={styles.linkList}>
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
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Information</h3>
            <p style={styles.textSmall}>Version {config.appVersion}</p>
            <p style={styles.textSmall}>© {currentYear} All rights reserved</p>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.copyright}>
          <p style={styles.copyrightText}>
            Built with ❤️ for efficient field service operations
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--color-gray-900)',
    color: 'var(--color-text-inverse)',
    marginTop: 'auto',
    borderTop: '4px solid var(--color-primary)',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: 'var(--spacing-xl) var(--spacing-lg)',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--spacing-xl)',
    marginBottom: 'var(--spacing-xl)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-sm)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-inverse)',
    marginBottom: 'var(--spacing-sm)',
  },
  text: {
    margin: 0,
    color: 'var(--color-gray-300)',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-relaxed)',
  },
  textSmall: {
    margin: 0,
    color: 'var(--color-gray-400)',
    fontSize: 'var(--font-size-xs)',
    lineHeight: 'var(--line-height-relaxed)',
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-xs)',
  },
  link: {
    color: 'var(--color-gray-300)',
    textDecoration: 'none',
    fontSize: 'var(--font-size-sm)',
    transition: 'color var(--transition-fast)',
    width: 'fit-content',
  } as React.CSSProperties,
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-gray-700)',
    margin: 'var(--spacing-xl) 0',
  },
  copyright: {
    textAlign: 'center' as const,
  },
  copyrightText: {
    margin: 0,
    color: 'var(--color-gray-400)',
    fontSize: 'var(--font-size-xs)',
  },
};

// Add hover styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    footer a:hover {
      color: var(--color-primary-light) !important;
      text-decoration: underline;
    }
  `;
  if (!document.getElementById('footer-styles')) {
    styleSheet.id = 'footer-styles';
    document.head.appendChild(styleSheet);
  }
}

export default Footer;
