# Frontend Integration Guide

## Update React App to Use Spring Boot Backend

### 1. API Configuration
Create a new file `src/config/api.ts`:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com' 
  : 'http://localhost:8081';

export const API_ENDPOINTS = {
  WORK_ORDERS: `${API_BASE_URL}/api/work-orders`,
  TECHNICIANS: 'http://localhost:8082/api/technicians',
  SCHEDULES: 'http://localhost:8083/api/schedules',
  WS_ENDPOINT: `ws://localhost:8081/ws`
};

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};
```

### 2. Update Work Order Service
Replace the mock data in your React app with real API calls:

```typescript
// src/services/workOrderService.ts
import { apiRequest, API_ENDPOINTS } from '../config/api';

export const workOrderService = {
  // Get all work orders
  getAll: () => apiRequest(API_ENDPOINTS.WORK_ORDERS),
  
  // Get work order by ID
  getById: (id: number) => apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${id}`),
  
  // Create new work order
  create: (workOrder: any) => apiRequest(API_ENDPOINTS.WORK_ORDERS, {
    method: 'POST',
    body: JSON.stringify(workOrder),
  }),
  
  // Update work order
  update: (id: number, workOrder: any) => apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(workOrder),
  }),
  
  // Assign technician
  assignTechnician: (workOrderId: number, technicianId: number) => 
    apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${workOrderId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ technicianId }),
    }),
  
  // Update status
  updateStatus: (workOrderId: number, status: string) => 
    apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${workOrderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  // Delete work order
  delete: (id: number) => apiRequest(`${API_ENDPOINTS.WORK_ORDERS}/${id}`, {
    method: 'DELETE',
  }),
};
```

### 3. Update Technician Service
```typescript
// src/services/technicianService.ts
import { apiRequest, API_ENDPOINTS } from '../config/api';

export const technicianService = {
  // Get all technicians
  getAll: () => apiRequest(API_ENDPOINTS.TECHNICIANS),
  
  // Get available technicians
  getAvailable: () => apiRequest(`${API_ENDPOINTS.TECHNICIANS}/available`),
  
  // Get technicians by skill
  getBySkill: (skill: string) => apiRequest(`${API_ENDPOINTS.TECHNICIANS}/skill/${skill}`),
  
  // Find best technician for skills
  findBest: (skills: string[]) => apiRequest(`${API_ENDPOINTS.TECHNICIANS}/find-best`, {
    method: 'POST',
    body: JSON.stringify({ skills }),
  }),
  
  // Create technician
  create: (technician: any) => apiRequest(API_ENDPOINTS.TECHNICIANS, {
    method: 'POST',
    body: JSON.stringify(technician),
  }),
  
  // Update technician
  update: (id: number, technician: any) => apiRequest(`${API_ENDPOINTS.TECHNICIANS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(technician),
  }),
  
  // Update status
  updateStatus: (id: number, status: string) => 
    apiRequest(`${API_ENDPOINTS.TECHNICIANS}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
```

### 4. WebSocket Integration
Add WebSocket support for real-time updates:

```typescript
// src/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export const useWebSocket = (onWorkOrderUpdate: (data: any) => void) => {
  const stompClient = useRef<any>(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8081/ws');
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      // Subscribe to work order updates
      stompClient.current.subscribe('/topic/workorders', (message: any) => {
        const workOrder = JSON.parse(message.body);
        onWorkOrderUpdate(workOrder);
      });

      stompClient.current.subscribe('/topic/workorders/updated', (message: any) => {
        const workOrder = JSON.parse(message.body);
        onWorkOrderUpdate(workOrder);
      });

      stompClient.current.subscribe('/topic/workorders/assigned', (message: any) => {
        const workOrder = JSON.parse(message.body);
        onWorkOrderUpdate(workOrder);
      });
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, [onWorkOrderUpdate]);

  return stompClient.current;
};
```

### 5. Install Required Dependencies
Run these commands in your React project:

```bash
npm install sockjs-client @stomp/stompjs
npm install --save-dev @types/sockjs-client
```

### 6. Update App Component
```typescript
// src/App.tsx - Add WebSocket support
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [workOrders, setWorkOrders] = useState([]);
  
  // WebSocket for real-time updates
  useWebSocket((updatedWorkOrder) => {
    setWorkOrders(prev => 
      prev.map(wo => wo.id === updatedWorkOrder.id ? updatedWorkOrder : wo)
    );
  });

  // Load initial data from API
  useEffect(() => {
    workOrderService.getAll()
      .then(setWorkOrders)
      .catch(console.error);
  }, []);

  // Rest of your component...
}
```

### 7. Environment Variables
Create `.env` file in your React app root:

```
REACT_APP_API_BASE_URL=http://localhost:8081
REACT_APP_TECHNICIAN_API_URL=http://localhost:8082
REACT_APP_SCHEDULE_API_URL=http://localhost:8083
REACT_APP_WS_URL=ws://localhost:8081/ws
```

### 8. Development Workflow
1. Start all Spring Boot services:
   ```bash
   # Terminal 1 - Work Order Service
   cd backend/work-order-service && mvn spring-boot:run
   
   # Terminal 2 - Technician Service  
   cd backend/technician-service && mvn spring-boot:run
   
   # Terminal 3 - Schedule Service
   cd backend/schedule-service && mvn spring-boot:run
   ```

2. Start React development server:
   ```bash
   npm start
   ```

3. Your app will now use the real backend APIs with real-time WebSocket updates!

### 9. Testing the Integration
- Open http://localhost:3000 for the React frontend
- Open http://localhost:8081/h2-console for Work Order database
- Open http://localhost:8082/h2-console for Technician database
- Test creating/updating work orders to see real-time updates
- Test technician assignment algorithm