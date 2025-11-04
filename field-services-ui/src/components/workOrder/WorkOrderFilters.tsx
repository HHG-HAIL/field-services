/**
 * WorkOrderFilters Component
 * Filtering options for work order list
 */

import { useState } from 'react';
import { WorkOrderStatus, WorkOrderPriority } from '../../types/workOrder';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';

export interface FilterCriteria {
  type: 'all' | 'status' | 'priority' | 'customer' | 'technician' | 'overdue';
  value?: string;
}

interface WorkOrderFiltersProps {
  onFilter: (criteria: FilterCriteria) => void;
  isLoading?: boolean;
}

interface ValidationError {
  message: string;
}

// Add responsive styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @media (max-width: 768px) {
      .filter-row {
        grid-template-columns: 1fr !important;
        gap: var(--spacing-sm) !important;
      }
    }
  `;
  if (!document.getElementById('filter-styles')) {
    styleSheet.id = 'filter-styles';
    document.head.appendChild(styleSheet);
  }
}

export const WorkOrderFilters = ({ onFilter, isLoading = false }: WorkOrderFiltersProps) => {
  const [filterType, setFilterType] = useState<FilterCriteria['type']>('all');
  const [filterValue, setFilterValue] = useState('');
  const [error, setError] = useState<ValidationError | null>(null);

  const containerStyle = {
    backgroundColor: 'var(--color-surface)',
    padding: 'var(--spacing-lg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    marginBottom: 'var(--spacing-xl)',
    border: '1px solid var(--color-border-light)',
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '200px 1fr auto',
    gap: 'var(--spacing-md)',
    alignItems: 'flex-end',
  };

  const errorStyle = {
    backgroundColor: 'var(--color-error-light)',
    border: '2px solid var(--color-error)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    marginTop: 'var(--spacing-sm)',
    color: 'var(--color-error)',
    fontSize: 'var(--font-size-sm)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
  };

  const filterTypeOptions = [
    { value: 'all', label: 'All Work Orders' },
    { value: 'status', label: 'By Status' },
    { value: 'priority', label: 'By Priority' },
    { value: 'customer', label: 'By Customer ID' },
    { value: 'technician', label: 'By Technician ID' },
    { value: 'overdue', label: 'Overdue Only' },
  ];

  const statusOptions = [
    { value: WorkOrderStatus.PENDING, label: 'Pending' },
    { value: WorkOrderStatus.ASSIGNED, label: 'Assigned' },
    { value: WorkOrderStatus.IN_PROGRESS, label: 'In Progress' },
    { value: WorkOrderStatus.ON_HOLD, label: 'On Hold' },
    { value: WorkOrderStatus.COMPLETED, label: 'Completed' },
    { value: WorkOrderStatus.CANCELLED, label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: WorkOrderPriority.LOW, label: 'Low' },
    { value: WorkOrderPriority.NORMAL, label: 'Normal' },
    { value: WorkOrderPriority.HIGH, label: 'High' },
    { value: WorkOrderPriority.CRITICAL, label: 'Critical' },
    { value: WorkOrderPriority.EMERGENCY, label: 'Emergency' },
  ];

  const handleApplyFilter = () => {
    setError(null);
    
    if (filterType === 'all' || filterType === 'overdue') {
      onFilter({ type: filterType });
    } else if (filterValue) {
      onFilter({ type: filterType, value: filterValue });
    } else {
      setError({ message: 'Please provide a filter value' });
    }
  };

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as FilterCriteria['type'];
    setFilterType(newType);
    setFilterValue('');
    setError(null);
  };

  const renderValueInput = () => {
    if (filterType === 'all' || filterType === 'overdue') {
      return null;
    }

    if (filterType === 'status') {
      return (
        <Select
          name="filterValue"
          label="Status"
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            setError(null);
          }}
          options={statusOptions}
          disabled={isLoading}
          fullWidth
        />
      );
    }

    if (filterType === 'priority') {
      return (
        <Select
          name="filterValue"
          label="Priority"
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            setError(null);
          }}
          options={priorityOptions}
          disabled={isLoading}
          fullWidth
        />
      );
    }

    if (filterType === 'customer' || filterType === 'technician') {
      return (
        <Input
          name="filterValue"
          label={filterType === 'customer' ? 'Customer ID' : 'Technician ID'}
          type="number"
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            setError(null);
          }}
          placeholder={`Enter ${filterType} ID`}
          disabled={isLoading}
          fullWidth
        />
      );
    }

    return null;
  };

  return (
    <div style={containerStyle}>
      <h3
        style={{
          marginTop: 0,
          marginBottom: 'var(--spacing-md)',
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-primary)',
          fontWeight: 'var(--font-weight-semibold)',
        }}
      >
        🔍 Filter Work Orders
      </h3>
      <div className="filter-row" style={rowStyle}>
        <Select
          name="filterType"
          label="Filter By"
          value={filterType}
          onChange={handleFilterTypeChange}
          options={filterTypeOptions}
          disabled={isLoading}
          fullWidth
        />
        {renderValueInput()}
        <Button onClick={handleApplyFilter} disabled={isLoading} variant="primary" size="medium">
          {isLoading ? 'Loading...' : 'Apply Filter'}
        </Button>
      </div>
      {error && (
        <div style={errorStyle}>
          <span>⚠️</span>
          <span>
            <strong>Error:</strong> {error.message}
          </span>
        </div>
      )}
    </div>
  );
};

export default WorkOrderFilters;
