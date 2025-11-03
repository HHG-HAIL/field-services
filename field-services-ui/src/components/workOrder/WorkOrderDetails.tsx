/**
 * WorkOrderDetails Component
 * Displays detailed information about a single work order
 */

import type { WorkOrder, WorkOrderStatus } from '../../types/workOrder';
import Button from '../common/Button';
import WorkOrderActions from './WorkOrderActions';

interface WorkOrderDetailsProps {
  workOrder: WorkOrder;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  onAssign?: (technicianId: number, technicianName: string) => Promise<void>;
  onStatusUpdate?: (status: WorkOrderStatus) => Promise<void>;
  isUpdating?: boolean;
}

export const WorkOrderDetails = ({
  workOrder,
  onEdit,
  onDelete,
  onBack,
  onAssign,
  onStatusUpdate,
  isUpdating = false,
}: WorkOrderDetailsProps) => {
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e0e0e0',
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#1976d2',
    margin: 0,
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0.5rem',
  };

  const sectionStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#333',
    marginTop: 0,
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e0e0e0',
  };

  const fieldRowStyle = {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    gap: '1rem',
    marginBottom: '0.75rem',
    alignItems: 'start',
  };

  const labelStyle = {
    fontWeight: 600,
    color: '#555',
  };

  const valueStyle = {
    color: '#333',
  };

  const statusStyle = (status: string) => ({
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '16px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    backgroundColor:
      status === 'COMPLETED'
        ? '#4caf50'
        : status === 'IN_PROGRESS'
          ? '#2196f3'
          : status === 'PENDING'
            ? '#ff9800'
            : status === 'CANCELLED'
              ? '#f44336'
              : '#9e9e9e',
    color: 'white',
  });

  const priorityStyle = (priority: string) => ({
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '16px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    backgroundColor:
      priority === 'EMERGENCY'
        ? '#d32f2f'
        : priority === 'CRITICAL'
          ? '#f44336'
          : priority === 'HIGH'
            ? '#ff9800'
            : priority === 'NORMAL'
              ? '#2196f3'
              : '#9e9e9e',
    color: 'white',
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'Not set';
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Work Order Details</h1>
        <div style={buttonGroupStyle}>
          <Button variant="secondary" onClick={onBack}>
            Back to List
          </Button>
          <Button variant="primary" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Basic Information</h2>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Work Order Number:</div>
          <div style={valueStyle}>
            <strong>{workOrder.workOrderNumber}</strong>
          </div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Title:</div>
          <div style={valueStyle}>{workOrder.title}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Description:</div>
          <div style={valueStyle}>{workOrder.description || 'No description provided'}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Status:</div>
          <div style={valueStyle}>
            <span style={statusStyle(workOrder.status)}>{workOrder.status}</span>
          </div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Priority:</div>
          <div style={valueStyle}>
            <span style={priorityStyle(workOrder.priority)}>{workOrder.priority}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Customer Information</h2>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Customer ID:</div>
          <div style={valueStyle}>{workOrder.customerId}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Name:</div>
          <div style={valueStyle}>{workOrder.customerName || 'Not provided'}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Phone:</div>
          <div style={valueStyle}>{workOrder.customerPhone || 'Not provided'}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Email:</div>
          <div style={valueStyle}>{workOrder.customerEmail || 'Not provided'}</div>
        </div>
      </div>

      {/* Service Location */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Service Location</h2>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Address:</div>
          <div style={valueStyle}>{workOrder.serviceAddress || 'Not provided'}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>City:</div>
          <div style={valueStyle}>{workOrder.city || 'Not provided'}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>State:</div>
          <div style={valueStyle}>{workOrder.state || 'Not provided'}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>ZIP Code:</div>
          <div style={valueStyle}>{workOrder.zipCode || 'Not provided'}</div>
        </div>
      </div>

      {/* Scheduling & Assignment */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Scheduling & Assignment</h2>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Scheduled Date:</div>
          <div style={valueStyle}>{formatDate(workOrder.scheduledDate)}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Started At:</div>
          <div style={valueStyle}>{formatDate(workOrder.startedAt)}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Completed At:</div>
          <div style={valueStyle}>{formatDate(workOrder.completedAt)}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Assigned Technician:</div>
          <div style={valueStyle}>
            {workOrder.assignedTechnicianName || 'Not assigned'}
            {workOrder.assignedTechnicianId && ` (ID: ${workOrder.assignedTechnicianId})`}
          </div>
        </div>
      </div>

      {/* Cost Information */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Cost Information</h2>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Estimated Cost:</div>
          <div style={valueStyle}>{formatCurrency(workOrder.estimatedCost)}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Actual Cost:</div>
          <div style={valueStyle}>{formatCurrency(workOrder.actualCost)}</div>
        </div>
      </div>

      {/* Notes */}
      {workOrder.notes && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Notes</h2>
          <div style={valueStyle}>{workOrder.notes}</div>
        </div>
      )}

      {/* Metadata */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Metadata</h2>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Created At:</div>
          <div style={valueStyle}>{formatDate(workOrder.createdAt)}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Last Updated:</div>
          <div style={valueStyle}>{formatDate(workOrder.updatedAt)}</div>
        </div>
        <div style={fieldRowStyle}>
          <div style={labelStyle}>Version:</div>
          <div style={valueStyle}>{workOrder.version}</div>
        </div>
      </div>

      {/* Actions */}
      {onAssign && onStatusUpdate && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Quick Actions</h2>
          <WorkOrderActions
            workOrder={workOrder}
            onAssign={onAssign}
            onStatusUpdate={onStatusUpdate}
            isLoading={isUpdating}
          />
        </div>
      )}
    </div>
  );
};

export default WorkOrderDetails;
