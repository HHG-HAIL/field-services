/**
 * WorkOrderAssignmentModal Component
 * Enhanced modal for assigning work orders to technicians
 */

import { useState, useMemo } from 'react';
import type { WorkOrder } from '../../types/workOrder';
import { TechnicianStatus, MOCK_TECHNICIANS } from '../../types/technician';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface WorkOrderAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder;
  onAssign: (technicianId: number, technicianName: string) => Promise<void>;
  isLoading?: boolean;
}

export const WorkOrderAssignmentModal = ({
  isOpen,
  onClose,
  workOrder,
  onAssign,
  isLoading = false,
}: WorkOrderAssignmentModalProps) => {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // Filter technicians based on search and status
  const filteredTechnicians = useMemo(() => {
    return MOCK_TECHNICIANS.filter((tech) => {
      const matchesSearch =
        searchTerm === '' ||
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.specialties?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'available' && tech.status === TechnicianStatus.AVAILABLE) ||
        (filterStatus === 'busy' && tech.status === TechnicianStatus.BUSY);

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  // Get selected technician details
  const selectedTechnician = useMemo(() => {
    if (!selectedTechnicianId) return null;
    return MOCK_TECHNICIANS.find((tech) => tech.id === Number(selectedTechnicianId));
  }, [selectedTechnicianId]);

  const handleAssign = async () => {
    setError(null);

    if (!selectedTechnicianId) {
      setError('Please select a technician');
      return;
    }

    const technician = MOCK_TECHNICIANS.find((t) => t.id === Number(selectedTechnicianId));
    if (!technician) {
      setError('Invalid technician selected');
      return;
    }

    try {
      await onAssign(technician.id, technician.name);
      onClose();
      setSelectedTechnicianId('');
      setSearchTerm('');
      setFilterStatus('all');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign work order');
    }
  };

  const handleCancel = () => {
    onClose();
    setSelectedTechnicianId('');
    setSearchTerm('');
    setFilterStatus('all');
    setError(null);
  };

  const workOrderInfoStyle = {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  };

  const infoRowStyle = {
    display: 'grid',
    gridTemplateColumns: '150px 1fr',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  };

  const labelStyle = {
    fontWeight: 600,
    color: '#555',
  };

  const valueStyle = {
    color: '#333',
  };

  const filtersStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 200px',
    gap: '1rem',
    marginBottom: '1rem',
  };

  const errorStyle = {
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    borderRadius: '4px',
    padding: '0.75rem',
    marginBottom: '1rem',
    color: '#c62828',
    fontSize: '0.875rem',
  };

  const technicianListStyle = {
    maxHeight: '300px',
    overflowY: 'auto' as const,
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    marginBottom: '1rem',
  };

  const technicianItemStyle = (isSelected: boolean) => ({
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#e3f2fd' : 'white',
    transition: 'background-color 0.2s',
  });

  const technicianHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  };

  const technicianNameStyle = {
    fontWeight: 600,
    fontSize: '1rem',
    color: '#333',
  };

  const statusBadgeStyle = (status: string) => ({
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    backgroundColor:
      status === TechnicianStatus.AVAILABLE
        ? '#4caf50'
        : status === TechnicianStatus.BUSY
          ? '#ff9800'
          : status === TechnicianStatus.ON_BREAK
            ? '#2196f3'
            : '#9e9e9e',
    color: 'white',
  });

  const technicianDetailsStyle = {
    fontSize: '0.875rem',
    color: '#666',
    marginTop: '0.25rem',
  };

  const workloadStyle = {
    fontSize: '0.875rem',
    color: '#666',
    marginTop: '0.25rem',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
  };

  const emptyStateStyle = {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#666',
    fontSize: '0.875rem',
  };

  const statusOptions = [
    { value: 'all', label: 'All Technicians' },
    { value: 'available', label: 'Available Only' },
    { value: 'busy', label: 'Busy' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Assign Work Order to Technician">
      <div style={workOrderInfoStyle}>
        <div style={infoRowStyle}>
          <div style={labelStyle}>Work Order:</div>
          <div style={valueStyle}>
            <strong>{workOrder.workOrderNumber}</strong>
          </div>
        </div>
        <div style={infoRowStyle}>
          <div style={labelStyle}>Title:</div>
          <div style={valueStyle}>{workOrder.title}</div>
        </div>
        <div style={infoRowStyle}>
          <div style={labelStyle}>Customer:</div>
          <div style={valueStyle}>{workOrder.customerName || `ID: ${workOrder.customerId}`}</div>
        </div>
        <div style={infoRowStyle}>
          <div style={labelStyle}>Priority:</div>
          <div style={valueStyle}>{workOrder.priority}</div>
        </div>
        {workOrder.assignedTechnicianName && (
          <div style={infoRowStyle}>
            <div style={labelStyle}>Currently Assigned:</div>
            <div style={valueStyle}>{workOrder.assignedTechnicianName}</div>
          </div>
        )}
      </div>

      {error && (
        <div style={errorStyle}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={filtersStyle}>
        <Input
          name="search"
          placeholder="Search by name or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
        <Select
          name="status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={statusOptions}
          disabled={isLoading}
        />
      </div>

      <div style={technicianListStyle}>
        {filteredTechnicians.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>No technicians found matching your criteria.</p>
          </div>
        ) : (
          filteredTechnicians.map((technician) => {
            const isSelected = selectedTechnicianId === String(technician.id);
            const workloadPercentage = technician.maxWorkOrders
              ? Math.round(
                  ((technician.currentWorkOrders || 0) / technician.maxWorkOrders) * 100,
                )
              : 0;

            return (
              <div
                key={technician.id}
                style={technicianItemStyle(isSelected)}
                onClick={() => {
                  if (!isLoading) {
                    setSelectedTechnicianId(String(technician.id));
                  }
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                    setSelectedTechnicianId(String(technician.id));
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div style={technicianHeaderStyle}>
                  <div style={technicianNameStyle}>{technician.name}</div>
                  <span style={statusBadgeStyle(technician.status)}>{technician.status}</span>
                </div>
                {technician.specialties && technician.specialties.length > 0 && (
                  <div style={technicianDetailsStyle}>
                    <strong>Specialties:</strong> {technician.specialties.join(', ')}
                  </div>
                )}
                {technician.email && (
                  <div style={technicianDetailsStyle}>
                    <strong>Email:</strong> {technician.email}
                  </div>
                )}
                <div style={workloadStyle}>
                  <strong>Current Workload:</strong> {technician.currentWorkOrders || 0} /{' '}
                  {technician.maxWorkOrders || 0} work orders ({workloadPercentage}%)
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedTechnician && (
        <div
          style={{
            backgroundColor: '#e3f2fd',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        >
          <strong>Selected:</strong> {selectedTechnician.name}
          {selectedTechnician.status !== TechnicianStatus.AVAILABLE && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#f57c00' }}>
              ⚠️ Note: This technician is currently{' '}
              {selectedTechnician.status.toLowerCase().replace('_', ' ')}
            </div>
          )}
        </div>
      )}

      <div style={buttonGroupStyle}>
        <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleAssign}
          disabled={isLoading || !selectedTechnicianId}
        >
          {isLoading ? 'Assigning...' : 'Assign Technician'}
        </Button>
      </div>
    </Modal>
  );
};

export default WorkOrderAssignmentModal;
