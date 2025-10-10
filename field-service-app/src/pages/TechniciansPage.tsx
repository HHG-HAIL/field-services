import React, { useState } from 'react';
import { Technician, WorkOrder } from '../types';
import TechniciansList from '../components/technicians/TechniciansList';
import CreateTechnicianModal from '../components/technicians/CreateTechnicianModal';

interface TechniciansPageProps {
  technicians: Technician[];
  workOrders: WorkOrder[];
  onUpdateTechnicianStatus: (technicianId: string, status: Technician['status']) => void;
  onAssignTechnician: (technicianId: string, workOrderId?: string) => void;
  onCreateTechnician: (technician: Omit<Technician, 'id'>) => void;
}

const TechniciansPage: React.FC<TechniciansPageProps> = ({
  technicians,
  workOrders,
  onUpdateTechnicianStatus,
  onAssignTechnician,
  onCreateTechnician
}) => {
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');

  const handleAssignToWorkOrder = (technicianId: string) => {
    setSelectedTechnicianId(technicianId);
    setShowAssignmentModal(true);
  };

  const handleAssignmentComplete = (workOrderId: string) => {
    onAssignTechnician(selectedTechnicianId, workOrderId);
    setShowAssignmentModal(false);
    setSelectedTechnicianId('');
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleCreateTechnician = (technicianData: Omit<Technician, 'id'>) => {
    onCreateTechnician(technicianData);
    setShowCreateModal(false);
  };

  // Get unassigned work orders for assignment
  const unassignedWorkOrders = workOrders.filter(wo => !wo.technicianId && wo.status !== 'cancelled');

  return (
    <div>
      <TechniciansList
        technicians={technicians}
        onAssignToWorkOrder={handleAssignToWorkOrder}
        onUpdateStatus={onUpdateTechnicianStatus}
        onCreateNew={handleCreateNew}
      />

      <CreateTechnicianModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTechnician={handleCreateTechnician}
      />

      <WorkOrderAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onAssign={handleAssignmentComplete}
        workOrders={unassignedWorkOrders}
        selectedTechnician={technicians.find(t => t.id === selectedTechnicianId) || null}
      />
    </div>
  );
};

// Modal for assigning work orders to a technician
interface WorkOrderAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (workOrderId: string) => void;
  workOrders: WorkOrder[];
  selectedTechnician: Technician | null;
}

const WorkOrderAssignmentModal: React.FC<WorkOrderAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  workOrders,
  selectedTechnician
}) => {
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string>('');

  const handleAssign = () => {
    if (selectedWorkOrderId) {
      onAssign(selectedWorkOrderId);
      setSelectedWorkOrderId('');
    }
  };

  if (!isOpen || !selectedTechnician) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Assign Work Order</h3>
              <p className="text-sm text-gray-600 mt-1">
                Select a work order to assign to {selectedTechnician.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3 mb-6">
            {workOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No unassigned work orders available.</p>
              </div>
            ) : (
              workOrders.map((workOrder) => (
                <div
                  key={workOrder.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedWorkOrderId === workOrder.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedWorkOrderId(workOrder.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{workOrder.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{workOrder.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <span>{workOrder.customerName}</span> • 
                        <span className="ml-1">{new Date(workOrder.scheduledDate).toLocaleString()}</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={selectedWorkOrderId === workOrder.id}
                      onChange={() => setSelectedWorkOrderId(workOrder.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedWorkOrderId}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Work Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechniciansPage;