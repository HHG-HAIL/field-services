import React from 'react';

interface StatusBadgeProps {
  status: string; // Allow any string to handle unknown values gracefully
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusStyles = () => {
    const normalizedStatus = status?.toLowerCase()?.trim();
    switch (normalizedStatus) {
      case 'pending':
        return 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-300 shadow-md ring-1 ring-slate-200';
      case 'completed':
        return 'bg-gradient-to-r from-emerald-100 via-green-100 to-emerald-200 text-emerald-800 border-emerald-300 shadow-md ring-1 ring-emerald-200';
      case 'in-progress':
      case 'inprogress':
      case 'in_progress':
        return 'bg-gradient-to-r from-blue-100 via-sky-100 to-blue-200 text-blue-800 border-blue-300 shadow-md ring-1 ring-blue-200';
      case 'assigned':
        return 'bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 text-amber-800 border-amber-300 shadow-md ring-1 ring-amber-200';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-100 via-rose-100 to-red-200 text-red-800 border-red-300 shadow-md ring-1 ring-red-200';
      case 'available':
        return 'bg-gradient-to-r from-green-100 via-emerald-100 to-green-200 text-green-800 border-green-300 shadow-md ring-1 ring-green-200';
      case 'busy':
        return 'bg-gradient-to-r from-orange-100 via-amber-100 to-orange-200 text-orange-800 border-orange-300 shadow-md ring-1 ring-orange-200';
      case 'offline':
        return 'bg-gradient-to-r from-gray-100 via-slate-100 to-gray-200 text-gray-700 border-gray-300 shadow-md ring-1 ring-gray-200';
      case 'on-break':
      case 'onbreak':
      case 'on_break':
        return 'bg-gradient-to-r from-purple-100 via-violet-100 to-purple-200 text-purple-800 border-purple-300 shadow-md ring-1 ring-purple-200';
      default:
        return 'bg-gradient-to-r from-gray-100 via-slate-100 to-gray-200 text-gray-700 border-gray-300 shadow-md ring-1 ring-gray-200';
    }
  };

  const getStatusIcon = () => {
    const normalizedStatus = status?.toLowerCase()?.trim();
    switch (normalizedStatus) {
      case 'pending':
        return '⏳';
      case 'completed':
        return '✅';
      case 'in-progress':
      case 'inprogress':
      case 'in_progress':
        return '🔄';
      case 'assigned':
        return '📋';
      case 'cancelled':
        return '❌';
      case 'available':
        return '🟢';
      case 'busy':
        return '🟡';
      case 'offline':
        return '⚫';
      case 'on-break':
      case 'onbreak':
      case 'on_break':
        return '☕';
      default:
        return '❓';
    }
  };

  const getStatusLabel = () => {
    const normalizedStatus = status?.toLowerCase()?.trim();
    switch (normalizedStatus) {
      case 'pending':
        return 'PENDING';
      case 'completed':
        return 'COMPLETED';
      case 'in-progress':
      case 'inprogress':
      case 'in_progress':
        return 'IN PROGRESS';
      case 'assigned':
        return 'ASSIGNED';
      case 'cancelled':
        return 'CANCELLED';
      case 'available':
        return 'AVAILABLE';
      case 'busy':
        return 'BUSY';
      case 'offline':
        return 'OFFLINE';
      case 'on-break':
      case 'onbreak':
      case 'on_break':
        return 'ON BREAK';
      default:
        return status?.toUpperCase() || 'UNKNOWN';
    }
  };
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyles()} transform hover:scale-105 transition-all duration-200 ${className}`}>
      <span className="mr-1.5 text-sm">{getStatusIcon()}</span>
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;