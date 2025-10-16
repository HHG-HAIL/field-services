import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import SchedulePage from './pages/SchedulePage';
import TechniciansPage from './pages/TechniciansPage';
import WorkOrderList from './components/workorders/WorkOrderList';
import CreateWorkOrderModal from './components/workorders/CreateWorkOrderModal';
import TechnicianAssignmentModal from './components/workorders/TechnicianAssignmentModal';
import EditWorkOrderModal from './components/workorders/EditWorkOrderModal';
import ChangeTechnicianModal from './components/workorders/ChangeTechnicianModal';
import ApiDebugPanel from './components/debug/ApiDebugPanel';
import FloatingActions from './components/ui/FloatingActions';
import { useApiWithFallback } from './hooks/useApiWithFallback';
import { mockUsers, mockCustomers } from './data/mockData';
import { WorkOrder, User, Technician } from './types';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const { 
    workOrders, 
    technicians, 
    isBackendAvailable, 
    loading,
    api 
  } = useApiWithFallback();
  
  const [currentUser] = useState<User>(mockUsers[0]); // Default to dispatcher
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangeTechnicianModal, setShowChangeTechnicianModal] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [workOrderToEdit, setWorkOrderToEdit] = useState<WorkOrder | null>(null);
  const [workOrderToReassign, setWorkOrderToReassign] = useState<WorkOrder | null>(null);

  // Simplified handlers using API
  const handleStatusChange = async (workOrderId: string, newStatus: WorkOrder['status']) => {
    await api.workOrders.updateStatus(workOrderId, newStatus);
  };

  const handleAssignTechnician = (workOrderId: string) => {
    const workOrder = workOrders.find(wo => wo.id === workOrderId);
    if (workOrder) {
      setSelectedWorkOrder(workOrder);
      setShowAssignmentModal(true);
    }
  };

  const handleTechnicianAssignment = async (technicianId: string) => {
    if (!selectedWorkOrder) return;
    
    await api.workOrders.assignTechnician(selectedWorkOrder.id, technicianId);
    setShowAssignmentModal(false);
    setSelectedWorkOrder(null);
  };

  const handleCreateWorkOrder = async (workOrderData: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    await api.workOrders.create({
      ...workOrderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setShowCreateModal(false);
  };

  const handleEditWorkOrder = (workOrder: WorkOrder) => {
    setWorkOrderToEdit(workOrder);
    setShowEditModal(true);
  };

  const handleUpdateWorkOrder = async (workOrderId: string, updates: Partial<WorkOrder>) => {
    await api.workOrders.update(workOrderId, updates);
    setShowEditModal(false);
    setWorkOrderToEdit(null);
  };

  const handleChangeTechnician = (workOrder: WorkOrder) => {
    setWorkOrderToReassign(workOrder);
    setShowChangeTechnicianModal(true);
  };

  const handleTechnicianChange = async (workOrderId: string, newTechnicianId: string | null) => {
    if (newTechnicianId) {
      await api.workOrders.assignTechnician(workOrderId, newTechnicianId);
    } else {
      // Handle unassignment - update work order to remove technician
      await api.workOrders.update(workOrderId, { technicianId: undefined });
    }
    setShowChangeTechnicianModal(false);
    setWorkOrderToReassign(null);
  };

  const handleUnassignTechnician = async (workOrderId: string) => {
    await api.workOrders.unassignTechnician(workOrderId);
  };

  const handleUpdateTechnicianStatus = async (technicianId: string, status: Technician['status']) => {
    await api.technicians.update(technicianId, { status });
  };

  const handleCreateTechnician = async (technicianData: Omit<Technician, 'id'>) => {
    await api.technicians.create(technicianData);
  };

  const handleReschedule = async (workOrderId: string, newDate: string) => {
    await api.workOrders.update(workOrderId, { 
      scheduledDate: new Date(newDate).toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Layout 
          user={currentUser} 
          isBackendConnected={isBackendAvailable} 
          isLoading={loading}
        >
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard
                workOrders={workOrders}
                technicians={technicians}
                userRole={currentUser.role}
                onStatusChange={handleStatusChange}
                onAssignTechnician={handleAssignTechnician}
                onUnassignTechnician={handleUnassignTechnician}
                onEditWorkOrder={handleEditWorkOrder}
                onChangeTechnician={handleChangeTechnician}
              />
            } 
          />
          <Route 
            path="/work-orders" 
            element={
              <WorkOrderList
                workOrders={workOrders}
                onStatusChange={handleStatusChange}
                onAssignTechnician={handleAssignTechnician}
                onUnassignTechnician={handleUnassignTechnician}
                onEditWorkOrder={handleEditWorkOrder}
                onChangeTechnician={handleChangeTechnician}
                onCreateNew={() => setShowCreateModal(true)}
              />
            } 
          />
          <Route 
            path="/schedule" 
            element={
              <SchedulePage
                workOrders={workOrders}
                technicians={technicians}
                onStatusChange={handleStatusChange}
                onReschedule={handleReschedule}
              />
            } 
          />
          <Route 
            path="/technicians" 
            element={
              <TechniciansPage
                technicians={technicians}
                workOrders={workOrders}
                onUpdateTechnicianStatus={handleUpdateTechnicianStatus}
                onAssignTechnician={handleAssignTechnician}
                onCreateTechnician={handleCreateTechnician}
              />
            } 
          />
        </Routes>

        <FloatingActions 
          onCreateWorkOrder={() => setShowCreateModal(true)}
        />

        {showCreateModal && (
          <CreateWorkOrderModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateWorkOrder}
            technicians={technicians}
            customers={mockCustomers}
          />
        )}

        {showAssignmentModal && selectedWorkOrder && (
          <TechnicianAssignmentModal
            isOpen={showAssignmentModal}
            onClose={() => {
              setShowAssignmentModal(false);
              setSelectedWorkOrder(null);
            }}
            onAssign={handleTechnicianAssignment}
            workOrder={selectedWorkOrder}
            technicians={technicians}
          />
        )}

        {showEditModal && workOrderToEdit && (
          <EditWorkOrderModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setWorkOrderToEdit(null);
            }}
            onUpdateWorkOrder={handleUpdateWorkOrder}
            workOrder={workOrderToEdit}
            technicians={technicians}
            customers={mockCustomers}
          />
        )}

        {showChangeTechnicianModal && workOrderToReassign && (
          <ChangeTechnicianModal
            isOpen={showChangeTechnicianModal}
            onClose={() => {
              setShowChangeTechnicianModal(false);
              setWorkOrderToReassign(null);
            }}
            onChangeTechnician={(workOrderId, newTechnicianId) =>
              handleTechnicianChange(workOrderId, newTechnicianId)
            }
            workOrder={workOrderToReassign}
            technicians={technicians}
          />
        )}
        
        <ApiDebugPanel />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
