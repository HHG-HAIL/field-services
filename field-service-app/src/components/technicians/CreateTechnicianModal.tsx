import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { X, MapPin, Phone, Mail, Wrench } from 'lucide-react';
import { Technician } from '../../types';

interface CreateTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTechnician: (technician: Omit<Technician, 'id'>) => void;
}

const CreateTechnicianModal: React.FC<CreateTechnicianModalProps> = ({
  isOpen,
  onClose,
  onCreateTechnician
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    status: 'available' as Technician['status'],
    skills: [] as string[],
    activeWorkOrders: [] as string[],
    currentLocation: undefined as { lat: number; lng: number } | undefined
  });

  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableSkills = [
    'HVAC', 'Plumbing', 'Electrical', 'Appliance Repair', 'Installation',
    'Maintenance', 'Emergency Repair', 'Preventive Maintenance', 'Troubleshooting',
    'Air Conditioning', 'Heating', 'Refrigeration', 'Carpentry', 'Painting'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onCreateTechnician(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      status: 'available',
      skills: [],
      activeWorkOrders: [],
      currentLocation: undefined
    });
    setSkillInput('');
    setErrors({});
    onClose();
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-primary-900/40 to-secondary-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50/90 shadow-2xl rounded-2xl border-0 backdrop-blur-sm">
        <div className="flex items-center justify-between p-8 border-b border-gradient-to-r from-gray-200 to-gray-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Add New Technician</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-full hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transform hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information Section */}
          <div className="bg-gradient-to-br from-primary-50/50 to-secondary-50/30 p-6 rounded-xl border border-primary-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-2 rounded-lg mr-3">
                <Wrench className="h-5 w-5 text-primary-600" />
              </div>
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                    errors.name ? 'border-danger-300 focus:border-danger-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="Enter technician name"
                />
                {errors.name && <p className="text-danger-600 font-medium text-sm mt-2">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Technician['status'] })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                  <option value="on-break">On Break</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gradient-to-br from-emerald-50/50 to-indigo-50/30 p-6 rounded-xl border border-emerald-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-2 rounded-lg mr-3">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              Contact Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                    errors.email ? 'border-danger-300 focus:border-danger-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="technician@company.com"
                />
                {errors.email && <p className="text-danger-600 font-medium text-sm mt-2">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                    errors.phone ? 'border-danger-300 focus:border-danger-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-danger-600 font-medium text-sm mt-2">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-secondary-50/30 p-6 rounded-xl border border-indigo-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-2 rounded-lg mr-3">
                <MapPin className="h-5 w-5 text-indigo-600" />
              </div>
              Location
            </h4>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                  errors.location ? 'border-danger-300 focus:border-danger-500' : 'border-gray-300 focus:border-primary-500'
                }`}
                placeholder="City, State"
              />
              {errors.location && <p className="text-danger-600 font-medium text-sm mt-2">{errors.location}</p>}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-gradient-to-br from-warning-50/50 to-danger-50/30 p-6 rounded-xl border border-warning-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-warning-100 to-warning-200 p-2 rounded-lg mr-3">
                <Wrench className="h-5 w-5 text-warning-600" />
              </div>
              Skills & Expertise
            </h4>
            
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Skills * (Select from common skills or add custom)
            </label>
            
            {/* Common Skills */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-600 mb-3">Common Skills:</p>
              <div className="flex flex-wrap gap-3">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    disabled={formData.skills.includes(skill)}
                    className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                      formData.skills.includes(skill)
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-white to-gray-50 border-primary-300 text-primary-700 hover:from-primary-50 hover:to-primary-100 hover:border-primary-400 transform hover:scale-105 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                placeholder="Add custom skill..."
              />
              <Button
                type="button"
                onClick={() => addSkill(skillInput)}
                size="sm"
                variant="secondary"
                disabled={!skillInput.trim()}
                className="px-6 hover:shadow-lg"
              >
                Add
              </Button>
            </div>

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-3">Selected Skills:</p>
                <div className="flex flex-wrap gap-3">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300 shadow-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-primary-600 hover:text-primary-800 p-0.5 rounded-full hover:bg-primary-300 transition-all duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {errors.skills && <p className="text-danger-600 font-medium text-sm mt-2">{errors.skills}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-gradient-to-r from-gray-200 to-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="px-6 py-3 shadow-lg hover:shadow-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              className="px-8 py-3 shadow-lg hover:shadow-xl"
            >
              Add Technician
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTechnicianModal;