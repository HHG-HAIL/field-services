# Technician Service API Quick Reference

**For field-service-ui developers**

This is a quick reference guide for the new technician service endpoints related to work order assignment.

## Base URL

```
http://localhost:8085/api/v1
```

Production:
```
https://api.example.com/technicians/api/v1
```

## New Endpoints

### 1. Get Work Orders for Technician

**Purpose**: Fetch all work orders assigned to a specific technician.

**Endpoint**:
```
GET /technicians/{id}/work-orders
```

**Example**:
```javascript
// Using the existing API service pattern
const technicianId = 1;
const response = await fetch(`${TECHNICIAN_BASE_URL}/technicians/${technicianId}/work-orders`);
const workOrders = await response.json();
```

**Response**:
```json
[
  {
    "id": 1,
    "workOrderNumber": "WO-20251106123456",
    "title": "HVAC Repair",
    "status": "ASSIGNED",
    "priority": "HIGH",
    "customerId": 100,
    "customerName": "John Doe",
    "serviceAddress": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "scheduledDate": "2025-11-10T10:00:00",
    "startedAt": null,
    "completedAt": null,
    "estimatedCost": 500.00
  }
]
```

**Use Cases**:
- Technician dashboard showing assigned work orders
- Mobile app for technicians to view their schedule
- Workload analysis per technician

### 2. Get Available Technicians

**Purpose**: Fetch all technicians with ACTIVE status who can be assigned work orders.

**Endpoint**:
```
GET /technicians/available
```

**Example**:
```javascript
// Using the existing API service pattern
const response = await fetch(`${TECHNICIAN_BASE_URL}/technicians/available`);
const availableTechnicians = await response.json();
```

**Response**:
```json
[
  {
    "id": 1,
    "employeeId": "EMP-001",
    "firstName": "Jane",
    "lastName": "Tech",
    "email": "jane.tech@example.com",
    "phone": "555-0100",
    "status": "ACTIVE",
    "skillLevel": "SENIOR",
    "skills": ["HVAC", "Plumbing", "Electrical"],
    "city": "Springfield",
    "state": "IL"
  }
]
```

**Use Cases**:
- Dropdown/select list when assigning work orders
- Available technicians dashboard
- Skill-based technician selection

## Integration with Existing UI

### Option 1: Create a new service file

Create `src/services/technician.service.ts`:

```typescript
import apiService from './api.service';

const BASE_PATH = '/api/v1/technicians';

export const technicianService = {
  /**
   * Get all work orders assigned to a technician
   */
  getWorkOrders: (technicianId: number): Promise<WorkOrderSummary[]> => {
    return apiService.get<WorkOrderSummary[]>(`${BASE_PATH}/${technicianId}/work-orders`);
  },

  /**
   * Get available technicians for assignment
   */
  getAvailable: (): Promise<Technician[]> => {
    return apiService.get<Technician[]>(`${BASE_PATH}/available`);
  },
};

export default technicianService;
```

### Option 2: Use existing workOrder.service.ts

The existing `workOrder.service.ts` already has methods for:
- `assignToTechnician(id, technicianId, technicianName)` - Assign work order
- `getByTechnicianId(technicianId)` - Get work orders by technician (uses work-order-service)
- `updateStatus(id, status)` - Update work order status

You can choose to:
1. Keep using `workOrder.service.ts` for work order operations
2. Use `technician.service.ts` for technician-centric operations
3. Both work seamlessly together

## Example UI Components

### Technician Selector Component

```typescript
import React, { useEffect, useState } from 'react';
import technicianService from '../services/technician.service';
import workOrderService from '../services/workOrder.service';

interface TechnicianSelectorProps {
  workOrderId: number;
  onAssigned: () => void;
}

export const TechnicianSelector: React.FC<TechnicianSelectorProps> = ({
  workOrderId,
  onAssigned,
}) => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableTechnicians();
  }, []);

  const loadAvailableTechnicians = async () => {
    setLoading(true);
    try {
      const data = await technicianService.getAvailable();
      setTechnicians(data);
    } catch (error) {
      console.error('Error loading technicians:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (technicianId: number, technicianName: string) => {
    try {
      await workOrderService.assignToTechnician(
        workOrderId,
        technicianId,
        technicianName
      );
      onAssigned();
    } catch (error) {
      console.error('Error assigning work order:', error);
    }
  };

  if (loading) return <div>Loading technicians...</div>;

  return (
    <select onChange={(e) => {
      const tech = technicians.find(t => t.id === Number(e.target.value));
      if (tech) handleAssign(tech.id, `${tech.firstName} ${tech.lastName}`);
    }}>
      <option value="">Select Technician...</option>
      {technicians.map((tech) => (
        <option key={tech.id} value={tech.id}>
          {tech.firstName} {tech.lastName} ({tech.skillLevel}) - {tech.skills.join(', ')}
        </option>
      ))}
    </select>
  );
};
```

