/**
 * WorkOrderActions Component
 * Action buttons for work order operations (assign, update status)
 */

import { useState } from 'react';
import type { WorkOrder, WorkOrderStatus } from '../../types/workOrder';
import { WorkOrderStatus as WorkOrderStatusEnum } from '../../types/workOrder';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

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
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [technicianId, setTechnicianId] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<WorkOrderStatus>(workOrder.status);

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

  const formRowStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-end',
    marginBottom: '0.5rem',
  };

  const statusOptions = [
    { value: WorkOrderStatusEnum.PENDING, label: 'Pending' },
    { value: WorkOrderStatusEnum.ASSIGNED, label: 'Assigned' },
    { value: WorkOrderStatusEnum.IN_PROGRESS, label: 'In Progress' },
    { value: WorkOrderStatusEnum.ON_HOLD, label: 'On Hold' },
    { value: WorkOrderStatusEnum.COMPLETED, label: 'Completed' },
    { value: WorkOrderStatusEnum.CANCELLED, label: 'Cancelled' },
  ];

  const handleAssignSubmit = async () => {
    const id = Number(technicianId);
    if (!id || !technicianName.trim()) {
      alert('Please provide both technician ID and name');
      return;
    }

    await onAssign(id, technicianName);
    setShowAssignForm(false);
    setTechnicianId('');
    setTechnicianName('');
  };

  const handleStatusSubmit = async () => {
    if (selectedStatus === workOrder.status) {
      alert('Status is already set to this value');
      return;
    }

    await onStatusUpdate(selectedStatus);
    setShowStatusForm(false);
  };

  const canAssign = workOrder.status !== 'COMPLETED' && workOrder.status !== 'CANCELLED';
  const canUpdateStatus = true;

  return (
    <div style={containerStyle}>
      <div style={buttonGroupStyle}>
        {canAssign && (
          <Button
            variant="primary"
            onClick={() => setShowAssignForm(!showAssignForm)}
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

      {showAssignForm && (
        <div style={formStyle}>
          <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Assign to Technician</h4>
          <div style={formRowStyle}>
            <Input
              name="technicianId"
              label="Technician ID"
              type="number"
              value={technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              placeholder="Enter technician ID"
              disabled={isLoading}
            />
            <Input
              name="technicianName"
              label="Technician Name"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              placeholder="Enter technician name"
              disabled={isLoading}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button onClick={handleAssignSubmit} disabled={isLoading} variant="primary">
              {isLoading ? 'Assigning...' : 'Assign'}
            </Button>
            <Button
              onClick={() => setShowAssignForm(false)}
              disabled={isLoading}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {showStatusForm && (
        <div style={formStyle}>
          <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Update Status</h4>
          <Select
            name="status"
            label="New Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as WorkOrderStatus)}
            options={statusOptions}
            disabled={isLoading}
            fullWidth
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button onClick={handleStatusSubmit} disabled={isLoading} variant="primary">
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
            <Button
              onClick={() => setShowStatusForm(false)}
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
