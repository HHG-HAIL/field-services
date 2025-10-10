import React from 'react';
import { User } from '../../types';
import { Bell, Search } from 'lucide-react';
import BackendStatus from '../ui/BackendStatus';

interface HeaderProps {
  user: User;
  isBackendConnected?: boolean;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, isBackendConnected = false, isLoading = false }) => {
  return (
    <header className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 shadow-lg border-b border-primary-300 lg:ml-64">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="max-w-md w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white/70" />
                </div>
                <input
                  type="text"
                  placeholder="Search work orders, technicians..."
                  className="block w-full pl-10 pr-3 py-2 border border-white/30 rounded-lg leading-5 bg-white/10 backdrop-blur-sm placeholder-white/60 text-white focus:outline-none focus:placeholder-white/80 focus:ring-2 focus:ring-white/50 focus:border-white/50 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <BackendStatus isConnected={isBackendConnected} loading={isLoading} />
            
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm">
              <Bell className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-white">{user.name}</span>
                <span className="text-xs text-white/80 capitalize">{user.role}</span>
              </div>
              <div className="h-10 w-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg ring-2 ring-white/30">
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