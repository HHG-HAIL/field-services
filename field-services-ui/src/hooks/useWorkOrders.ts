/**
 * useWorkOrders Hook
 * Custom hook for work order operations with enhanced functionality
 */

import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import workOrderService from '../services/workOrder.service';
import type { WorkOrder, WorkOrderStatus } from '../types/workOrder';

/**
 * Hook for managing work order operations
 * Provides common operations and state management for work orders
 */
export function useWorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  // API hooks for various operations
  const getAllApi = useApi(workOrderService.getAll);
  const getByIdApi = useApi(workOrderService.getById);
  const getByStatusApi = useApi(workOrderService.getByStatus);
  const getByPriorityApi = useApi(workOrderService.getByPriority);
  const getByCustomerIdApi = useApi(workOrderService.getByCustomerId);
  const getByTechnicianIdApi = useApi(workOrderService.getByTechnicianId);
  const getOverdueApi = useApi(workOrderService.getOverdue);
  const assignApi = useApi(workOrderService.assignToTechnician);
  const updateStatusApi = useApi(workOrderService.updateStatus);

  /**
   * Load all work orders with pagination
   */
  const loadAll = useCallback(
    async (page = 0, size = 100) => {
      const result = await getAllApi.execute(page, size);
      if (result) {
        setWorkOrders(result.content);
      }
      return result;
    },
    [getAllApi],
  );

  /**
   * Load work orders by status
   */
  const loadByStatus = useCallback(
    async (status: WorkOrderStatus) => {
      const result = await getByStatusApi.execute(status);
      if (result) {
        setWorkOrders(result);
      }
      return result;
    },
    [getByStatusApi],
  );

  /**
   * Load work orders by priority
   */
  const loadByPriority = useCallback(
    async (priority: string) => {
      const result = await getByPriorityApi.execute(priority);
      if (result) {
        setWorkOrders(result);
      }
      return result;
    },
    [getByPriorityApi],
  );

  /**
   * Load work orders by customer
   */
  const loadByCustomerId = useCallback(
    async (customerId: number) => {
      const result = await getByCustomerIdApi.execute(customerId);
      if (result) {
        setWorkOrders(result);
      }
      return result;
    },
    [getByCustomerIdApi],
  );

  /**
   * Load work orders by technician
   */
  const loadByTechnicianId = useCallback(
    async (technicianId: number) => {
      const result = await getByTechnicianIdApi.execute(technicianId);
      if (result) {
        setWorkOrders(result);
      }
      return result;
    },
    [getByTechnicianIdApi],
  );

  /**
   * Load overdue work orders
   */
  const loadOverdue = useCallback(async () => {
    const result = await getOverdueApi.execute();
    if (result) {
      setWorkOrders(result);
    }
    return result;
  }, [getOverdueApi]);

  /**
   * Assign work order to technician
   */
  const assignToTechnician = useCallback(
    async (id: number, technicianId: number, technicianName: string) => {
      return await assignApi.execute(id, technicianId, technicianName);
    },
    [assignApi],
  );

  /**
   * Update work order status
   */
  const updateStatus = useCallback(
    async (id: number, status: WorkOrderStatus) => {
      return await updateStatusApi.execute(id, status);
    },
    [updateStatusApi],
  );

  // Combined loading state
  const isLoading =
    getAllApi.loading ||
    getByStatusApi.loading ||
    getByPriorityApi.loading ||
    getByCustomerIdApi.loading ||
    getByTechnicianIdApi.loading ||
    getOverdueApi.loading ||
    assignApi.loading ||
    updateStatusApi.loading;

  // Combined error state
  const error =
    getAllApi.error ||
    getByStatusApi.error ||
    getByPriorityApi.error ||
    getByCustomerIdApi.error ||
    getByTechnicianIdApi.error ||
    getOverdueApi.error ||
    assignApi.error ||
    updateStatusApi.error;

  return {
    workOrders,
    isLoading,
    error,
    loadAll,
    loadByStatus,
    loadByPriority,
    loadByCustomerId,
    loadByTechnicianId,
    loadOverdue,
    getById: getByIdApi.execute,
    assignToTechnician,
    updateStatus,
  };
}

export default useWorkOrders;
