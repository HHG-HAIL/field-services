import { apiRequest, API_ENDPOINTS } from '../config/api';
import { Schedule } from '../types';

export const scheduleService = {
  // Get all schedules
  getAll: () => apiRequest(API_ENDPOINTS.SCHEDULES),
  
  // Get schedule by ID
  getById: (id: string) => apiRequest(`${API_ENDPOINTS.SCHEDULES}/${id}`),
  
  // Create schedule entry
  create: (schedule: Omit<Schedule, 'id'>) => apiRequest(API_ENDPOINTS.SCHEDULES, {
    method: 'POST',
    body: JSON.stringify(schedule),
  }),
  
  // Update schedule
  update: (id: string, schedule: Partial<Schedule>) => apiRequest(`${API_ENDPOINTS.SCHEDULES}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(schedule),
  }),
  
  // Delete schedule
  delete: (id: string) => apiRequest(`${API_ENDPOINTS.SCHEDULES}/${id}`, {
    method: 'DELETE',
  }),
  
  // Get schedules by technician
  getByTechnician: (technicianId: string) => 
    apiRequest(`${API_ENDPOINTS.SCHEDULES}/technician/${technicianId}`),
  
  // Get schedules by date range
  getByDateRange: (startDate: string, endDate: string) => 
    apiRequest(`${API_ENDPOINTS.SCHEDULES}/range?start=${startDate}&end=${endDate}`),
  
  // Check for conflicts
  checkConflicts: (technicianId: string, startTime: string, endTime: string) => 
    apiRequest(`${API_ENDPOINTS.SCHEDULES}/conflicts?technicianId=${technicianId}&start=${startTime}&end=${endTime}`),
};