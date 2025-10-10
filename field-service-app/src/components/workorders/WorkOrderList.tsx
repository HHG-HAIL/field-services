import React, { useState } from 'react';
import { WorkOrder } from '../../types';
import WorkOrderCard from './WorkOrderCard';
import { Search, Filter, Plus } from 'lucide-react';
import Button from '../ui/Button';

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onStatusChange?: (workOrderId: string, newStatus: WorkOrder['status']) => void;
  onAssignTechnician?: (workOrderId: string) => void;
  onUnassignTechnician?: (workOrderId: string) => void;
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
  onChangeTechnician?: (workOrder: WorkOrder) => void;
  onCreateNew?: () => void;
  showActions?: boolean;
  title?: string;
}

const WorkOrderList: React.FC<WorkOrderListProps> = ({ 
  workOrders, 
  onStatusChange, 
  onAssignTechnician, 
  onUnassignTechnician,
  onEditWorkOrder,
  onChangeTechnician,
  onCreateNew,
  showActions = true,
  title = "Work Orders"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredWorkOrders = workOrders.filter(workOrder => {
    const matchesSearch = 
      workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || workOrder.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || workOrder.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusCounts = () => {
    return {
      all: workOrders.length,
      assigned: workOrders.filter(wo => wo.status === 'assigned').length,
      'in-progress': workOrders.filter(wo => wo.status === 'in-progress').length,
      completed: workOrders.filter(wo => wo.status === 'completed').length,
      cancelled: workOrders.filter(wo => wo.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-200/50">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{title}</h2>
        {onCreateNew && (
          <Button onClick={onCreateNew} variant="primary" className="shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
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
                placeholder="Search work orders..."
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
              <option value="assigned">📋 Assigned ({statusCounts.assigned})</option>
              <option value="in-progress">🔄 In Progress ({statusCounts['in-progress']})</option>
              <option value="completed">✅ Completed ({statusCounts.completed})</option>
              <option value="cancelled">❌ Cancelled ({statusCounts.cancelled})</option>
            </select>
          </div>
          
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            >
              <option value="all">All Priority</option>
              <option value="urgent">� Urgent</option>
              <option value="high">🔥 High</option>
              <option value="medium">⚡ Medium</option>
              <option value="low">🌿 Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Work Orders Grid */}
      {filteredWorkOrders.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-lg border-0 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Filter className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No work orders found</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkOrders.map((workOrder) => (
            <WorkOrderCard
              key={workOrder.id}
              workOrder={workOrder}
              onStatusChange={onStatusChange}
              onAssignTechnician={onAssignTechnician}
              onUnassignTechnician={onUnassignTechnician}
              onEditWorkOrder={onEditWorkOrder}
              onChangeTechnician={onChangeTechnician}
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkOrderList;