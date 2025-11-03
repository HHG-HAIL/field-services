/**
 * Work Order API Service
 * Handles all API calls related to work orders
 */

import apiService from './api.service';
import type {
  WorkOrder,
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
   * Search work orders by status
   * @param status - Work order status
   * @param page - Page number (0-indexed)
   * @param size - Page size
   * @returns Paginated list of work orders
   */
  searchByStatus: (
    status: string,
    page = 0,
    size = 20,
  ): Promise<PaginatedResponse<WorkOrder>> => {
    return apiService.get<PaginatedResponse<WorkOrder>>(`${BASE_PATH}/search`, {
      params: { status, page: String(page), size: String(size) },
    });
  },
};

export default workOrderService;
