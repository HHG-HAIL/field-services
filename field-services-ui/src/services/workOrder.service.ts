/**
 * Work Order API Service
 * Handles all API calls related to work orders
 */

import apiService from './api.service';
import type {
  WorkOrder,
  WorkOrderStatus,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
} from '../types/workOrder';
import type { PaginatedResponse } from '../types/common';

const BASE_PATH = '/api/v1/work-orders';

/**
 * Work Order Service
 */
export const workOrderService = {
  /**
   * Get all work orders with optional pagination
   * @param page - Page number (0-indexed)
   * @param size - Page size
   * @returns Paginated list of work orders
   */
  getAll: (page = 0, size = 20): Promise<PaginatedResponse<WorkOrder>> => {
    return apiService.get<PaginatedResponse<WorkOrder>>(BASE_PATH, {
      params: { page: String(page), size: String(size) },
    });
  },

  /**
   * Get a single work order by ID
   * @param id - Work order ID
   * @returns Work order details
   */
  getById: (id: number): Promise<WorkOrder> => {
    return apiService.get<WorkOrder>(`${BASE_PATH}/${id}`);
  },

  /**
   * Create a new work order
   * @param request - Create work order request
   * @returns Created work order
   */
  create: (request: CreateWorkOrderRequest): Promise<WorkOrder> => {
    return apiService.post<WorkOrder>(BASE_PATH, request);
  },

  /**
   * Update an existing work order
   * @param id - Work order ID
   * @param request - Update work order request
   * @returns Updated work order
   */
  update: (id: number, request: UpdateWorkOrderRequest): Promise<WorkOrder> => {
    return apiService.put<WorkOrder>(`${BASE_PATH}/${id}`, request);
  },

  /**
   * Delete a work order
   * @param id - Work order ID
   */
  delete: (id: number): Promise<void> => {
    return apiService.delete<void>(`${BASE_PATH}/${id}`);
  },

  /**
   * Get work order by work order number
   * @param workOrderNumber - Work order number
   * @returns Work order details
   */
  getByWorkOrderNumber: (workOrderNumber: string): Promise<WorkOrder> => {
    return apiService.get<WorkOrder>(`${BASE_PATH}/number/${workOrderNumber}`);
  },

  /**
   * Get work orders by status
   * @param status - Work order status
   * @returns List of work orders
   */
  getByStatus: (status: WorkOrderStatus): Promise<WorkOrder[]> => {
    return apiService.get<WorkOrder[]>(`${BASE_PATH}/status/${status}`);
  },

  /**
   * Get work orders by priority
   * @param priority - Work order priority
   * @returns List of work orders
   */
  getByPriority: (priority: string): Promise<WorkOrder[]> => {
    return apiService.get<WorkOrder[]>(`${BASE_PATH}/priority/${priority}`);
  },

  /**
   * Get work orders by customer ID
   * @param customerId - Customer ID
   * @returns List of work orders
   */
  getByCustomerId: (customerId: number): Promise<WorkOrder[]> => {
    return apiService.get<WorkOrder[]>(`${BASE_PATH}/customer/${customerId}`);
  },

  /**
   * Get work orders by technician ID
   * @param technicianId - Technician ID
   * @returns List of work orders
   */
  getByTechnicianId: (technicianId: number): Promise<WorkOrder[]> => {
    return apiService.get<WorkOrder[]>(`${BASE_PATH}/technician/${technicianId}`);
  },

  /**
   * Get overdue work orders
   * @returns List of overdue work orders
   */
  getOverdue: (): Promise<WorkOrder[]> => {
    return apiService.get<WorkOrder[]>(`${BASE_PATH}/overdue`);
  },

  /**
   * Assign work order to a technician
   * @param id - Work order ID
   * @param technicianId - Technician ID
   * @param technicianName - Technician name
   * @returns Updated work order
   */
  assignToTechnician: (
    id: number,
    technicianId: number,
    technicianName: string,
  ): Promise<WorkOrder> => {
    return apiService.post<WorkOrder>(`${BASE_PATH}/${id}/assign`, null, {
      params: {
        technicianId: String(technicianId),
        technicianName,
      },
    });
  },

  /**
   * Update work order status
   * @param id - Work order ID
   * @param status - New status
   * @returns Updated work order
   */
  updateStatus: (id: number, status: WorkOrderStatus): Promise<WorkOrder> => {
    return apiService.patch<WorkOrder>(`${BASE_PATH}/${id}/status`, null, {
      params: { status },
    });
  },
};

export default workOrderService;
