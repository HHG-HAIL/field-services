import { apiRequest, API_ENDPOINTS } from '../config/api';
import { Technician } from '../types';

// Utility functions for status mapping
const mapBackendToFrontendStatus = (backendStatus: string): Technician['status'] => {
  switch (backendStatus.toUpperCase()) {
    case 'AVAILABLE':
      return 'available';
    case 'BUSY':
      return 'busy';
    case 'OFFLINE':
      return 'offline';
    case 'ON_BREAK':
      return 'on-break';
    default:
      return 'offline'; // fallback
  }
};

const mapFrontendToBackendStatus = (frontendStatus: Technician['status']): string => {
  switch (frontendStatus) {
    case 'available':
      return 'AVAILABLE';
    case 'busy':
      return 'BUSY';
    case 'offline':
      return 'OFFLINE';
    case 'on-break':
      return 'ON_BREAK';
    default:
      return 'OFFLINE'; // fallback
  }
};

// Transform backend technician to frontend format
const transformTechnician = (backendTech: any): Technician => {
  return {
    ...backendTech,
    id: backendTech.id?.toString() || backendTech.id,
    status: mapBackendToFrontendStatus(backendTech.status),
    phone: backendTech.phoneNumber || backendTech.phone,
    activeWorkOrders: [], // Backend might not provide this, use empty array as fallback
  };
};

export const technicianService = {
  // Get all technicians
  getAll: async () => {
    const response = await apiRequest(API_ENDPOINTS.TECHNICIANS);
    return Array.isArray(response) ? response.map(transformTechnician) : [];
  },
  
  // Get technician by ID
  getById: async (id: string) => {
    const response = await apiRequest(`${API_ENDPOINTS.TECHNICIANS}/${id}`);
    return transformTechnician(response);
  },
  
  // Get available technicians
  getAvailable: async () => {
    const response = await apiRequest(`${API_ENDPOINTS.TECHNICIANS}/available`);
    return Array.isArray(response) ? response.map(transformTechnician) : [];
  },
  
  // Get technicians by skill
  getBySkill: async (skill: string) => {
    const response = await apiRequest(`${API_ENDPOINTS.TECHNICIANS}/skill/${skill}`);
    return Array.isArray(response) ? response.map(transformTechnician) : [];
  },
  
  // Find best technician for skills
  findBest: async (skills: string[]) => {
    const response = await apiRequest(`${API_ENDPOINTS.TECHNICIANS}/find-best`, {
      method: 'POST',
      body: JSON.stringify({ skills }),
    });
    return transformTechnician(response);
  },
  
  // Create technician
  create: async (technician: Omit<Technician, 'id'>) => {
    // Transform frontend format to backend format
    const backendTechnician = {
      ...technician,
      status: mapFrontendToBackendStatus(technician.status),
      phoneNumber: technician.phone,
    };
    const response = await apiRequest(API_ENDPOINTS.TECHNICIANS, {
      method: 'POST',
      body: JSON.stringify(backendTechnician),
    });
    return transformTechnician(response);
  },
  
  // Update technician
  update: async (id: string, technician: Partial<Technician>) => {
    // Transform frontend format to backend format
    const backendUpdates: any = { ...technician };
    if (technician.status) {
      backendUpdates.status = mapFrontendToBackendStatus(technician.status);
    }
    if (technician.phone) {
      backendUpdates.phoneNumber = technician.phone;
      delete backendUpdates.phone;
    }
    
    const response = await apiRequest(`${API_ENDPOINTS.TECHNICIANS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendUpdates),
    });
    return transformTechnician(response);
  },
  
  // Update technician status
  updateStatus: async (technicianId: string, status: Technician['status']) => {
    // Convert frontend status to backend format (uppercase)
    const backendStatus = mapFrontendToBackendStatus(status);
    const response = await apiRequest(`${API_ENDPOINTS.TECHNICIANS}/${technicianId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: backendStatus }),
    });
    return transformTechnician(response);
  },
  
  // Update technician location
  updateLocation: (technicianId: string, latitude: string, longitude: string) => 
    apiRequest(`${API_ENDPOINTS.TECHNICIANS}/${technicianId}/location`, {
      method: 'PATCH',
      body: JSON.stringify({ latitude, longitude }),
    }),
  
  // Delete technician
  delete: (id: string) => apiRequest(`${API_ENDPOINTS.TECHNICIANS}/${id}`, {
    method: 'DELETE',
  }),
  
  // Get technician count by status
  getCountByStatus: (status: Technician['status']) => 
    apiRequest(`${API_ENDPOINTS.TECHNICIANS}/stats/count-by-status/${status}`),
};