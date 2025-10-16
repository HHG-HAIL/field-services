import React, { useState } from 'react';
import { Technician } from '../../types';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import { Phone, Mail, MapPin, Wrench, Star } from 'lucide-react';

interface TechnicianCardProps {
  technician: Technician;
  onAssignToWorkOrder?: (technicianId: string) => void;
  onUpdateStatus?: (technicianId: string, status: Technician['status']) => void;
  showActions?: boolean;
  workOrderCount?: number;
}

const skillColors: Record<string, string> = {
  HVAC: 'bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-400/40',
  Electrical: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-400/40',
  Plumbing: 'bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-200 dark:border-cyan-400/40',
  'Security Systems': 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/15 dark:text-purple-200 dark:border-purple-400/40',
  Mechanical: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-400/40',
  'General Maintenance': 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:border-slate-700',
  'Network Installation': 'bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-200 dark:border-indigo-400/40',
  'Hardware Repair': 'bg-primary-100 text-primary-700 border border-primary-200 dark:bg-primary-500/15 dark:text-primary-200 dark:border-primary-400/40',
};

const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  onAssignToWorkOrder,
  onUpdateStatus,
  showActions = true,
  workOrderCount = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const avatarInitials = technician.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const activeJobs = technician.activeWorkOrders?.length ?? workOrderCount;

  const renderSkillPills = () =>
    (technician.skills || []).slice(0, isExpanded ? undefined : 3).map((skill) => (
      <span
        key={skill}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition-colors ${skillColors[skill] || skillColors['General Maintenance']}`}
      >
        {skill}
      </span>
    ));

  return (
    <Card className="transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-lg font-semibold text-white shadow-lg shadow-primary-500/30">
              {avatarInitials}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[0.5rem] text-white dark:border-slate-900">
                {technician.status === 'available' ? '●' : technician.status === 'busy' ? '◐' : '○'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {technician.name}
              </h3>
              <StatusBadge status={technician.status} className="mt-1" />
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-semibold text-primary-600 dark:text-primary-300">{activeJobs}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Active jobs</div>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Wrench className="mr-2 h-4 w-4 text-primary-500" />
                Skills ({(technician.skills || []).length})
              </h4>
              {(technician.skills || []).length > 3 && (
                <button
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="text-xs font-medium text-primary-600 transition hover:text-primary-500 dark:text-primary-300 dark:hover:text-primary-200"
                >
                  {isExpanded ? 'Show less' : 'Show all'}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {renderSkillPills()}
              {(technician.skills || []).length > 3 && !isExpanded && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-slate-800/60 dark:text-slate-300">
                  +{(technician.skills || []).length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300">
                <Star className="h-4 w-4 text-primary-500" />
                Experience
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {Math.floor(Math.random() * 5) + 3} years
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300">
                <Wrench className="h-4 w-4 text-emerald-500" />
                Rating
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {(4.2 + Math.random() * 0.8).toFixed(1)}★
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-2 border-t border-slate-200 pt-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span>{technician.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span>{technician.phone}</span>
            </div>
            {technician.currentLocation && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>
                  {typeof technician.currentLocation === 'string'
                    ? technician.currentLocation
                    : technician.currentLocation.lat && technician.currentLocation.lng
                    ? `${technician.currentLocation.lat.toFixed(4)}, ${technician.currentLocation.lng.toFixed(4)}`
                    : 'Unknown location'}
                </span>
              </div>
            )}
          </div>
        )}

        {showActions && (
          <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? 'Hide details' : 'View details'}
            </Button>

            {technician.status === 'available' && onAssignToWorkOrder && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onAssignToWorkOrder(technician.id)}
              >
                Assign to job
              </Button>
            )}

            {onUpdateStatus && (
              <div className="flex gap-2">
                {technician.status !== 'available' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onUpdateStatus(technician.id, 'available')}
                  >
                    Mark available
                  </Button>
                )}
                {technician.status !== 'offline' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onUpdateStatus(technician.id, 'offline')}
                  >
                    Set offline
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TechnicianCard;
