import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import PriorityBadge from '../ui/PriorityBadge';
import StatusBadge from '../ui/StatusBadge';
import { X, Calendar, Clock, MapPin, User, AlertCircle, Edit } from 'lucide-react';
import { WorkOrder, Customer, Technician } from '../../types';

interface EditWorkOrderModalProps {
  isOpen: boolean;
  workOrder: WorkOrder | null;
  customers: Customer[];
  technicians: Technician[];
  onClose: () => void;
  onUpdateWorkOrder: (workOrderId: string, updates: Partial<WorkOrder>) => void;
}

const EditWorkOrderModal: React.FC<EditWorkOrderModalProps> = ({
  isOpen,
  workOrder,
  customers,
  technicians,
  onClose,
  onUpdateWorkOrder
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as WorkOrder['priority'],
    status: 'assigned' as WorkOrder['status'],
    customerId: '',
    customerName: '',
    technicianId: '',
    technicianName: '',
    address: '',
    scheduledDate: '',
    estimatedDuration: 60
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when workOrder changes
  useEffect(() => {
    if (workOrder) {
      const scheduledDateTime = new Date(workOrder.scheduledDate);
      const formattedDateTime = scheduledDateTime.toISOString().slice(0, 16);

      setFormData({
        title: workOrder.title,
        description: workOrder.description,
        priority: workOrder.priority,
        status: workOrder.status,
        customerId: workOrder.customerId,
        customerName: workOrder.customerName,
        technicianId: workOrder.technicianId || '',
        technicianName: workOrder.technicianName || '',
        address: workOrder.location.address,
        scheduledDate: formattedDateTime,
        estimatedDuration: workOrder.estimatedDuration
      });
    }
  }, [workOrder]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date and time is required';
    } else {
      const selectedDate = new Date(formData.scheduledDate);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.scheduledDate = 'Scheduled date cannot be in the past';
      }
    }

    if (formData.estimatedDuration < 15) {
      newErrors.estimatedDuration = 'Duration must be at least 15 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !workOrder) {
      return;
    }

    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    const selectedTechnician = technicians.find(t => t.id === formData.technicianId);

    const updates: Partial<WorkOrder> = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      customerId: formData.customerId,
      customerName: selectedCustomer?.name || formData.customerName,
      technicianId: formData.technicianId || undefined,
      technicianName: selectedTechnician?.name || undefined,
      location: {
        ...workOrder.location,
        address: formData.address
      },
      scheduledDate: new Date(formData.scheduledDate).toISOString(),
      estimatedDuration: formData.estimatedDuration,
      updatedAt: new Date().toISOString()
    };

    onUpdateWorkOrder(workOrder.id, updates);
    onClose();
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || '',
      address: customer?.address || formData.address
    });
  };

  const handleTechnicianChange = (technicianId: string) => {
    const technician = technicians.find(t => t.id === technicianId);
    setFormData({
      ...formData,
      technicianId,
      technicianName: technician?.name || ''
    });
  };

  const availableTechnicians = technicians.filter(t => 
    t.status === 'available' || t.id === formData.technicianId
  );

  if (!isOpen || !workOrder) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <Card className="w-full max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-white to-gray-50/30 shadow-2xl border-0 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-primary-50/30 to-secondary-50/30">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Edit Work Order
              </h2>
              <p className="text-sm text-gray-500 font-medium">Work Order #{workOrder.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Current Status Display */}
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-6 rounded-xl border border-blue-200/30 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                Current Status
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={workOrder.status} />
                <PriorityBadge priority={workOrder.priority} />
                {workOrder.technicianName && (
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full border border-emerald-200">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">
                      {workOrder.technicianName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/50 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                📝 Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-primary-300'
                    }`}
                    placeholder="Work order title"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🚨 Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as WorkOrder['priority'] })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-gray-300 focus:border-primary-300 transition-all duration-200"
                  >
                    <option value="low">🌿 Low Priority</option>
                    <option value="medium">⚡ Medium Priority</option>
                    <option value="high">🔥 High Priority</option>
                    <option value="urgent">🚨 Urgent Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📊 Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as WorkOrder['status'] })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-gray-300 focus:border-primary-300 transition-all duration-200"
                  >
                    <option value="assigned">📋 Assigned</option>
                    <option value="in-progress">🔄 In Progress</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/50 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-primary-300'
                }`}
                placeholder="Detailed description of the work to be performed..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Customer & Location */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/50 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Customer & Location
              </h3>
              <div className="space-y-6">
                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer *
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.customerId ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-primary-300'
                    }`}
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.slaLevel.toUpperCase()} SLA
                      </option>
                    ))}
                  </select>
                  {errors.customerId && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.customerId}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Service Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-gray-300 focus:border-primary-300 transition-all duration-200"
                    placeholder="Service location address"
                  />
                </div>
              </div>
            </div>

            {/* Scheduling & Assignment */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/50 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Scheduling & Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.scheduledDate ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-primary-300'
                    }`}
                  />
                  {errors.scheduledDate && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.scheduledDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Estimated Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 60 })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.estimatedDuration ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-primary-300'
                    }`}
                  />
                  {errors.estimatedDuration && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.estimatedDuration}
                    </p>
                  )}
                </div>
              </div>

              {/* Technician Assignment */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Assigned Technician
                </label>
                <select
                  value={formData.technicianId}
                  onChange={(e) => handleTechnicianChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-gray-300 focus:border-primary-300 transition-all duration-200"
                >
                  <option value="">👤 Unassigned</option>
                  {availableTechnicians.map((technician) => (
                    <option key={technician.id} value={technician.id}>
                      {technician.name} - {technician.status} ({technician.activeWorkOrders?.length || 0} active jobs)
                    </option>
                  ))}
                </select>
                {availableTechnicians.length === 0 && (
                  <div className="flex items-center mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
                    <span className="text-sm text-amber-800 font-medium">No available technicians at this time</span>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200/50">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                className="px-6 py-3 text-sm font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg"
              >
                Update Work Order
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default EditWorkOrderModal;