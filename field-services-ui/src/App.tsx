/**
 * App Component
 * Main application component
 */

import Layout from './components/layout/Layout';
import Button from './components/common/Button';
import config from './config/env';
import './App.css';

function App() {
  const handleClick = () => {
    alert('Button clicked! Ready to integrate with backend services.');
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome to Field Services Management</h1>
        <p style={styles.subtitle}>
          A modern React application for managing field service operations
        </p>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>System Configuration</h2>
          <div style={styles.configList}>
            <div style={styles.configItem}>
              <strong>API Base URL:</strong> {config.apiBaseUrl}
            </div>
            <div style={styles.configItem}>
              <strong>Application Version:</strong> {config.appVersion}
            </div>
            <div style={styles.configItem}>
              <strong>Debug Mode:</strong> {config.enableDebug ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <Button variant="primary" onClick={handleClick}>
            Get Started
          </Button>
          <Button variant="secondary" onClick={() => console.log('Secondary action')}>
            Learn More
          </Button>
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>Ready for Development</h3>
          <ul style={styles.featureList}>
            <li>✓ React 19 with TypeScript</li>
            <li>✓ Vite for fast development and building</li>
            <li>✓ ESLint configured for code quality</li>
            <li>✓ Prettier for consistent code formatting</li>
            <li>✓ Environment-based configuration</li>
            <li>✓ API service layer for backend integration</li>
            <li>✓ Custom hooks for state management</li>
            <li>✓ Reusable components structure</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    textAlign: 'center' as const,
  },
  heading: {
    fontSize: '2.5rem',
    color: '#1976d2',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#666',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'left' as const,
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  configList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  configItem: {
    fontSize: '1rem',
    color: '#555',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    border: '1px solid #90caf9',
    borderRadius: '8px',
    padding: '1.5rem',
    textAlign: 'left' as const,
  },
  infoTitle: {
    fontSize: '1.25rem',
    color: '#1565c0',
    marginBottom: '1rem',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
};

export default App;
