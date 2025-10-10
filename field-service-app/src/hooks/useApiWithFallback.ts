import { useState, useEffect, useCallback } from 'react';
import { workOrderService } from '../services/workOrderService';
import { technicianService } from '../services/technicianService';
import { scheduleService } from '../services/scheduleService';
import { mockWorkOrders, mockTechnicians } from '../data/mockData';
import { WorkOrder, Technician, Schedule } from '../types';

// Hook to manage API connection and fallback to mock data
export const useApiWithFallback = () => {
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [technicians, setTechnicians] = useState<Technician[]>(mockTechnicians);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utility function to populate technician names in work orders
  const populateTechnicianNames = (workOrders: WorkOrder[], technicians: Technician[]): WorkOrder[] => {
    return workOrders.map(workOrder => {
      if (workOrder.technicianId && !workOrder.technicianName) {
        const technician = technicians.find(t => t.id === workOrder.technicianId);
        return {
          ...workOrder,
          technicianName: technician?.name || undefined
        };
      }
      return workOrder;
    });
  };

  // Check if backend is available
  const checkBackendHealth = async () => {
    try {
      console.log('🔍 Checking backend health...');
      await workOrderService.getAll();
      console.log('✅ Backend is available');
      setIsBackendAvailable(true);
      return true;
    } catch (err) {
      console.log('❌ Backend not available, using mock data:', err);
      setIsBackendAvailable(false);
      return false;
    }
  };

  // Load data from backend or use mock data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading data...');
      const backendAvailable = await checkBackendHealth();
      
      if (backendAvailable) {
        console.log('📡 Loading from backend...');
        // Load from backend
        const [workOrdersData, techniciansData, schedulesData] = await Promise.all([
          workOrderService.getAll().catch(() => mockWorkOrders),
          technicianService.getAll().catch(() => mockTechnicians),
          scheduleService.getAll().catch(() => []),
        ]);
        
        console.log('📊 Loaded data:', { 
          workOrders: workOrdersData.length, 
          technicians: techniciansData.length, 
          schedules: schedulesData.length 
        });
        
        // Populate technician names in work orders
        const enrichedWorkOrders = populateTechnicianNames(workOrdersData, techniciansData);
        
        setWorkOrders(enrichedWorkOrders);
        setTechnicians(techniciansData);
        setSchedules(schedulesData);
      } else {
        console.log('💾 Using mock data...');
        // Use mock data
        setWorkOrders(mockWorkOrders);
        setTechnicians(mockTechnicians);
        setSchedules([]);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Data loading error:', err);
      // Fallback to mock data on error
      setWorkOrders(mockWorkOrders);
      setTechnicians(mockTechnicians);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // API methods with fallback
  const api = {
    // Work Orders
    workOrders: {
      getAll: async () => {
        if (isBackendAvailable) {
          try {
            const data = await workOrderService.getAll();
            const enrichedData = populateTechnicianNames(data, technicians);
            setWorkOrders(enrichedData);
            return enrichedData;
          } catch (err) {
            console.error('Failed to fetch work orders:', err);
            return workOrders;
          }
        }
        return workOrders;
      },
      
      create: async (workOrder: Omit<WorkOrder, 'id'>) => {
        if (isBackendAvailable) {
          try {
            const newWorkOrder = await workOrderService.create(workOrder);
            setWorkOrders(prev => [...prev, newWorkOrder]);
            return newWorkOrder;
          } catch (err) {
            console.error('Failed to create work order:', err);
          }
        }
        
        // Fallback: add to local state
        const newWorkOrder = {
          ...workOrder,
          id: Date.now().toString(),
        } as WorkOrder;
        setWorkOrders(prev => [...prev, newWorkOrder]);
        return newWorkOrder;
      },
      
      update: async (id: string, updates: Partial<WorkOrder>) => {
        if (isBackendAvailable) {
          try {
            const updatedWorkOrder = await workOrderService.update(id, updates);
            setWorkOrders(prev => prev.map(wo => wo.id === id ? updatedWorkOrder : wo));
            return updatedWorkOrder;
          } catch (err) {
            console.error('Failed to update work order:', err);
          }
        }
        
        // Fallback: update local state
        setWorkOrders(prev => prev.map(wo => 
          wo.id === id ? { ...wo, ...updates } : wo
        ));
        return { ...workOrders.find(wo => wo.id === id)!, ...updates };
      },
      
      delete: async (id: string) => {
        if (isBackendAvailable) {
          try {
            await workOrderService.delete(id);
            setWorkOrders(prev => prev.filter(wo => wo.id !== id));
            return;
          } catch (err) {
            console.error('Failed to delete work order:', err);
          }
        }
        
        // Fallback: remove from local state
        setWorkOrders(prev => prev.filter(wo => wo.id !== id));
      },
      
      assignTechnician: async (workOrderId: string, technicianId: string) => {
        if (isBackendAvailable) {
          try {
            // 1. Assign technician to work order
            const updatedWorkOrder = await workOrderService.assignTechnician(workOrderId, technicianId);
            
            // 2. Populate technician name
            const technician = technicians.find(t => t.id === technicianId);
            const enrichedWorkOrder = {
              ...updatedWorkOrder,
              technicianName: technician?.name || undefined
            };
            
            setWorkOrders(prev => prev.map(wo => wo.id === workOrderId ? enrichedWorkOrder : wo));
            
            // 3. Update technician status to busy and add to active work orders
            try {
              const updatedTechnician = await technicianService.updateStatus(technicianId, 'busy');
              setTechnicians(prev => prev.map(tech => 
                tech.id === technicianId ? {
                  ...updatedTechnician,
                  activeWorkOrders: [...(tech.activeWorkOrders || []), workOrderId]
                } : tech
              ));
            } catch (techError) {
              console.error('Failed to update technician status:', techError);
            }
            
            return enrichedWorkOrder;
          } catch (err) {
            console.error('Failed to assign technician:', err);
            throw err;
          }
        }
        
        // Fallback: update local state
        const technician = technicians.find(t => t.id === technicianId);
        setWorkOrders(prev => prev.map(wo => 
          wo.id === workOrderId ? { 
            ...wo, 
            technicianId: technicianId,
            technicianName: technician?.name || undefined,
            status: 'assigned' as const 
          } : wo
        ));
        
        // Update technician status and active work orders in local state
        setTechnicians(prev => prev.map(tech => 
          tech.id === technicianId ? {
            ...tech,
            status: 'busy' as const,
            activeWorkOrders: [...(tech.activeWorkOrders || []), workOrderId]
          } : tech
        ));
        
        return workOrders.find(wo => wo.id === workOrderId);
      },

      unassignTechnician: async (workOrderId: string) => {
        if (isBackendAvailable) {
          try {
            // Get current work order to find assigned technician
            const currentWorkOrder = workOrders.find(wo => wo.id === workOrderId);
            const currentTechnicianId = currentWorkOrder?.technicianId;
            
            // 1. Unassign technician from work order
            const updatedWorkOrder = await workOrderService.unassignTechnician(workOrderId);
            
            setWorkOrders(prev => prev.map(wo => wo.id === workOrderId ? {
              ...updatedWorkOrder,
              technicianId: undefined,
              technicianName: undefined
            } : wo));
            
            // 2. Update previous technician status to available
            if (currentTechnicianId) {
              try {
                const updatedTechnician = await technicianService.updateStatus(currentTechnicianId, 'available');
                setTechnicians(prev => prev.map(tech => 
                  tech.id === currentTechnicianId ? {
                    ...updatedTechnician,
                    activeWorkOrders: (tech.activeWorkOrders || []).filter(id => id !== workOrderId)
                  } : tech
                ));
              } catch (techError) {
                console.error('Failed to update technician status:', techError);
              }
            }
            
            return updatedWorkOrder;
          } catch (err) {
            console.error('Failed to unassign technician:', err);
            throw err;
          }
        }
        
        // Fallback: update local state
        const currentWorkOrder = workOrders.find(wo => wo.id === workOrderId);
        const currentTechnicianId = currentWorkOrder?.technicianId;
        
        setWorkOrders(prev => prev.map(wo => 
          wo.id === workOrderId ? { 
            ...wo, 
            technicianId: undefined,
            technicianName: undefined,
            status: 'pending' as const 
          } : wo
        ));
        
        // Update technician status and remove from active work orders in local state
        if (currentTechnicianId) {
          setTechnicians(prev => prev.map(tech => 
            tech.id === currentTechnicianId ? {
              ...tech,
              status: 'available' as const,
              activeWorkOrders: (tech.activeWorkOrders || []).filter(id => id !== workOrderId)
            } : tech
          ));
        }
        
        return workOrders.find(wo => wo.id === workOrderId);
      },

      updateStatus: async (workOrderId: string, status: WorkOrder['status']) => {
        if (isBackendAvailable) {
          try {
            const updatedWorkOrder = await workOrderService.updateStatus(workOrderId, status);
            setWorkOrders(prev => prev.map(wo => wo.id === workOrderId ? updatedWorkOrder : wo));
            
            // If work order is completed or cancelled, free up the technician
            if (status === 'completed' || status === 'cancelled') {
              const workOrder = workOrders.find(wo => wo.id === workOrderId);
              if (workOrder?.technicianId) {
                const technicianId = workOrder.technicianId;
                try {
                  // Update technician status to available and remove from active work orders
                  const updatedTechnician = await technicianService.updateStatus(technicianId, 'available');
                  setTechnicians(prev => prev.map(tech => 
                    tech.id === technicianId ? {
                      ...updatedTechnician,
                      activeWorkOrders: (tech.activeWorkOrders || []).filter(id => id !== workOrderId)
                    } : tech
                  ));
                } catch (techError) {
                  console.error('Failed to update technician status:', techError);
                }
              }
            }
            
            return updatedWorkOrder;
          } catch (err) {
            console.error('Failed to update work order status:', err);
            throw err;
          }
        }
        
        // Fallback: update local state
        setWorkOrders(prev => prev.map(wo => 
          wo.id === workOrderId ? { ...wo, status, updatedAt: new Date().toISOString() } : wo
        ));
        
        // Update technician status if work order is completed/cancelled
        if (status === 'completed' || status === 'cancelled') {
          const workOrder = workOrders.find(wo => wo.id === workOrderId);
          if (workOrder?.technicianId) {
            const technicianId = workOrder.technicianId;
            setTechnicians(prev => prev.map(tech => 
              tech.id === technicianId ? {
                ...tech,
                status: 'available' as const,
                activeWorkOrders: (tech.activeWorkOrders || []).filter(id => id !== workOrderId)
              } : tech
            ));
          }
        }
        
        return workOrders.find(wo => wo.id === workOrderId);
      },
    },
    
    // Technicians
    technicians: {
      getAll: async () => {
        if (isBackendAvailable) {
          try {
            const data = await technicianService.getAll();
            setTechnicians(data);
            return data;
          } catch (err) {
            console.error('Failed to fetch technicians:', err);
            return technicians;
          }
        }
        return technicians;
      },

      getAvailable: async () => {
        if (isBackendAvailable) {
          try {
            const allTechnicians = await technicianService.getAll();
            const availableTechnicians = allTechnicians.filter(tech => tech.status === 'available');
            return availableTechnicians;
          } catch (err) {
            console.error('Failed to fetch available technicians:', err);
            return technicians.filter(tech => tech.status === 'available');
          }
        }
        return technicians.filter(tech => tech.status === 'available');
      },
      
      create: async (technician: Omit<Technician, 'id'>) => {
        if (isBackendAvailable) {
          try {
            const newTechnician = await technicianService.create(technician);
            setTechnicians(prev => [...prev, newTechnician]);
            return newTechnician;
          } catch (err) {
            console.error('Failed to create technician:', err);
          }
        }
        
        // Fallback: add to local state
        const newTechnician = {
          ...technician,
          id: Date.now().toString(),
        } as Technician;
        setTechnicians(prev => [...prev, newTechnician]);
        return newTechnician;
      },
      
      update: async (id: string, updates: Partial<Technician>) => {
        if (isBackendAvailable) {
          try {
            // For status updates, use the dedicated status endpoint
            if (updates.status && Object.keys(updates).length === 1) {
              const updatedTechnician = await technicianService.updateStatus(id, updates.status);
              setTechnicians(prev => prev.map(tech => tech.id === id ? updatedTechnician : tech));
              return updatedTechnician;
            } else {
              const updatedTechnician = await technicianService.update(id, updates);
              setTechnicians(prev => prev.map(tech => tech.id === id ? updatedTechnician : tech));
              return updatedTechnician;
            }
          } catch (err) {
            console.error('Failed to update technician:', err);
            throw err; // Re-throw to let the caller handle the error
          }
        }
        
        // Fallback: update local state
        setTechnicians(prev => prev.map(tech => 
          tech.id === id ? { ...tech, ...updates } : tech
        ));
        return { ...technicians.find(tech => tech.id === id)!, ...updates };
      },
      
      delete: async (id: string) => {
        if (isBackendAvailable) {
          try {
            await technicianService.delete(id);
            setTechnicians(prev => prev.filter(tech => tech.id !== id));
            return;
          } catch (err) {
            console.error('Failed to delete technician:', err);
          }
        }
        
        // Fallback: remove from local state
        setTechnicians(prev => prev.filter(tech => tech.id !== id));
      },
      
      findBest: async (skills: string[]) => {
        if (isBackendAvailable) {
          try {
            return await technicianService.findBest(skills);
          } catch (err) {
            console.error('Failed to find best technician:', err);
          }
        }
        
        // Fallback: simple local logic
        const availableTechnicians = technicians.filter(tech => tech.status === 'available');
        return availableTechnicians.find(tech => 
          skills.every(skill => tech.skills.includes(skill))
        ) || availableTechnicians[0] || null;
      },
    },
  };

  return {
    isBackendAvailable,
    workOrders,
    technicians,
    schedules,
    loading,
    error,
    api,
    refetch: loadData,
  };
};