### Technician Dashboard Component

```typescript
import React, { useEffect, useState } from 'react';
import technicianService from '../services/technician.service';

interface TechnicianDashboardProps {
  technicianId: number;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  technicianId,
}) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWorkOrders();
  }, [technicianId]);

  const loadWorkOrders = async () => {
    setLoading(true);
    try {
      const data = await technicianService.getWorkOrders(technicianId);
      setWorkOrders(data);
    } catch (error) {
      console.error('Error loading work orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading work orders...</div>;

  return (
    <div>
      <h2>My Work Orders</h2>
      {workOrders.length === 0 ? (
        <p>No work orders assigned</p>
      ) : (
        <ul>
          {workOrders.map((wo) => (
            <li key={wo.id}>
              <strong>{wo.title}</strong> - {wo.status}
              <br />
              {wo.customerName} - {wo.serviceAddress}
              <br />
              Scheduled: {new Date(wo.scheduledDate).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## TypeScript Types

Add these to `src/types/technician.ts`:

```typescript
export interface WorkOrderSummary {
  id: number;
  workOrderNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  customerId: number;
  customerName: string;
  serviceAddress: string;
  city: string;
  state: string;
  zipCode: string;
  scheduledDate: string;
  startedAt: string | null;
  completedAt: string | null;
  estimatedCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  skillLevel: string;
  skills: string[];
  address?: string;
  city: string;
  state: string;
  zipCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
```

## Environment Configuration

Update `.env.development`:

```env
VITE_WORK_ORDER_SERVICE_URL=http://localhost:8084/api/v1
VITE_TECHNICIAN_SERVICE_URL=http://localhost:8085/api/v1
```

## Testing the Integration

### Manual Testing

1. **Start both services**:
   ```bash
   # Terminal 1
   cd work-order-service && mvn spring-boot:run
   
   # Terminal 2
   cd technician-service && mvn spring-boot:run
   ```

2. **Test available technicians**:
   ```bash
   curl http://localhost:8085/api/v1/technicians/available
   ```

3. **Create and assign a work order**:
   ```bash
   # Create work order
   curl -X POST http://localhost:8084/api/v1/work-orders \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","priority":"HIGH","customerId":100}'
   
   # Assign to technician
   curl -X POST "http://localhost:8084/api/v1/work-orders/1/assign?technicianId=1&technicianName=Test%20Tech"
   
   # View technician's work orders
   curl http://localhost:8085/api/v1/technicians/1/work-orders
   ```

### Integration Testing with UI

1. Start both backend services
2. Start the React UI: `npm run dev`
3. Test:
   - Create a work order
   - View available technicians
   - Assign work order to technician
   - View technician's work order list
   - Update work order status

## Error Handling

Both endpoints return consistent error responses:

```json
{
  "timestamp": "2025-11-06T12:00:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Technician not found with id: 999",
  "path": "/api/v1/technicians/999/work-orders"
}
```

Handle errors in your UI:

```typescript
try {
  const workOrders = await technicianService.getWorkOrders(technicianId);
  setWorkOrders(workOrders);
} catch (error) {
  if (error.status === 404) {
    setError('Technician not found');
  } else {
    setError('Failed to load work orders');
  }
}
```

## Notes

- The `/technicians/{id}/work-orders` endpoint integrates with work-order-service in real-time
- If work-order-service is unavailable, it returns an empty array (graceful degradation)
- The `/technicians/available` endpoint only returns technicians with status = "ACTIVE"
- Both endpoints follow the same RESTful patterns as existing endpoints

## Support

For detailed integration documentation, see:
- [Work Order Assignment Integration Guide](./WORK_ORDER_ASSIGNMENT_INTEGRATION.md)
- [Technician Service API Documentation](../technician-service/docs/API_DOCUMENTATION.md)
- [Work Order Service README](../work-order-service/README.md)

## Swagger Documentation

Interactive API documentation available at:
- Technician Service: http://localhost:8085/swagger-ui.html
- Work Order Service: http://localhost:8084/swagger-ui.html
