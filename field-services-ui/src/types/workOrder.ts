/**
 * Work Order type definitions
 * Matches the backend DTOs for WorkOrder entity
 */

/**
 * Work order status enum
 */
export const WorkOrderStatus = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type WorkOrderStatus = (typeof WorkOrderStatus)[keyof typeof WorkOrderStatus];

/**
 * Work order priority enum
 */
export const WorkOrderPriority = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
  EMERGENCY: 'EMERGENCY',
} as const;

export type WorkOrderPriority = (typeof WorkOrderPriority)[keyof typeof WorkOrderPriority];

/**
 * Work order item DTO
 */
export interface WorkOrderItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Work order DTO
 */
export interface WorkOrder {
  id: number;
  workOrderNumber: string;
  title: string;
  description?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  customerId: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  assignedTechnicianId?: number;
  assignedTechnicianName?: string;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  items?: WorkOrderItem[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

/**
 * Create work order request
 */
export interface CreateWorkOrderRequest {
  title: string;
  description?: string;
  priority: WorkOrderPriority;
  customerId: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  scheduledDate?: string;
  estimatedCost?: number;
  notes?: string;
}

/**
 * Update work order request
 */
export interface UpdateWorkOrderRequest {
  title?: string;
  description?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  assignedTechnicianId?: number;
  assignedTechnicianName?: string;
  scheduledDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
}
