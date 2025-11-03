/**
 * Layout Component
 * Main layout wrapper with header and footer
 */

import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={styles.layout}>
      <Header />
      <main style={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
};

export default Layout;
