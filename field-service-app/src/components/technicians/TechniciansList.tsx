import React, { useState } from 'react';
import { Technician } from '../../types';
import TechnicianCard from './TechnicianCard';
import { Search, Plus, Users } from 'lucide-react';
import Button from '../ui/Button';

interface TechniciansListProps {
  technicians: Technician[];
  onAssignToWorkOrder?: (technicianId: string) => void;
  onUpdateStatus?: (technicianId: string, status: Technician['status']) => void;
  onCreateNew?: () => void;
  title?: string;
}

const TechniciansList: React.FC<TechniciansListProps> = ({
  technicians = [], // Default to empty array
  onAssignToWorkOrder,
  onUpdateStatus,
  onCreateNew,
  title = "Technicians"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');

  // Safety check for technicians array
  const safeTechnicians = Array.isArray(technicians) ? technicians : [];

  const filteredTechnicians = safeTechnicians.filter(technician => {
    const matchesSearch = 
      technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (technician.skills || []).some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || technician.status === statusFilter;
    const matchesSkill = skillFilter === 'all' || (technician.skills || []).includes(skillFilter);
    
    return matchesSearch && matchesStatus && matchesSkill;
  });

  const getStatusCounts = () => {
    return {
      all: safeTechnicians.length,
      available: safeTechnicians.filter(t => t.status === 'available').length,
      busy: safeTechnicians.filter(t => t.status === 'busy').length,
      offline: safeTechnicians.filter(t => t.status === 'offline').length,
      'on-break': safeTechnicians.filter(t => t.status === 'on-break').length,
    };
  };

  const getAllSkills = () => {
    const skills = new Set<string>();
    safeTechnicians.forEach(tech => {
      (tech.skills || []).forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  };

  const statusCounts = getStatusCounts();
  const allSkills = getAllSkills();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h2>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">{statusCounts.available} Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-700">{statusCounts.busy} Busy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">{statusCounts.offline} Offline</span>
              </div>
            </div>
          </div>
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew} className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Technician
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-xl shadow-lg border-0 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-500" />
              <input
                type="text"
                placeholder="Search technicians, skills, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
              />
            </div>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            >
              <option value="all">All Status ({statusCounts.all})</option>
              <option value="available">🟢 Available ({statusCounts.available})</option>
              <option value="busy">🟡 Busy ({statusCounts.busy})</option>
              <option value="offline">⚫ Offline ({statusCounts.offline})</option>
              <option value="on-break">☕ On Break ({statusCounts['on-break']})</option>
            </select>
          </div>
          
          <div>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            >
              <option value="all">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Technicians Grid */}
      {filteredTechnicians.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-lg border-0 backdrop-blur-sm">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No technicians found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search terms or filters to find the technicians you're looking for.
          </p>
          {onCreateNew && (
            <Button onClick={onCreateNew} className="mt-6">
              <Plus className="h-4 w-4 mr-2" />
              Add First Technician
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredTechnicians.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{safeTechnicians.length}</span> technicians
            </div>
            <div className="text-xs text-gray-500">
              Updated {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTechnicians.map((technician, index) => (
              <div
                key={technician.id}
                className="animate-in fade-in duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TechnicianCard
                  technician={technician}
                  onAssignToWorkOrder={onAssignToWorkOrder}
                  onUpdateStatus={onUpdateStatus}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniciansList;