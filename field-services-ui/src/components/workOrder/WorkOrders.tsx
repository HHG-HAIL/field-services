/**
 * WorkOrders Component
 * Main component for managing work orders with CRUD operations
 */

import { useState, useEffect } from 'react';
import type {
  WorkOrder,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
} from '../../types/workOrder';
import workOrderService from '../../services/workOrder.service';
import { useApi } from '../../hooks/useApi';
import WorkOrderList from './WorkOrderList';
import WorkOrderForm from './WorkOrderForm';
import WorkOrderDetails from './WorkOrderDetails';
import Button from '../common/Button';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

export const WorkOrders = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | undefined>();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  // API hooks
  const {
    execute: fetchWorkOrders,
    loading: loadingList,
    error: listError,
  } = useApi(workOrderService.getAll);

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

  // Load work orders on mount
  useEffect(() => {
    loadWorkOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWorkOrders = async () => {
    const result = await fetchWorkOrders(0, 100);
    if (result) {
      setWorkOrders(result.content);
    }
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

  const error = listError || createError || updateError || deleteError;

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

          <WorkOrderList
            workOrders={workOrders}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loadingList || deleting}
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
        />
      )}
    </div>
  );
};

export default WorkOrders;
