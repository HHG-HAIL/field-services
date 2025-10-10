import { apiRequest, API_ENDPOINTS } from '../config/api';
import { WorkOrder } from '../types';

// Status mapping functions
const mapBackendToFrontendStatus = (backendStatus: string): WorkOrder['status'] => {
  switch (backendStatus?.toUpperCase()) {
    case 'PENDING':
      return 'pending';
    case 'ASSIGNED':
      return 'assigned';
    case 'IN_PROGRESS':
      return 'in-progress';
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'pending'; // fallback
  }
};

const mapFrontendToBackendStatus = (frontendStatus: WorkOrder['status']): string => {
  switch (frontendStatus) {
    case 'pending':
      return 'PENDING';
    case 'assigned':
      return 'ASSIGNED';
    case 'in-progress':
      return 'IN_PROGRESS';
    case 'completed':
      return 'COMPLETED';
    case 'cancelled':
      return 'CANCELLED';
    default:
      return 'PENDING'; // fallback
  }
};

// Transform backend work order to frontend format
const transformWorkOrder = (backendWorkOrder: any): WorkOrder => {
  return {
    ...backendWorkOrder,
    id: backendWorkOrder.id?.toString() || backendWorkOrder.id,
    technicianId: backendWorkOrder.assignedTechnicianId?.toString(),
    technicianName: backendWorkOrder.assignedTechnicianName || undefined,
    customerId: backendWorkOrder.customerId?.toString() || '1', // fallback
    customerName: backendWorkOrder.customerName || 'Unknown Customer',
    status: mapBackendToFrontendStatus(backendWorkOrder.status),
    location: backendWorkOrder.location ? (typeof backendWorkOrder.location === 'string' ? {
      address: backendWorkOrder.location,
      coordinates: { lat: 0, lng: 0 }
    } : backendWorkOrder.location) : {
      address: 'Unknown Location',
      coordinates: { lat: 0, lng: 0 }
    },
    scheduledDate: backendWorkOrder.scheduledDate || new Date().toISOString(),
    estimatedDuration: backendWorkOrder.estimatedDuration || 60,
    createdAt: backendWorkOrder.createdAt || new Date().toISOString(),
    updatedAt: backendWorkOrder.updatedAt || new Date().toISOString(),
  };
};

// Transform frontend work order to backend format
const transformToBackend = (frontendWorkOrder: Partial<WorkOrder>): any => {
  const backendOrder: any = { ...frontendWorkOrder };
  if (frontendWorkOrder.technicianId) {
    backendOrder.assignedTechnicianId = parseInt(frontendWorkOrder.technicianId);
    delete backendOrder.technicianId;
  }
  if (frontendWorkOrder.location && typeof frontendWorkOrder.location === 'object') {
    backendOrder.location = frontendWorkOrder.location.address;
  }
  return backendOrder;
};

export const workOrderService = {
  // Get all work orders
  getAll: async () => {
    const response = await apiRequest(API_ENDPOINTS.WORK_ORDERS);
    return Array.isArray(response) ? response.map(transformWorkOrder) : [];
  },
  
  // Get work order by ID
  getById: async (id: string) => {
    const response = await apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${id}`);
    return transformWorkOrder(response);
  },
  
  // Create new work order
  create: async (workOrder: Omit<WorkOrder, 'id'>) => {
    const backendWorkOrder = transformToBackend(workOrder);
    const response = await apiRequest(API_ENDPOINTS.WORK_ORDERS, {
      method: 'POST',
      body: JSON.stringify(backendWorkOrder),
    });
    return transformWorkOrder(response);
  },
  
  // Update work order
  update: async (id: string, workOrder: Partial<WorkOrder>) => {
    const backendWorkOrder = transformToBackend(workOrder);
    const response = await apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendWorkOrder),
    });
    return transformWorkOrder(response);
  },
  
  // Assign technician to work order
  assignTechnician: async (workOrderId: string, technicianId: string) => {
    const response = await apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${workOrderId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ technicianId: parseInt(technicianId) }),
    });
    return transformWorkOrder(response);
  },

  // Unassign technician from work order
  unassignTechnician: async (workOrderId: string) => {
    const response = await apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${workOrderId}/unassign`, {
      method: 'PATCH',
    });
    return transformWorkOrder(response);
  },
  
  // Update work order status
  updateStatus: async (workOrderId: string, status: WorkOrder['status']) => {
    const backendStatus = mapFrontendToBackendStatus(status);
    const response = await apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${workOrderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: backendStatus }),
    });
    return transformWorkOrder(response);
  },
  
  // Get work orders by status
  getByStatus: async (status: WorkOrder['status']) => {
    const backendStatus = mapFrontendToBackendStatus(status);
    const response = await apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/status/${backendStatus}`);
    return Array.isArray(response) ? response.map(transformWorkOrder) : [];
  },
  
  // Get work orders by technician
  getByTechnician: async (technicianId: string) => {
    const response = await apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/technician/${technicianId}`);
    return Array.isArray(response) ? response.map(transformWorkOrder) : [];
  },
  
  // Delete work order
  delete: (id: string) => apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${id}`, {
    method: 'DELETE',
  }),
};