import React from 'react';
import { WorkOrder } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { MapPin, Clock, User, Calendar, Edit, UserX } from 'lucide-react';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onStatusChange?: (workOrderId: string, newStatus: WorkOrder['status']) => void;
  onAssignTechnician?: (workOrderId: string) => void;
  onUnassignTechnician?: (workOrderId: string) => void;
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
  onChangeTechnician?: (workOrder: WorkOrder) => void;
  showActions?: boolean;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ 
  workOrder, 
  onStatusChange, 
  onAssignTechnician, 
  onUnassignTechnician,
  onEditWorkOrder,
  onChangeTechnician,
  showActions = true 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusActions = () => {
    switch (workOrder.status) {
      case 'assigned':
        return [
          { label: 'Start Work', status: 'in-progress' as const, variant: 'primary' as const },
          { label: 'Cancel', status: 'cancelled' as const, variant: 'danger' as const }
        ];
      case 'in-progress':
        return [
          { label: 'Complete', status: 'completed' as const, variant: 'success' as const }
        ];
      default:
        return [];
    }
  };

  return (
    <Card className="group transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10">
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 truncate transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-300">
              {workOrder.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {workOrder.description}
            </p>
          </div>
          <div className="flex flex-col space-y-2 ml-4">
            <StatusBadge status={workOrder.status} />
            <PriorityBadge priority={workOrder.priority} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
              <User className="h-4 w-4" />
            </span>
            <span className="truncate">
              {workOrder.technicianName || 'Unassigned'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600 dark:bg-secondary-500/10 dark:text-secondary-300">
              <Calendar className="h-4 w-4" />
            </span>
            <span>{formatDate(workOrder.scheduledDate)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="truncate">{workOrder.customerName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Clock className="h-4 w-4" />
            </span>
            <span>{formatDuration(workOrder.estimatedDuration)}</span>
          </div>
        </div>

        <div className="rounded-lg bg-slate-100/70 p-2 text-xs text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
          <div className="truncate">{workOrder.location.address}</div>
        </div>

        {showActions && (
          <div className="flex flex-wrap gap-2 border-t border-slate-200/70 pt-4 dark:border-slate-700/60">
            {/* Edit Work Order */}
            {onEditWorkOrder && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEditWorkOrder(workOrder)}
                className="hover:shadow-lg transition-all duration-200"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}

            {/* Change Technician */}
            {onChangeTechnician && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onChangeTechnician(workOrder)}
                className="hover:shadow-lg transition-all duration-200"
              >
                <UserX className="h-4 w-4 mr-1" />
                {workOrder.technicianId ? 'Change Technician' : 'Assign Technician'}
              </Button>
            )}
            
            {/* Unassign technician button */}
            {workOrder.technicianId && onUnassignTechnician && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onUnassignTechnician(workOrder.id)}
                className="hover:shadow-lg transition-all duration-200"
              >
                <UserX className="h-4 w-4 mr-1" />
                Unassign
              </Button>
            )}
            
            {/* Legacy assign technician button for backward compatibility */}
            {!workOrder.technicianId && onAssignTechnician && !onChangeTechnician && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onAssignTechnician(workOrder.id)}
                className="hover:shadow-lg transition-all duration-200"
              >
                Assign Technician
              </Button>
            )}
            
            {getStatusActions().map((action) => (
              <Button
                key={action.label}
                size="sm"
                variant={action.variant}
                onClick={() => onStatusChange?.(workOrder.id, action.status)}
                className="hover:shadow-lg transition-all duration-200"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default WorkOrderCard;
