import { WorkOrder, Technician, Customer, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'dispatcher',
    avatar: 'SJ'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'technician',
    avatar: 'MC'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'manager',
    avatar: 'ER'
  }
];

export const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    phone: '+1-555-0101',
    skills: ['HVAC', 'Electrical', 'Plumbing'],
    status: 'busy',
    currentLocation: 'Downtown Office',
    activeWorkOrders: ['1', '3']
  },
  {
    id: '2',
    name: 'Jessica Williams',
    email: 'jessica.williams@company.com',
    phone: '+1-555-0102',
    skills: ['Electrical', 'Security Systems'],
    status: 'available',
    currentLocation: 'North Branch',
    activeWorkOrders: []
  },
  {
    id: '3',
    name: 'David Kim',
    email: 'david.kim@company.com',
    phone: '+1-555-0103',
    skills: ['HVAC', 'Mechanical'],
    status: 'available',
    currentLocation: 'South District',
    activeWorkOrders: ['2']
  },
  {
    id: '4',
    name: 'Angela Martinez',
    email: 'angela.martinez@company.com',
    phone: '+1-555-0104',
    skills: ['Plumbing', 'General Maintenance'],
    status: 'offline',
    activeWorkOrders: []
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'ABC Corporation',
    email: 'facilities@abc-corp.com',
    phone: '+1-555-0201',
    address: '123 Business Ave, New York, NY 10001',
    slaLevel: 'enterprise'
  },
  {
    id: '2',
    name: 'Downtown Restaurant',
    email: 'manager@downtown-restaurant.com',
    phone: '+1-555-0202',
    address: '456 Food Street, New York, NY 10002',
    slaLevel: 'premium'
  },
  {
    id: '3',
    name: 'City Hospital',
    email: 'maintenance@city-hospital.org',
    phone: '+1-555-0203',
    address: '789 Health Blvd, New York, NY 10003',
    slaLevel: 'enterprise'
  }
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: '1',
    title: 'HVAC System Maintenance',
    description: 'Quarterly maintenance check for main HVAC system. Includes filter replacement and system diagnostics.',
    status: 'in-progress',
    priority: 'medium',
    customerId: '1',
    customerName: 'ABC Corporation',
    technicianId: '1',
    technicianName: 'Mike Chen',
    location: {
      address: '123 Business Ave, New York, NY 10001',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    scheduledDate: '2025-10-06T09:00:00Z',
    estimatedDuration: 120,
    createdAt: '2025-10-05T14:30:00Z',
    updatedAt: '2025-10-06T08:45:00Z'
  },
  {
    id: '2',
    title: 'Kitchen Equipment Repair',
    description: 'Commercial refrigerator not cooling properly. Emergency repair needed.',
    status: 'assigned',
    priority: 'urgent',
    customerId: '2',
    customerName: 'Downtown Restaurant',
    technicianId: '3',
    technicianName: 'David Kim',
    location: {
      address: '456 Food Street, New York, NY 10002',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    scheduledDate: '2025-10-06T11:30:00Z',
    estimatedDuration: 90,
    createdAt: '2025-10-06T08:15:00Z',
    updatedAt: '2025-10-06T08:15:00Z'
  },
  {
    id: '3',
    title: 'Electrical Panel Inspection',
    description: 'Annual safety inspection of electrical panels and emergency lighting systems.',
    status: 'assigned',
    priority: 'high',
    customerId: '3',
    customerName: 'City Hospital',
    technicianId: '1',
    technicianName: 'Mike Chen',
    location: {
      address: '789 Health Blvd, New York, NY 10003',
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    scheduledDate: '2025-10-06T14:00:00Z',
    estimatedDuration: 180,
    createdAt: '2025-10-05T16:20:00Z',
    updatedAt: '2025-10-06T07:30:00Z'
  },
  {
    id: '4',
    title: 'Plumbing Leak Investigation',
    description: 'Water leak reported in basement. Investigate source and provide repair estimate.',
    status: 'completed',
    priority: 'medium',
    customerId: '1',
    customerName: 'ABC Corporation',
    location: {
      address: '123 Business Ave, New York, NY 10001',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    scheduledDate: '2025-10-05T10:00:00Z',
    estimatedDuration: 60,
    createdAt: '2025-10-04T09:45:00Z',
    updatedAt: '2025-10-05T11:30:00Z'
  },
  {
    id: '5',
    title: 'Security System Update',
    description: 'Install new security cameras and update access control system.',
    status: 'assigned',
    priority: 'low',
    customerId: '2',
    customerName: 'Downtown Restaurant',
    location: {
      address: '456 Food Street, New York, NY 10002',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    scheduledDate: '2025-10-07T08:00:00Z',
    estimatedDuration: 240,
    createdAt: '2025-10-05T12:00:00Z',
    updatedAt: '2025-10-05T12:00:00Z'
  }
];