/**
 * WorkOrders Component
 * Main component for managing work orders with CRUD operations
 */

import { useState, useEffect } from 'react';
import type {
  WorkOrder,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
  WorkOrderStatus,
} from '../../types/workOrder';
import type { PaginatedResponse } from '../../types/common';
import workOrderService from '../../services/workOrder.service';
import { useApi } from '../../hooks/useApi';
import WorkOrderList from './WorkOrderList';
import WorkOrderForm from './WorkOrderForm';
import WorkOrderDetails from './WorkOrderDetails';
import WorkOrderFilters, { type FilterCriteria } from './WorkOrderFilters';
import Button from '../common/Button';

type ViewMode = 'list' | 'create' | 'edit' | 'view';
type WorkOrderResult = WorkOrder[] | PaginatedResponse<WorkOrder> | null;

const DEFAULT_PAGE_SIZE = 100;

export const WorkOrders = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | undefined>();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterCriteria>({ type: 'all' });

  // API hooks
  const {
    execute: fetchWorkOrders,
    loading: loadingList,
    error: listError,
  } = useApi(workOrderService.getAll);

  const {
    execute: fetchByStatus,
    loading: loadingByStatus,
    error: statusError,
  } = useApi(workOrderService.getByStatus);

  const {
    execute: fetchByPriority,
    loading: loadingByPriority,
    error: priorityError,
  } = useApi(workOrderService.getByPriority);

  const {
    execute: fetchByCustomerId,
    loading: loadingByCustomer,
    error: customerError,
  } = useApi(workOrderService.getByCustomerId);

  const {
    execute: fetchByTechnicianId,
    loading: loadingByTechnician,
    error: technicianError,
  } = useApi(workOrderService.getByTechnicianId);

  const {
    execute: fetchOverdue,
    loading: loadingOverdue,
    error: overdueError,
  } = useApi(workOrderService.getOverdue);

  const {
    execute: createWorkOrder,
    loading: creating,
    error: createError,
  } = useApi(workOrderService.create);

  const {
    execute: updateWorkOrder,
    loading: updating,
    error: updateError,
  } = useApi(workOrderService.update);

  const {
    execute: deleteWorkOrder,
    loading: deleting,
    error: deleteError,
  } = useApi(workOrderService.delete);

  const {
    execute: assignToTechnician,
    loading: assigning,
    error: assignError,
  } = useApi(workOrderService.assignToTechnician);

  const {
    execute: updateStatus,
    loading: updatingStatus,
    error: statusUpdateError,
  } = useApi(workOrderService.updateStatus);

  // Load work orders on mount
  useEffect(() => {
    loadWorkOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWorkOrders = async (filter: FilterCriteria = currentFilter) => {
    let result: WorkOrderResult = null;

    switch (filter.type) {
      case 'status':
        if (filter.value) {
          result = await fetchByStatus(filter.value as WorkOrderStatus);
        }
        break;
      case 'priority':
        if (filter.value) {
          result = await fetchByPriority(filter.value);
        }
        break;
      case 'customer':
        if (filter.value) {
          result = await fetchByCustomerId(Number(filter.value));
        }
        break;
      case 'technician':
        if (filter.value) {
          result = await fetchByTechnicianId(Number(filter.value));
        }
        break;
      case 'overdue':
        result = await fetchOverdue();
        break;
      default:
        result = await fetchWorkOrders(0, DEFAULT_PAGE_SIZE);
        break;
    }

    if (result) {
      // Handle both array results and paginated results
      setWorkOrders(Array.isArray(result) ? result : result.content);
    }
  };

  const handleFilter = (filter: FilterCriteria) => {
    setCurrentFilter(filter);
    loadWorkOrders(filter);
  };

  const handleCreate = () => {
    setSelectedWorkOrder(undefined);
    setViewMode('create');
  };

  const handleView = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setViewMode('view');
  };

  const handleEdit = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setViewMode('edit');
  };

  const handleDelete = async (workOrder: WorkOrder) => {
    if (
      window.confirm(
        `Are you sure you want to delete work order "${workOrder.workOrderNumber}"? This action cannot be undone.`,
      )
    ) {
      const result = await deleteWorkOrder(workOrder.id);
      if (result !== null) {
        await loadWorkOrders();
        setViewMode('list');
      }
    }
  };

  const handleSubmitCreate = async (data: CreateWorkOrderRequest) => {
    const result = await createWorkOrder(data);
    if (result) {
      await loadWorkOrders();
      setViewMode('list');
    }
  };

  const handleSubmitUpdate = async (data: UpdateWorkOrderRequest) => {
    if (!selectedWorkOrder) return;

    const result = await updateWorkOrder(selectedWorkOrder.id, data);
    if (result) {
      await loadWorkOrders();
      setSelectedWorkOrder(result);
      setViewMode('view');
    }
  };

  const handleCancel = () => {
    setSelectedWorkOrder(undefined);
    setViewMode('list');
  };

  const handleAssign = async (technicianId: number, technicianName: string) => {
    if (!selectedWorkOrder) return;

    const result = await assignToTechnician(selectedWorkOrder.id, technicianId, technicianName);
    if (result) {
      setSelectedWorkOrder(result);
      await loadWorkOrders();
    }
  };

  const handleQuickAssign = async (
    workOrder: WorkOrder,
    technicianId: number,
    technicianName: string,
  ) => {
    const result = await assignToTechnician(workOrder.id, technicianId, technicianName);
    if (result) {
      await loadWorkOrders();
    }
  };

  const handleStatusUpdate = async (status: WorkOrderStatus) => {
    if (!selectedWorkOrder) return;

    const result = await updateStatus(selectedWorkOrder.id, status);
    if (result) {
      setSelectedWorkOrder(result);
      await loadWorkOrders();
    }
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#1976d2',
    margin: 0,
  };

  const errorStyle = {
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    borderRadius: '4px',
    padding: '1rem',
    marginBottom: '1rem',
    color: '#c62828',
  };

  const error =
    listError ||
    statusError ||
    priorityError ||
    customerError ||
    technicianError ||
    overdueError ||
    createError ||
    updateError ||
    deleteError ||
    assignError ||
    statusUpdateError;

  const isLoading =
    loadingList ||
    loadingByStatus ||
    loadingByPriority ||
    loadingByCustomer ||
    loadingByTechnician ||
    loadingOverdue ||
    deleting;

  const isUpdating = assigning || updatingStatus;

  return (
    <div style={containerStyle}>
      {viewMode === 'list' && (
        <>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Work Orders</h1>
            <Button variant="primary" onClick={handleCreate}>
              + Create Work Order
            </Button>
          </div>

          {error && (
            <div style={errorStyle}>
              <strong>Error:</strong> {error}
            </div>
          )}

          <WorkOrderFilters onFilter={handleFilter} isLoading={isLoading} />

          <WorkOrderList
            workOrders={workOrders}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAssign={handleQuickAssign}
            isLoading={isLoading}
          />
        </>
      )}

      {viewMode === 'create' && (
        <WorkOrderForm
          onSubmit={handleSubmitCreate}
          onCancel={handleCancel}
          isLoading={creating}
        />
      )}

      {viewMode === 'edit' && selectedWorkOrder && (
        <WorkOrderForm
          workOrder={selectedWorkOrder}
          onSubmit={handleSubmitUpdate}
          onCancel={handleCancel}
          isLoading={updating}
        />
      )}

      {viewMode === 'view' && selectedWorkOrder && (
        <WorkOrderDetails
          workOrder={selectedWorkOrder}
          onEdit={() => handleEdit(selectedWorkOrder)}
          onDelete={() => handleDelete(selectedWorkOrder)}
          onBack={handleCancel}
          onAssign={handleAssign}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default WorkOrders;
