import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalizedStatus = status?.toLowerCase()?.trim();

  const styles = (() => {
    switch (normalizedStatus) {
      case 'pending':
        return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:border-slate-700';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-400/40';
      case 'in-progress':
      case 'inprogress':
      case 'in_progress':
        return 'bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-400/40';
      case 'assigned':
        return 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-400/40';
      case 'cancelled':
        return 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-400/40';
      case 'available':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-400/40';
      case 'busy':
        return 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-500/15 dark:text-orange-200 dark:border-orange-400/40';
      case 'offline':
        return 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-900/70 dark:text-slate-300 dark:border-slate-800';
      case 'on-break':
      case 'onbreak':
      case 'on_break':
        return 'bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-500/15 dark:text-violet-200 dark:border-violet-400/40';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:border-slate-700';
    }
  })();

  const icon = (() => {
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
        return '✖️';
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
        return '•';
    }
  })();

  const label = (() => {
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
  })();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${styles} ${className}`}
    >
      <span className="text-sm leading-none">{icon}</span>
      {label}
    </span>
  );
};

export default StatusBadge;

