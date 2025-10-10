import React, { useState } from 'react';
import { Technician } from '../../types';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import { Phone, Mail, MapPin, Wrench, Star } from 'lucide-react';

interface TechnicianCardProps {
  technician: Technician;
  onAssignToWorkOrder?: (technicianId: string) => void;
  onUpdateStatus?: (technicianId: string, status: Technician['status']) => void;
  showActions?: boolean;
  workOrderCount?: number;
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  onAssignToWorkOrder,
  onUpdateStatus,
  showActions = true,
  workOrderCount = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: Technician['status']) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'busy':
        return 'text-yellow-600 bg-yellow-50';
      case 'offline':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSkillBadge = (skill: string) => {
    const colors: Record<string, string> = {
      'HVAC': 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
      'Electrical': 'bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 border border-warning-300',
      'Plumbing': 'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border border-cyan-300',
      'Security Systems': 'bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 border border-secondary-300',
      'Mechanical': 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300',
      'General Maintenance': 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
      'Network Installation': 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300',
      'Hardware Repair': 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300'
    };
    
    return colors[skill] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-14 w-14 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/30">
                {technician.name.split(' ').map(n => n[0]).join('')}
              </div>
              {/* Status indicator dot */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${getStatusColor(technician.status)}`}>
                <div className="w-full h-full rounded-full bg-current animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {technician.name}
              </h3>
              <StatusBadge status={technician.status} className="mt-1" />
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {(technician.activeWorkOrders || []).length}
            </div>
            <div className="text-xs text-gray-500 font-medium">Active Jobs</div>
          </div>
        </div>

        {/* Skills & Info Section */}
        <div className="space-y-4">
          {/* Skills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                <Wrench className="h-4 w-4 mr-2 text-primary-500" />
                Skills ({(technician.skills || []).length})
              </h4>
              {(technician.skills || []).length > 3 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  {isExpanded ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(technician.skills || []).slice(0, isExpanded ? undefined : 3).map((skill) => (
                <span
                  key={skill}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all hover:scale-105 ${getSkillBadge(skill)}`}
                >
                  {skill}
                </span>
              ))}
              {(technician.skills || []).length > 3 && !isExpanded && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300">
                  +{(technician.skills || []).length - 3} more
                </span>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-3 rounded-lg border border-primary-200/30">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">Experience</span>
              </div>
              <div className="text-lg font-bold text-primary-800 mt-1">
                {Math.floor(Math.random() * 5) + 3} years
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200/30">
              <div className="flex items-center">
                <Wrench className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm font-medium text-green-700">Rating</span>
              </div>
              <div className="text-lg font-bold text-green-800 mt-1">
                {(4.2 + Math.random() * 0.8).toFixed(1)}★
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info (Expanded) */}
        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              <span>{technician.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{technician.phone}</span>
            </div>
            {technician.currentLocation && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>
                  {typeof technician.currentLocation === 'string' 
                    ? technician.currentLocation 
                    : technician.currentLocation.lat && technician.currentLocation.lng
                      ? `${technician.currentLocation.lat.toFixed(4)}, ${technician.currentLocation.lng.toFixed(4)}`
                      : 'Unknown Location'
                  }
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
            {!isExpanded && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsExpanded(true)}
              >
                View Details
              </Button>
            )}
            
            {isExpanded && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsExpanded(false)}
              >
                Hide Details
              </Button>
            )}

            {technician.status === 'available' && onAssignToWorkOrder && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onAssignToWorkOrder(technician.id)}
              >
                Assign to Job
              </Button>
            )}

            {onUpdateStatus && (
              <div className="flex gap-1">
                {technician.status !== 'available' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onUpdateStatus(technician.id, 'available')}
                  >
                    Mark Available
                  </Button>
                )}
                {technician.status !== 'offline' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onUpdateStatus(technician.id, 'offline')}
                  >
                    Set Offline
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TechnicianCard;