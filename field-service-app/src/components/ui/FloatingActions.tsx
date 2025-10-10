import React from 'react';
import { Plus, UserPlus } from 'lucide-react';

interface FloatingActionsProps {
  onCreateWorkOrder: () => void;
  onCreateTechnician?: () => void;
  showTechnicianAction?: boolean;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({ 
  onCreateWorkOrder, 
  onCreateTechnician,
  showTechnicianAction = false 
}) => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3">
      {showTechnicianAction && onCreateTechnician && (
        <button
          onClick={onCreateTechnician}
          className="bg-secondary-600 hover:bg-secondary-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
          title="Add Technician"
        >
          <UserPlus size={24} />
        </button>
      )}
      
      <button
        onClick={onCreateWorkOrder}
        className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
        title="Create Work Order"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default FloatingActions;