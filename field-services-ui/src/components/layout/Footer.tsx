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
        <p style={styles.text}>
          © {currentYear} {config.appName} - Version {config.appVersion}
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #e0e0e0',
    padding: '1.5rem 0',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    textAlign: 'center' as const,
  },
  text: {
    margin: 0,
    color: '#666',
    fontSize: '0.875rem',
  },
};

export default Footer;
