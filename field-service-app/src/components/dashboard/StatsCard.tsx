import React from 'react';
import Card from '../ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon, color = 'blue' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 shadow-emerald-200/50';
      case 'yellow':
        return 'bg-gradient-to-br from-warning-100 to-warning-200 text-warning-700 shadow-warning-200/50';
      case 'red':
        return 'bg-gradient-to-br from-danger-100 to-danger-200 text-danger-700 shadow-danger-200/50';
      case 'gray':
        return 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 shadow-gray-200/50';
      default:
        return 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 shadow-primary-200/50';
    }
  };

  const getChangeIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeColor = () => {
    if (!change) return '';
    
    switch (change.type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card padding="sm" className="hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2 space-x-1">
              {getChangeIcon()}
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {Math.abs(change.value)}%
              </span>
              <span className="text-sm text-gray-500">from last week</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${getColorClasses()} shadow-lg transform transition-transform hover:scale-110`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;