import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { X, User, AlertCircle, Star, MapPin, Wrench } from 'lucide-react';
import { WorkOrder, Technician } from '../../types';

interface ChangeTechnicianModalProps {
  isOpen: boolean;
  workOrder: WorkOrder | null;
  technicians: Technician[];
  onClose: () => void;
  onChangeTechnician: (workOrderId: string, technicianId: string | null) => void;
}

const ChangeTechnicianModal: React.FC<ChangeTechnicianModalProps> = ({
  isOpen,
  workOrder,
  technicians,
  onClose,
  onChangeTechnician
}) => {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');

  const handleSubmit = () => {
    if (!workOrder) return;
    
    onChangeTechnician(
      workOrder.id, 
      selectedTechnicianId === 'unassign' ? null : selectedTechnicianId || null
    );
    onClose();
  };

  const calculateSuitabilityScore = (technician: Technician, workOrder: WorkOrder): number => {
    let score = 0;

    // Base availability score
    if (technician.status === 'available') score += 50;
    else if (technician.status === 'busy') score += 20;
    else return 0; // offline technicians get 0

    // Workload consideration
    score -= (technician.activeWorkOrders?.length || 0) * 10;

    // Skill matching (simplified - would need work order skills in real app)
    const hasRelevantSkill = technician.skills.some(skill => 
      workOrder.title.toLowerCase().includes(skill.toLowerCase()) ||
      workOrder.description.toLowerCase().includes(skill.toLowerCase())
    );
    if (hasRelevantSkill) score += 25;

    // Distance penalty (simplified - using random for demo)
    const distance = Math.floor(Math.random() * 50); // 0-50 miles
    score -= Math.min(distance * 2, 30);

    return Math.max(0, Math.min(100, score));
  };

  const getRecommendationBadge = (score: number) => {
    if (score >= 80) return { text: 'Best Match', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { text: 'Good Match', color: 'bg-blue-100 text-blue-800' };
    if (score >= 40) return { text: 'Fair Match', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Poor Match', color: 'bg-red-100 text-red-800' };
  };

  if (!isOpen || !workOrder) return null;

  const currentTechnician = technicians.find(t => t.id === workOrder.technicianId);
  const availableTechnicians = technicians
    .filter(t => t.status !== 'offline')
    .map(technician => ({
      ...technician,
      score: calculateSuitabilityScore(technician, workOrder)
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Change Technician Assignment</h2>
            <p className="text-sm text-gray-600">{workOrder.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Current Assignment */}
          {currentTechnician && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Currently Assigned</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentTechnician.name}</p>
                  <p className="text-sm text-gray-600">
                    {currentTechnician.activeWorkOrders?.length || 0} active jobs • {currentTechnician.status}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Unassign Option */}
          <div className="mb-4">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="technician"
                value="unassign"
                checked={selectedTechnicianId === 'unassign'}
                onChange={(e) => setSelectedTechnicianId(e.target.value)}
                className="mr-3"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Unassign</p>
                <p className="text-sm text-gray-600">Remove technician assignment</p>
              </div>
            </label>
          </div>

          {/* Available Technicians */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Available Technicians</h3>
            
            {availableTechnicians.length === 0 ? (
              <div className="flex items-center justify-center p-6 text-gray-500">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>No available technicians</span>
              </div>
            ) : (
              availableTechnicians.map((technician) => {
                const recommendation = getRecommendationBadge(technician.score);
                const isCurrentlyAssigned = technician.id === workOrder.technicianId;
                
                return (
                  <label
                    key={technician.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTechnicianId === technician.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${isCurrentlyAssigned ? 'opacity-50' : ''}`}
                  >
                    <input
                      type="radio"
                      name="technician"
                      value={technician.id}
                      checked={selectedTechnicianId === technician.id}
                      onChange={(e) => setSelectedTechnicianId(e.target.value)}
                      disabled={isCurrentlyAssigned}
                      className="mr-4"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            technician.status === 'available' ? 'bg-green-600' : 'bg-yellow-600'
                          }`}>
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{technician.name}</p>
                            <p className="text-sm text-gray-600">{technician.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${recommendation.color}`}>
                            {recommendation.text}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-4 w-4 mr-1" />
                            {technician.score}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-1" />
                          <span>{technician.status} • {technician.activeWorkOrders?.length || 0} jobs</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{Math.floor(Math.random() * 25) + 1} miles away</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Wrench className="h-4 w-4 mr-1" />
                          <span>{technician.skills.length} skills</span>
                        </div>
                      </div>
                      
                      {/* Skills */}
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {technician.skills.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {technician.skills.length > 4 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                              +{technician.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!selectedTechnicianId}
            >
              {selectedTechnicianId === 'unassign' ? 'Unassign' : 'Assign Technician'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChangeTechnicianModal;