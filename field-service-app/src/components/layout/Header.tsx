import React from 'react';
import { User } from '../../types';
import { Bell, Search, Settings, Sun, Moon } from 'lucide-react';
import BackendStatus from '../ui/BackendStatus';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  user: User;
  isBackendConnected?: boolean;
  isLoading?: boolean;
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  isBackendConnected = false,
  isLoading = false,
  onOpenSettings,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <header className="lg:ml-64 sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-900/5 transition-colors duration-500 dark:border-slate-800/60 dark:bg-slate-950/80 dark:shadow-slate-950/30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center flex-1">
            <div className="max-w-md w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search work orders, technicians..."
                  className="block w-full rounded-xl border border-slate-200/70 bg-white/70 py-2 pl-10 pr-3 text-sm text-slate-700 placeholder-slate-400 shadow-inner shadow-slate-900/5 transition focus:border-primary-400 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-200/80 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-primary-500 dark:focus:ring-primary-500/40"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <BackendStatus isConnected={isBackendConnected} loading={isLoading} />
            
            <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-primary-500/40">
              <Bell className="h-5 w-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-primary-500/40"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-primary-500/40"
                aria-label="Open settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-100">{user.name}</span>
                <span className="text-xs capitalize text-slate-400 dark:text-slate-400">{user.role}</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-sm font-medium text-white shadow-lg shadow-primary-500/30 ring-2 ring-white/50 dark:ring-slate-800/70">
                {user.avatar || user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
