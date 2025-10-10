export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customerId: string;
  customerName: string;
  technicianId?: string;
  technicianName?: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  scheduledDate: string;
  estimatedDuration: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  status: 'available' | 'busy' | 'offline' | 'on-break';
  currentLocation?: string | {
    lat: number;
    lng: number;
  };
  activeWorkOrders: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  slaLevel: 'standard' | 'premium' | 'enterprise';
}

export interface Schedule {
  id: string;
  technicianId: string;
  workOrderId: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: 'scheduled' | 'started' | 'completed' | 'rescheduled';
}

export type UserRole = 'dispatcher' | 'technician' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}