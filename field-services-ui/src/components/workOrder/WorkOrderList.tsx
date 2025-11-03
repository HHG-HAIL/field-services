/**
 * WorkOrderList Component
 * Displays a list of work orders in a table format
 */

import type { WorkOrder } from '../../types/workOrder';
import Button from '../common/Button';

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onView: (workOrder: WorkOrder) => void;
  onEdit: (workOrder: WorkOrder) => void;
  onDelete: (workOrder: WorkOrder) => void;
  isLoading?: boolean;
}

export const WorkOrderList = ({
  workOrders,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
}: WorkOrderListProps) => {
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const thStyle = {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '1rem',
    textAlign: 'left' as const,
    fontWeight: 600,
    fontSize: '0.875rem',
    textTransform: 'uppercase' as const,
  };

  const tdStyle = {
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '0.875rem',
  };

  const statusStyle = (status: string) => ({
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
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
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
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

  const actionButtonsStyle = {
    display: 'flex',
    gap: '0.5rem',
  };

  const emptyStateStyle = {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#666',
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div style={emptyStateStyle}>
        <p>Loading work orders...</p>
      </div>
    );
  }

  if (workOrders.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <p>No work orders found.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Create a new work order to get started.
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>WO Number</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Priority</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Scheduled</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workOrders.map((workOrder) => (
            <tr key={workOrder.id}>
              <td style={tdStyle}>
                <strong>{workOrder.workOrderNumber}</strong>
              </td>
              <td style={tdStyle}>{workOrder.title}</td>
              <td style={tdStyle}>
                {workOrder.customerName || `Customer #${workOrder.customerId}`}
              </td>
              <td style={tdStyle}>
                <span style={priorityStyle(workOrder.priority)}>{workOrder.priority}</span>
              </td>
              <td style={tdStyle}>
                <span style={statusStyle(workOrder.status)}>{workOrder.status}</span>
              </td>
              <td style={tdStyle}>{formatDate(workOrder.scheduledDate)}</td>
              <td style={tdStyle}>
                <div style={actionButtonsStyle}>
                  <Button size="small" variant="primary" onClick={() => onView(workOrder)}>
                    View
                  </Button>
                  <Button size="small" variant="secondary" onClick={() => onEdit(workOrder)}>
                    Edit
                  </Button>
                  <Button size="small" variant="danger" onClick={() => onDelete(workOrder)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkOrderList;
