import React, { useState } from 'react';
import Navigation from './Navigation';
import Header from './Header';
import SettingsPanel from '../settings/SettingsPanel';
import { User } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  isBackendConnected?: boolean;
  isLoading?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  isBackendConnected = false,
  isLoading = false,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app-gradient text-slate-900 transition-colors duration-500 dark:text-slate-100">
      <Navigation userRole={user.role} onOpenSettings={() => setIsSettingsOpen(true)} />
      <Header
        user={user}
        isBackendConnected={isBackendConnected}
        isLoading={isLoading}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="lg:ml-64 pt-4 transition-colors duration-500">
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default Layout;
