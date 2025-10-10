import React, { useState } from 'react';
import { Technician, WorkOrder } from '../../types';
import Button from '../ui/Button';
import { X, User, MapPin, Star, Clock, Wrench } from 'lucide-react';

interface TechnicianAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (technicianId: string) => void;
  technicians: Technician[];
  workOrder: WorkOrder | null;
}

const TechnicianAssignmentModal: React.FC<TechnicianAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  technicians,
  workOrder
}) => {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAssign = () => {
    if (selectedTechnicianId) {
      onAssign(selectedTechnicianId);
      setSelectedTechnicianId('');
      setSearchTerm('');
      onClose();
    }
  };

  const calculateDistance = (tech: Technician) => {
    if (!tech.currentLocation || !workOrder?.location.coordinates) {
      return 0;
    }
    
    // Handle case where currentLocation is a string instead of coordinates
    if (typeof tech.currentLocation === 'string') {
      return 0; // Cannot calculate distance without coordinates
    }
    
    const R = 3959; // Earth's radius in miles
    const dLat = (workOrder.location.coordinates.lat - tech.currentLocation.lat) * Math.PI / 180;
    const dLon = (workOrder.location.coordinates.lng - tech.currentLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(tech.currentLocation.lat * Math.PI / 180) * Math.cos(workOrder.location.coordinates.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal place
  };

  const getRelevantSkills = (tech: Technician) => {
    if (!workOrder) return [];
    
    const workOrderKeywords = [
      ...workOrder.title.toLowerCase().split(' '),
      ...workOrder.description.toLowerCase().split(' ')
    ];
    
    return tech.skills.filter(skill => 
      workOrderKeywords.some(keyword => 
        skill.toLowerCase().includes(keyword) || keyword.includes(skill.toLowerCase())
      )
    );
  };

  const getSuitabilityScore = (tech: Technician) => {
    let score = 0;
    
    // Availability bonus
    if (tech.status === 'available') score += 50;
    else if (tech.status === 'busy') score += 20;
    
    // Workload penalty (safely handle undefined activeWorkOrders)
    const activeWorkOrdersCount = tech.activeWorkOrders?.length || 0;
    score -= activeWorkOrdersCount * 10;
    
    // Skills relevance bonus
    const relevantSkills = getRelevantSkills(tech);
    score += relevantSkills.length * 15;
    
    // Distance penalty (closer is better)
    const distance = calculateDistance(tech);
    if (distance > 0) {
      score -= Math.min(distance * 2, 30); // Max 30 point penalty for distance
    }
    
    return Math.max(0, score);
  };

  const filteredTechnicians = technicians
    .filter(tech => {
      // Only show available technicians for assignment
      if (tech.status !== 'available') {
        return false;
      }
      
      const matchesSearch = 
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => getSuitabilityScore(b) - getSuitabilityScore(a));

  const getStatusColor = (status: Technician['status']) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'busy':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'offline':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationBadge = (tech: Technician) => {
    const score = getSuitabilityScore(tech);
    if (score >= 70) return { label: 'Best Match', color: 'bg-green-100 text-green-800' };
    if (score >= 50) return { label: 'Good Match', color: 'bg-blue-100 text-blue-800' };
    if (score >= 30) return { label: 'Fair Match', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Poor Match', color: 'bg-red-100 text-red-800' };
  };

  if (!isOpen || !workOrder) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gradient-to-br from-gray-900/80 via-primary-900/40 to-secondary-900/60 backdrop-blur-sm" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl p-8 my-8 text-left align-middle transition-all transform bg-gradient-to-br from-white to-gray-50/90 shadow-2xl rounded-2xl border-0 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Assign Technician</h3>
              <p className="text-gray-600 mt-2">
                Select the best technician for: {workOrder.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-full hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transform hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Work Order Summary */}
          <div className="bg-gradient-to-br from-primary-50/50 to-secondary-50/30 p-6 rounded-xl mb-8 border border-primary-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-2 rounded-lg mr-3">
                <Wrench className="h-5 w-5 text-primary-600" />
              </div>
              Work Order Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-1.5 rounded-lg mr-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                </div>
                <span>{workOrder.location.address}</span>
              </div>
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-1.5 rounded-lg mr-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                </div>
                <span>{new Date(workOrder.scheduledDate).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-warning-100 to-warning-200 p-1.5 rounded-lg mr-2">
                  <Wrench className="h-4 w-4 text-warning-600" />
                </div>
                <span>{workOrder.estimatedDuration} minutes</span>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-gradient-to-br from-emerald-50/50 to-indigo-50/30 p-6 rounded-xl border border-emerald-100 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-2 rounded-lg mr-3">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              Find Technician
            </h4>
            <input
              type="text"
              placeholder="Search technicians by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            />
          </div>

          {/* Technicians List */}
          <div className="max-h-96 overflow-y-auto space-y-4 mb-8">
            {filteredTechnicians.map((technician) => {
              const distance = calculateDistance(technician);
              const relevantSkills = getRelevantSkills(technician);
              const recommendation = getRecommendationBadge(technician);
              const suitabilityScore = getSuitabilityScore(technician);
              
              return (
                <div
                  key={technician.id}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedTechnicianId === technician.id
                      ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-secondary-50/30 shadow-lg transform scale-[1.02]'
                      : 'border-gray-200 hover:border-primary-300 bg-gradient-to-br from-white to-gray-50/50'
                  }`}
                  onClick={() => setSelectedTechnicianId(technician.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {technician.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{technician.name}</h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(technician.status)}`}>
                            {technician.status}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${recommendation.color}`}>
                            {recommendation.label}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{technician.activeWorkOrders?.length || 0} active jobs</span>
                          </div>
                          {distance > 0 && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{distance} miles away</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            <span>Score: {suitabilityScore}/100</span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1">
                          {technician.skills.map(skill => (
                            <span
                              key={skill}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                relevantSkills.includes(skill)
                                  ? 'bg-primary-100 text-primary-800 border border-primary-200'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {skill}
                              {relevantSkills.includes(skill) && (
                                <Star className="h-3 w-3 ml-1 fill-current" />
                              )}
                            </span>
                          ))}
                        </div>

                        {relevantSkills.length > 0 && (
                          <div className="mt-2 text-xs text-green-600">
                            ✓ Has {relevantSkills.length} relevant skill{relevantSkills.length > 1 ? 's' : ''} for this job
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={selectedTechnicianId === technician.id}
                        onChange={() => setSelectedTechnicianId(technician.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTechnicians.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No technicians found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-gradient-to-r from-gray-200 to-gray-100">
            <Button 
              variant="secondary" 
              onClick={onClose}
              className="px-6 py-3 shadow-lg hover:shadow-xl"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssign}
              disabled={!selectedTechnicianId}
              className="px-8 py-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Technician
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianAssignmentModal;