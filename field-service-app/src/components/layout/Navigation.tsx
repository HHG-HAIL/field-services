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
}

const Navigation: React.FC<NavigationProps> = ({ userRole }) => {
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
          className="bg-white p-2 rounded-md shadow-md"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 via-indigo-900 to-primary-900 text-white transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 shadow-2xl`}>
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-primary-800 to-secondary-800 border-b border-primary-700 shadow-lg">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Field Service</h1>
        </div>
        
        <div className="mt-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white border-r-4 border-emerald-400 shadow-lg transform scale-105'
                      : 'text-gray-300 hover:bg-gradient-to-r hover:from-primary-700/50 hover:to-secondary-700/50 hover:text-white hover:transform hover:scale-105'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-primary-700/50">
          <button className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-primary-700/50 hover:to-secondary-700/50 rounded-md transition-all duration-200 hover:transform hover:scale-105">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </button>
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