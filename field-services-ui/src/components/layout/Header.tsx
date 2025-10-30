/**
 * Header Component
 * Main application header with navigation
 */

import config from '../../config/env';

export const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.title}>{config.appName}</h1>
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
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'opacity 0.2s',
  },
};

export default Header;
