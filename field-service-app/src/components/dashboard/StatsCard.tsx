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
        return 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 shadow-emerald-200/50 dark:from-emerald-500/20 dark:via-emerald-500/10 dark:to-emerald-400/10 dark:text-emerald-300 dark:shadow-emerald-500/20';
      case 'yellow':
        return 'bg-gradient-to-br from-warning-100 to-warning-200 text-warning-700 shadow-warning-200/50 dark:from-warning-500/20 dark:via-warning-500/10 dark:to-warning-400/10 dark:text-warning-200 dark:shadow-warning-500/20';
      case 'red':
        return 'bg-gradient-to-br from-danger-100 to-danger-200 text-danger-700 shadow-danger-200/50 dark:from-danger-500/20 dark:via-danger-500/10 dark:to-danger-400/10 dark:text-danger-300 dark:shadow-danger-500/20';
      case 'gray':
        return 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 shadow-gray-200/50 dark:from-slate-500/20 dark:via-slate-700/10 dark:to-slate-800/20 dark:text-slate-200 dark:shadow-slate-900/20';
      default:
        return 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 shadow-primary-200/50 dark:from-primary-500/20 dark:via-primary-500/10 dark:to-primary-400/10 dark:text-primary-200 dark:shadow-primary-500/20';
    }
  };

  const getChangeIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-danger-600 dark:text-danger-400" />;
      default:
        return <Minus className="h-4 w-4 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getChangeColor = () => {
    if (!change) return '';
    
    switch (change.type) {
      case 'increase':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'decrease':
        return 'text-danger-600 dark:text-danger-400';
      default:
        return 'text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <Card
      padding="sm"
      className="hover:shadow-2xl hover:shadow-primary-500/20 transition-transform duration-300 hover:scale-[1.02] dark:hover:shadow-primary-500/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {change && (
            <div className="mt-2 flex items-center space-x-1">
              {getChangeIcon()}
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {Math.abs(change.value)}%
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">from last week</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${getColorClasses()} shadow-lg shadow-current/20 transition-transform hover:scale-110`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
