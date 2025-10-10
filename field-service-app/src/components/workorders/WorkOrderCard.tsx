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
    <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate group-hover:from-primary-600 group-hover:to-secondary-600 transition-all duration-300">
              {workOrder.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {workOrder.description}
            </p>
          </div>
          <div className="flex flex-col space-y-2 ml-4">
            <StatusBadge status={workOrder.status} />
            <PriorityBadge priority={workOrder.priority} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-1.5 rounded-lg mr-2">
              <User className="h-4 w-4 text-primary-600" />
            </div>
            <span className="truncate">
              {workOrder.technicianName || 'Unassigned'}
            </span>
          </div>
          
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 p-1.5 rounded-lg mr-2">
              <Calendar className="h-4 w-4 text-secondary-600" />
            </div>
            <span>{formatDate(workOrder.scheduledDate)}</span>
          </div>
          
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-1.5 rounded-lg mr-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="truncate">{workOrder.customerName}</span>
          </div>
          
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-1.5 rounded-lg mr-2">
              <Clock className="h-4 w-4 text-indigo-600" />
            </div>
            <span>{formatDuration(workOrder.estimatedDuration)}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-2">
          <div className="truncate">{workOrder.location.address}</div>
        </div>

        {showActions && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gradient-to-r from-gray-200 to-gray-100">
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