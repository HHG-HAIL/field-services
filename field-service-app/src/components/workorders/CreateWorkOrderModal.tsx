import React, { useState } from 'react';
import { WorkOrder, Technician, Customer } from '../../types';
import Button from '../ui/Button';
import { X, MapPin, Calendar, User } from 'lucide-react';

interface CreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  technicians: Technician[];
  customers: Customer[];
}

const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  technicians,
  customers
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as WorkOrder['priority'],
    customerId: '',
    technicianId: '',
    location: {
      address: '',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    scheduledDate: '',
    estimatedDuration: 60
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    if (!formData.location.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    const selectedTechnician = technicians.find(t => t.id === formData.technicianId);

    const workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: formData.description,
      status: formData.technicianId ? 'assigned' : 'assigned',
      priority: formData.priority,
      customerId: formData.customerId,
      customerName: selectedCustomer?.name || '',
      technicianId: formData.technicianId || undefined,
      technicianName: selectedTechnician?.name || undefined,
      location: {
        address: formData.location.address,
        coordinates: formData.location.coordinates
      },
      scheduledDate: new Date(formData.scheduledDate).toISOString(),
      estimatedDuration: formData.estimatedDuration
    };

    onSubmit(workOrder);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      customerId: '',
      technicianId: '',
      location: {
        address: '',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      scheduledDate: '',
      estimatedDuration: 60
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      customerId,
      location: {
        ...prev.location,
        address: customer?.address || ''
      }
    }));
    if (errors.customerId) {
      setErrors(prev => ({ ...prev, customerId: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gradient-to-br from-gray-900/80 via-primary-900/40 to-secondary-900/60 backdrop-blur-sm" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl p-8 my-8 text-left align-middle transition-all transform bg-gradient-to-br from-white to-gray-50/90 shadow-2xl rounded-2xl border-0 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Create New Work Order</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-full hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transform hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gradient-to-br from-primary-50/50 to-secondary-50/30 p-6 rounded-xl border border-primary-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-2 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-primary-600" />
                </div>
                Basic Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                      errors.title ? 'border-danger-300 focus:border-danger-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Enter work order title"
                  />
                  {errors.title && <p className="mt-2 text-sm text-danger-600 font-medium">{errors.title}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                      errors.description ? 'border-danger-300 focus:border-danger-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Enter detailed description"
                  />
                  {errors.description && <p className="mt-2 text-sm text-danger-600 font-medium">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value as WorkOrder['priority'])}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estimated Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value) || 60)}
                    min="15"
                    step="15"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Customer & Location Section */}
            <div className="bg-gradient-to-br from-emerald-50/50 to-indigo-50/30 p-6 rounded-xl border border-emerald-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-2 rounded-lg mr-3">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                Customer & Location
              </h4>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer *
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                      errors.customerId ? 'border-danger-300 focus:border-danger-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.slaLevel}
                      </option>
                    ))}
                  </select>
                  {errors.customerId && <p className="mt-2 text-sm text-danger-600 font-medium">{errors.customerId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Service Address *
                  </label>
                  <input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => handleInputChange('location', { ...formData.location, address: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                      errors.address ? 'border-danger-300 focus:border-danger-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Enter service address"
                  />
                  {errors.address && <p className="mt-2 text-sm text-danger-600 font-medium">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Scheduling Section */}
            <div className="bg-gradient-to-br from-indigo-50/50 to-secondary-50/30 p-6 rounded-xl border border-indigo-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-2 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                Scheduling & Assignment
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                      errors.scheduledDate ? 'border-danger-300 focus:border-danger-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                  />
                  {errors.scheduledDate && <p className="mt-2 text-sm text-danger-600 font-medium">{errors.scheduledDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Technician (Optional)
                  </label>
                  <select
                    value={formData.technicianId}
                    onChange={(e) => handleInputChange('technicianId', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                  >
                    <option value="">Assign later</option>
                    {technicians
                      .filter(tech => tech.status === 'available')
                      .map(technician => (
                        <option key={technician.id} value={technician.id}>
                          {technician.name} - {technician.skills.join(', ')}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gradient-to-r from-gray-200 to-gray-100">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="px-6 py-3 shadow-lg hover:shadow-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="px-8 py-3 shadow-lg hover:shadow-xl"
              >
                Create Work Order
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkOrderModal;