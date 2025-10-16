import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  MapPin, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Wrench,
  Home
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavigationProps {
  userRole: UserRole;
  onOpenSettings: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ userRole, onOpenSettings }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/', icon: Home }
    ];

    switch (userRole) {
      case 'dispatcher':
        return [
          ...baseItems,
          { name: 'Work Orders', href: '/work-orders', icon: Wrench },
          { name: 'Schedule', href: '/schedule', icon: Calendar },
          { name: 'Technicians', href: '/technicians', icon: Users },
          { name: 'Map View', href: '/map', icon: MapPin }
        ];
      
      case 'technician':
        return [
          ...baseItems,
          { name: 'My Jobs', href: '/my-jobs', icon: Wrench },
          { name: 'Schedule', href: '/my-schedule', icon: Calendar },
          { name: 'Map', href: '/map', icon: MapPin }
        ];
      
      case 'manager':
        return [
          ...baseItems,
          { name: 'Work Orders', href: '/work-orders', icon: Wrench },
          { name: 'Analytics', href: '/analytics', icon: BarChart3 },
          { name: 'Technicians', href: '/technicians', icon: Users },
          { name: 'Reports', href: '/reports', icon: BarChart3 }
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur-md transition hover:shadow-xl hover:text-primary-600 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:text-primary-300"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-r-3xl border-r border-slate-200/70 bg-white/85 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80 dark:shadow-slate-950/40">
          <div className="flex items-center justify-center h-20 border-b border-slate-200/70 bg-white/70 dark:border-slate-800/60 dark:bg-slate-950/60">
            <h1 className="text-lg font-semibold tracking-wide text-slate-800 dark:text-slate-100">
              Field Service Control
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto py-6 custom-scrollbar px-3">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-500/15 text-primary-700 shadow-[0_18px_36px_-18px_rgba(14,165,233,0.8)] ring-1 ring-primary-500/40 dark:bg-primary-500/10 dark:text-primary-200'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-primary-300'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200/70 p-4 dark:border-slate-800/60">
            <button
              onClick={onOpenSettings}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-primary-500/15 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:text-slate-300 dark:hover:bg-primary-500/10 dark:hover:text-primary-200"
            >
              <Settings className="h-5 w-5" />
              Workspace settings
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
