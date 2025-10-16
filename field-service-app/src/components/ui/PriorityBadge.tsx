import React from 'react';

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const normalizedPriority = priority?.toLowerCase();

  const styles = (() => {
    switch (normalizedPriority) {
      case 'urgent':
        return 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-400/40';
      case 'high':
        return 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-400/40';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-200 dark:border-yellow-400/40';
      case 'low':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-400/40';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:border-slate-700';
    }
  })();

  const icon = (() => {
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
        return '•';
    }
  })();

  const label = (() => {
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

export default PriorityBadge;

