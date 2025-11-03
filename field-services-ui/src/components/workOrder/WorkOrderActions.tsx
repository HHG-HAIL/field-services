/**
 * WorkOrderActions Component
 * Action buttons for work order operations (assign, update status)
 */

import { useState } from 'react';
import type { WorkOrder, WorkOrderStatus } from '../../types/workOrder';
import { WorkOrderStatus as WorkOrderStatusEnum } from '../../types/workOrder';
import Button from '../common/Button';
import Select from '../common/Select';
import WorkOrderAssignmentModal from './WorkOrderAssignmentModal';

interface ValidationError {
  message: string;
}

interface WorkOrderActionsProps {
  workOrder: WorkOrder;
  onAssign: (technicianId: number, technicianName: string) => Promise<void>;
  onStatusUpdate: (status: WorkOrderStatus) => Promise<void>;
  isLoading?: boolean;
}

export const WorkOrderActions = ({
  workOrder,
  onAssign,
  onStatusUpdate,
  isLoading = false,
}: WorkOrderActionsProps) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<WorkOrderStatus>(workOrder.status);
  const [statusError, setStatusError] = useState<ValidationError | null>(null);

  const containerStyle = {
    display: 'flex',
    gap: '1rem',
    flexDirection: 'column' as const,
    marginTop: '1.5rem',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  };

  const formStyle = {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '0.5rem',
  };

  const errorStyle = {
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    borderRadius: '4px',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    color: '#c62828',
    fontSize: '0.875rem',
  };

  const statusOptions = [
    { value: WorkOrderStatusEnum.PENDING, label: 'Pending' },
    { value: WorkOrderStatusEnum.ASSIGNED, label: 'Assigned' },
    { value: WorkOrderStatusEnum.IN_PROGRESS, label: 'In Progress' },
    { value: WorkOrderStatusEnum.ON_HOLD, label: 'On Hold' },
    { value: WorkOrderStatusEnum.COMPLETED, label: 'Completed' },
    { value: WorkOrderStatusEnum.CANCELLED, label: 'Cancelled' },
  ];

  const handleStatusSubmit = async () => {
    setStatusError(null);
    
    if (selectedStatus === workOrder.status) {
      setStatusError({ message: 'Status is already set to this value' });
      return;
    }

    await onStatusUpdate(selectedStatus);
    setShowStatusForm(false);
    setStatusError(null);
  };

  const canAssign =
    workOrder.status !== WorkOrderStatusEnum.COMPLETED &&
    workOrder.status !== WorkOrderStatusEnum.CANCELLED;
  const canUpdateStatus = true;

  return (
    <div style={containerStyle}>
      <div style={buttonGroupStyle}>
        {canAssign && (
          <Button
            variant="primary"
            onClick={() => setShowAssignModal(true)}
            disabled={isLoading}
          >
            {workOrder.assignedTechnicianId ? 'Reassign Technician' : 'Assign Technician'}
          </Button>
        )}
        {canUpdateStatus && (
          <Button
            variant="secondary"
            onClick={() => setShowStatusForm(!showStatusForm)}
            disabled={isLoading}
          >
            Update Status
          </Button>
        )}
      </div>

      <WorkOrderAssignmentModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        workOrder={workOrder}
        onAssign={onAssign}
        isLoading={isLoading}
      />

      {showStatusForm && (
        <div style={formStyle}>
          <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Update Status</h4>
          {statusError && (
            <div style={errorStyle}>
              <strong>Error:</strong> {statusError.message}
            </div>
          )}
          <Select
            name="status"
            label="New Status"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as WorkOrderStatus);
              setStatusError(null);
            }}
            options={statusOptions}
            disabled={isLoading}
            fullWidth
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button onClick={handleStatusSubmit} disabled={isLoading} variant="primary">
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
            <Button
              onClick={() => {
                setShowStatusForm(false);
                setStatusError(null);
              }}
              disabled={isLoading}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrderActions;
