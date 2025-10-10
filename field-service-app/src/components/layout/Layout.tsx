import React from 'react';
import Navigation from './Navigation';
import Header from './Header';
import { User } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  isBackendConnected?: boolean;
  isLoading?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, user, isBackendConnected = false, isLoading = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation userRole={user.role} />
      <Header user={user} isBackendConnected={isBackendConnected} isLoading={isLoading} />
      
      <main className="lg:ml-64 pt-4">
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;