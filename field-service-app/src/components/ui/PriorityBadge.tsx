import React from 'react';

interface PriorityBadgeProps {
  priority: string; // Allow any string to handle unknown values gracefully
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const getPriorityStyles = () => {
    const normalizedPriority = priority?.toLowerCase();
    switch (normalizedPriority) {
      case 'urgent':
        return 'bg-gradient-to-r from-red-100 via-rose-100 to-red-200 text-red-800 border-2 border-red-300 shadow-lg ring-2 ring-red-200 animate-pulse';
      case 'high':
        return 'bg-gradient-to-r from-orange-100 via-amber-100 to-orange-200 text-orange-800 border-2 border-orange-300 shadow-lg ring-1 ring-orange-200';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-200 text-yellow-800 border-2 border-yellow-300 shadow-md ring-1 ring-yellow-200';
      case 'low':
        return 'bg-gradient-to-r from-green-100 via-emerald-100 to-green-200 text-green-800 border-2 border-green-300 shadow-md ring-1 ring-green-200';
      default:
        return 'bg-gradient-to-r from-gray-100 via-slate-100 to-gray-200 text-gray-800 border-2 border-gray-300 shadow-md ring-1 ring-gray-200';
    }
  };

  const getPriorityIcon = () => {
    const normalizedPriority = priority?.toLowerCase();
    switch (normalizedPriority) {
      case 'urgent':
        return '🚨';
      case 'high':
        return '🔥';
      case 'medium':
        return '⚡';
      case 'low':
        return '🌿';
      default:
        return '❓';
    }
  };

  const getPriorityLevel = () => {
    const normalizedPriority = priority?.toLowerCase();
    switch (normalizedPriority) {
      case 'urgent':
        return 'URGENT';
      case 'high':
        return 'HIGH';
      case 'medium':
        return 'MEDIUM';
      case 'low':
        return 'LOW';
      default:
        return priority?.toUpperCase() || 'UNKNOWN';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transform hover:scale-105 transition-all duration-200 ${getPriorityStyles()} ${className}`}>
      <span className="mr-1.5 text-sm">{getPriorityIcon()}</span>
      {getPriorityLevel()}
    </span>
  );
};

export default PriorityBadge;