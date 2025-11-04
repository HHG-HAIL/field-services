/**
 * WorkOrderList Component
 * Displays a list of work orders in a table format
 */

import { useState } from 'react';
import type { WorkOrder } from '../../types/workOrder';
import Button from '../common/Button';
import WorkOrderAssignmentModal from './WorkOrderAssignmentModal';

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onView: (workOrder: WorkOrder) => void;
  onEdit: (workOrder: WorkOrder) => void;
  onDelete: (workOrder: WorkOrder) => void;
  onAssign?: (workOrder: WorkOrder, technicianId: number, technicianName: string) => Promise<void>;
  isLoading?: boolean;
}

// Add table row hover styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .work-order-table tbody tr {
      transition: background-color var(--transition-fast);
    }
    .work-order-table tbody tr:hover {
      background-color: var(--color-gray-50);
    }
    .work-order-table tbody tr:last-child td {
      border-bottom: none;
    }
    @media (max-width: 1024px) {
      .work-order-table {
        font-size: var(--font-size-xs);
      }
      .work-order-table th,
      .work-order-table td {
        padding: var(--spacing-sm);
      }
    }
  `;
  if (!document.getElementById('work-order-list-styles')) {
    styleSheet.id = 'work-order-list-styles';
    document.head.appendChild(styleSheet);
  }
}

export const WorkOrderList = ({
  workOrders,
  onView,
  onEdit,
  onDelete,
  onAssign,
  isLoading = false,
}: WorkOrderListProps) => {
  const [assigningWorkOrder, setAssigningWorkOrder] = useState<WorkOrder | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignClick = (workOrder: WorkOrder) => {
    setAssigningWorkOrder(workOrder);
  };

  const handleAssignSubmit = async (technicianId: number, technicianName: string) => {
    if (!assigningWorkOrder || !onAssign) return;

    setIsAssigning(true);
    try {
      await onAssign(assigningWorkOrder, technicianId, technicianName);
      setAssigningWorkOrder(null);
    } finally {
      setIsAssigning(false);
    }
  };
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: 'var(--color-surface)',
    boxShadow: 'var(--shadow-lg)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--color-border-light)',
  };

  const thStyle = {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-text-inverse)',
    padding: 'var(--spacing-md) var(--spacing-lg)',
    textAlign: 'left' as const,
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-sm)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  };

  const tdStyle = {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    borderBottom: '1px solid var(--color-border-light)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-primary)',
  };

  const statusStyle = (status: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
    padding: 'var(--spacing-xs) var(--spacing-md)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    backgroundColor:
      status === 'COMPLETED'
        ? 'var(--color-success-light)'
        : status === 'IN_PROGRESS'
          ? 'var(--color-info-light)'
          : status === 'PENDING'
            ? 'var(--color-warning-light)'
            : status === 'CANCELLED'
              ? 'var(--color-error-light)'
              : 'var(--color-gray-500)',
    color: 'var(--color-text-inverse)',
    boxShadow: 'var(--shadow-sm)',
  });

  const priorityStyle = (priority: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
    padding: 'var(--spacing-xs) var(--spacing-md)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    backgroundColor:
      priority === 'EMERGENCY'
        ? '#c62828'
        : priority === 'CRITICAL'
          ? 'var(--color-error-light)'
          : priority === 'HIGH'
            ? 'var(--color-warning-light)'
            : priority === 'NORMAL'
              ? 'var(--color-info-light)'
              : 'var(--color-gray-500)',
    color: 'var(--color-text-inverse)',
    boxShadow: 'var(--shadow-sm)',
  });

  const actionButtonsStyle = {
    display: 'flex',
    gap: 'var(--spacing-xs)',
    flexWrap: 'wrap' as const,
  };

  const emptyStateStyle = {
    textAlign: 'center' as const,
    padding: 'var(--spacing-3xl)',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    border: '2px dashed var(--color-border)',
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
        <div
          style={{
            fontSize: 'var(--font-size-3xl)',
            marginBottom: 'var(--spacing-md)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          ⏳
        </div>
        <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)' }}>
          Loading work orders...
        </p>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            marginTop: 'var(--spacing-sm)',
            color: 'var(--color-text-disabled)',
          }}
        >
          Please wait while we fetch your data
        </p>
      </div>
    );
  }

  if (workOrders.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-md)' }}>
          📭
        </div>
        <p
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
          }}
        >
          No work orders found
        </p>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            marginTop: 'var(--spacing-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Create a new work order to get started with your field service operations.
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
      <table className="work-order-table" style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>WO Number</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Technician</th>
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
                {workOrder.assignedTechnicianName || (
                  <span style={{ color: '#999', fontStyle: 'italic' }}>Unassigned</span>
                )}
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
                  {onAssign &&
                    workOrder.status !== 'COMPLETED' &&
                    workOrder.status !== 'CANCELLED' && (
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleAssignClick(workOrder)}
                      >
                        {workOrder.assignedTechnicianId ? 'Reassign' : 'Assign'}
                      </Button>
                    )}
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

      {assigningWorkOrder && (
        <WorkOrderAssignmentModal
          isOpen={true}
          onClose={() => setAssigningWorkOrder(null)}
          workOrder={assigningWorkOrder}
          onAssign={handleAssignSubmit}
          isLoading={isAssigning}
        />
      )}
    </div>
  );
};

export default WorkOrderList;
