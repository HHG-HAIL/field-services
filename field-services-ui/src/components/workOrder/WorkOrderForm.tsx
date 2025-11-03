/**
 * WorkOrderForm Component
 * Form for creating and editing work orders
 */

import { useState, useEffect } from 'react';
import type {
  WorkOrder,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
} from '../../types/workOrder';
import { WorkOrderPriority, WorkOrderStatus } from '../../types/workOrder';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import Button from '../common/Button';

// Validation constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_CODE_REGEX = /^[0-9]{5}(-[0-9]{4})?$/;

interface CreateWorkOrderFormProps {
  onSubmit: (data: CreateWorkOrderRequest) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface EditWorkOrderFormProps {
  workOrder: WorkOrder;
  onSubmit: (data: UpdateWorkOrderRequest) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

type WorkOrderFormProps = CreateWorkOrderFormProps | EditWorkOrderFormProps;

export const WorkOrderForm = (props: WorkOrderFormProps) => {
  const { onCancel, isLoading = false } = props;
  const isEditMode = 'workOrder' in props;
  const workOrder = isEditMode ? props.workOrder : undefined;

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: WorkOrderPriority;
    status: WorkOrderStatus;
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    serviceAddress: string;
    city: string;
    state: string;
    zipCode: string;
    scheduledDate: string;
    estimatedCost: string;
    actualCost: string;
    notes: string;
    assignedTechnicianId: string;
    assignedTechnicianName: string;
  }>({
    title: '',
    description: '',
    priority: WorkOrderPriority.NORMAL,
    status: WorkOrderStatus.PENDING,
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceAddress: '',
    city: '',
    state: '',
    zipCode: '',
    scheduledDate: '',
    estimatedCost: '',
    actualCost: '',
    notes: '',
    assignedTechnicianId: '',
    assignedTechnicianName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load work order data in edit mode
  useEffect(() => {
    if (workOrder) {
      setFormData({
        title: workOrder.title || '',
        description: workOrder.description || '',
        priority: workOrder.priority,
        status: workOrder.status,
        customerId: String(workOrder.customerId || ''),
        customerName: workOrder.customerName || '',
        customerPhone: workOrder.customerPhone || '',
        customerEmail: workOrder.customerEmail || '',
        serviceAddress: workOrder.serviceAddress || '',
        city: workOrder.city || '',
        state: workOrder.state || '',
        zipCode: workOrder.zipCode || '',
        scheduledDate: workOrder.scheduledDate
          ? workOrder.scheduledDate.substring(0, 16)
          : '',
        estimatedCost: workOrder.estimatedCost ? String(workOrder.estimatedCost) : '',
        actualCost: workOrder.actualCost ? String(workOrder.actualCost) : '',
        notes: workOrder.notes || '',
        assignedTechnicianId: workOrder.assignedTechnicianId
          ? String(workOrder.assignedTechnicianId)
          : '',
        assignedTechnicianName: workOrder.assignedTechnicianName || '',
      });
    }
  }, [workOrder]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    if (!isEditMode && !formData.customerId) {
      newErrors.customerId = 'Customer ID is required';
    }

    if (formData.customerEmail && !EMAIL_REGEX.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }

    if (formData.zipCode && !ZIP_CODE_REGEX.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
    }

    if (formData.estimatedCost && isNaN(Number(formData.estimatedCost))) {
      newErrors.estimatedCost = 'Must be a valid number';
    }

    if (formData.actualCost && isNaN(Number(formData.actualCost))) {
      newErrors.actualCost = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditMode && 'workOrder' in props) {
      // Update request - only send changed fields
      const updateData: UpdateWorkOrderRequest = {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        priority: formData.priority,
        scheduledDate: formData.scheduledDate || undefined,
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : undefined,
        actualCost: formData.actualCost ? Number(formData.actualCost) : undefined,
        notes: formData.notes || undefined,
        assignedTechnicianId: formData.assignedTechnicianId
          ? Number(formData.assignedTechnicianId)
          : undefined,
        assignedTechnicianName: formData.assignedTechnicianName || undefined,
      };
      props.onSubmit(updateData);
    } else if (!isEditMode && !('workOrder' in props)) {
      // Create request
      const createData: CreateWorkOrderRequest = {
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        customerId: Number(formData.customerId),
        customerName: formData.customerName || undefined,
        customerPhone: formData.customerPhone || undefined,
        customerEmail: formData.customerEmail || undefined,
        serviceAddress: formData.serviceAddress || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        scheduledDate: formData.scheduledDate || undefined,
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : undefined,
        notes: formData.notes || undefined,
      };
      props.onSubmit(createData);
    }
  };

  const priorityOptions = [
    { value: WorkOrderPriority.LOW, label: 'Low' },
    { value: WorkOrderPriority.NORMAL, label: 'Normal' },
    { value: WorkOrderPriority.HIGH, label: 'High' },
    { value: WorkOrderPriority.CRITICAL, label: 'Critical' },
    { value: WorkOrderPriority.EMERGENCY, label: 'Emergency' },
  ];

  const statusOptions = [
    { value: WorkOrderStatus.PENDING, label: 'Pending' },
    { value: WorkOrderStatus.ASSIGNED, label: 'Assigned' },
    { value: WorkOrderStatus.IN_PROGRESS, label: 'In Progress' },
    { value: WorkOrderStatus.ON_HOLD, label: 'On Hold' },
    { value: WorkOrderStatus.COMPLETED, label: 'Completed' },
    { value: WorkOrderStatus.CANCELLED, label: 'Cancelled' },
  ];

  const formStyle = {
    maxWidth: '800px',
    margin: '0 auto',
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  };

  const sectionTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#333',
    marginTop: '1.5rem',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e0e0e0',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ marginBottom: '1.5rem', color: '#1976d2' }}>
        {isEditMode ? 'Edit Work Order' : 'Create New Work Order'}
      </h2>

      {/* Basic Information */}
      <div style={sectionTitleStyle}>Basic Information</div>

      <Input
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        fullWidth
        placeholder="e.g., HVAC Repair"
        disabled={isLoading}
      />

      <TextArea
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        rows={3}
        placeholder="Detailed description of the work order..."
        disabled={isLoading}
      />

      <div style={rowStyle}>
        <Select
          name="priority"
          label="Priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
          required
          fullWidth
          disabled={isLoading}
        />

        {isEditMode && (
          <Select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            required
            fullWidth
            disabled={isLoading}
          />
        )}
      </div>

      {/* Customer Information */}
      <div style={sectionTitleStyle}>Customer Information</div>

      <div style={rowStyle}>
        <Input
          name="customerId"
          label="Customer ID"
          type="number"
          value={formData.customerId}
          onChange={handleChange}
          error={errors.customerId}
          required={!isEditMode}
          fullWidth
          disabled={isEditMode || isLoading}
        />

        <Input
          name="customerName"
          label="Customer Name"
          value={formData.customerName}
          onChange={handleChange}
          fullWidth
          placeholder="John Doe"
          disabled={isEditMode || isLoading}
        />
      </div>

      <div style={rowStyle}>
        <Input
          name="customerPhone"
          label="Phone"
          type="tel"
          value={formData.customerPhone}
          onChange={handleChange}
          fullWidth
          placeholder="555-1234"
          disabled={isEditMode || isLoading}
        />

        <Input
          name="customerEmail"
          label="Email"
          type="email"
          value={formData.customerEmail}
          onChange={handleChange}
          error={errors.customerEmail}
          fullWidth
          placeholder="customer@example.com"
          disabled={isEditMode || isLoading}
        />
      </div>

      {/* Service Location */}
      <div style={sectionTitleStyle}>Service Location</div>

      <Input
        name="serviceAddress"
        label="Service Address"
        value={formData.serviceAddress}
        onChange={handleChange}
        fullWidth
        placeholder="123 Main St"
        disabled={isEditMode || isLoading}
      />

      <div style={rowStyle}>
        <Input
          name="city"
          label="City"
          value={formData.city}
          onChange={handleChange}
          fullWidth
          placeholder="Springfield"
          disabled={isEditMode || isLoading}
        />

        <Input
          name="state"
          label="State"
          value={formData.state}
          onChange={handleChange}
          fullWidth
          placeholder="IL"
          disabled={isEditMode || isLoading}
        />
      </div>

      <Input
        name="zipCode"
        label="ZIP Code"
        value={formData.zipCode}
        onChange={handleChange}
        error={errors.zipCode}
        fullWidth
        placeholder="62701"
        disabled={isEditMode || isLoading}
      />

      {/* Scheduling & Assignment */}
      <div style={sectionTitleStyle}>Scheduling & Assignment</div>

      <div style={rowStyle}>
        <Input
          name="scheduledDate"
          label="Scheduled Date & Time"
          type="datetime-local"
          value={formData.scheduledDate}
          onChange={handleChange}
          fullWidth
          disabled={isLoading}
        />

        {isEditMode && (
          <Input
            name="assignedTechnicianId"
            label="Assigned Technician ID"
            type="number"
            value={formData.assignedTechnicianId}
            onChange={handleChange}
            fullWidth
            disabled={isLoading}
          />
        )}
      </div>

      {isEditMode && (
        <Input
          name="assignedTechnicianName"
          label="Assigned Technician Name"
          value={formData.assignedTechnicianName}
          onChange={handleChange}
          fullWidth
          placeholder="Jane Tech"
          disabled={isLoading}
        />
      )}

      {/* Cost Information */}
      <div style={sectionTitleStyle}>Cost Information</div>

      <div style={rowStyle}>
        <Input
          name="estimatedCost"
          label="Estimated Cost"
          type="number"
          step="0.01"
          value={formData.estimatedCost}
          onChange={handleChange}
          error={errors.estimatedCost}
          fullWidth
          placeholder="0.00"
          disabled={isLoading}
        />

        {isEditMode && (
          <Input
            name="actualCost"
            label="Actual Cost"
            type="number"
            step="0.01"
            value={formData.actualCost}
            onChange={handleChange}
            error={errors.actualCost}
            fullWidth
            placeholder="0.00"
            disabled={isLoading}
          />
        )}
      </div>

      {/* Notes */}
      <div style={sectionTitleStyle}>Additional Notes</div>

      <TextArea
        name="notes"
        label="Notes"
        value={formData.notes}
        onChange={handleChange}
        fullWidth
        rows={4}
        placeholder="Any additional notes or comments..."
        disabled={isLoading}
      />

      {/* Actions */}
      <div style={buttonGroupStyle}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEditMode ? 'Update Work Order' : 'Create Work Order'}
        </Button>
      </div>
    </form>
  );
};

export default WorkOrderForm;
