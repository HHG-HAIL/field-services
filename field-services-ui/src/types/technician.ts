/**
 * Technician type definitions
 * For work order assignments
 */

/**
 * Technician status enum
 */
export const TechnicianStatus = {
  AVAILABLE: 'AVAILABLE',
  BUSY: 'BUSY',
  OFF_DUTY: 'OFF_DUTY',
  ON_BREAK: 'ON_BREAK',
} as const;

export type TechnicianStatus = (typeof TechnicianStatus)[keyof typeof TechnicianStatus];

/**
 * Technician interface
 */
export interface Technician {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status: TechnicianStatus;
  specialties?: string[];
  currentWorkOrders?: number;
  maxWorkOrders?: number;
}

/**
 * Simulated technician data for MVP
 * TODO: Replace with actual API call when technician service is available
 */
export const MOCK_TECHNICIANS: Technician[] = [
  {
    id: 100,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-0101',
    status: TechnicianStatus.AVAILABLE,
    specialties: ['Plumbing', 'HVAC'],
    currentWorkOrders: 2,
    maxWorkOrders: 5,
  },
  {
    id: 101,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '555-0102',
    status: TechnicianStatus.AVAILABLE,
    specialties: ['Electrical', 'General Maintenance'],
    currentWorkOrders: 1,
    maxWorkOrders: 5,
  },
  {
    id: 102,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '555-0103',
    status: TechnicianStatus.BUSY,
    specialties: ['HVAC', 'Refrigeration'],
    currentWorkOrders: 5,
    maxWorkOrders: 5,
  },
  {
    id: 103,
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '555-0104',
    status: TechnicianStatus.AVAILABLE,
    specialties: ['Carpentry', 'General Maintenance'],
    currentWorkOrders: 0,
    maxWorkOrders: 4,
  },
  {
    id: 104,
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    phone: '555-0105',
    status: TechnicianStatus.ON_BREAK,
    specialties: ['Plumbing', 'Electrical'],
    currentWorkOrders: 3,
    maxWorkOrders: 5,
  },
  {
    id: 105,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '555-0106',
    status: TechnicianStatus.AVAILABLE,
    specialties: ['Electrical', 'Security Systems'],
    currentWorkOrders: 1,
    maxWorkOrders: 5,
  },
  {
    id: 106,
    name: 'David Martinez',
    email: 'david.martinez@example.com',
    phone: '555-0107',
    status: TechnicianStatus.OFF_DUTY,
    specialties: ['HVAC', 'Plumbing'],
    currentWorkOrders: 0,
    maxWorkOrders: 5,
  },
  {
    id: 107,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    phone: '555-0108',
    status: TechnicianStatus.AVAILABLE,
    specialties: ['General Maintenance', 'Landscaping'],
    currentWorkOrders: 2,
    maxWorkOrders: 6,
  },
];
