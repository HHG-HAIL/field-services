# Work Order Service API Integration

This document describes the integration between the React UI and the work-order-service backend APIs.

## Overview

The React UI now provides complete integration with all work-order-service API endpoints, supporting:

- ✅ **CRUD Operations**: Create, Read, Update, Delete work orders
- ✅ **Advanced Queries**: Filter by status, priority, customer, technician, overdue
- ✅ **Assignment**: Assign work orders to technicians
- ✅ **Status Management**: Update work order status with automatic timestamp handling

## Architecture

### Service Layer (`workOrder.service.ts`)

The service layer provides a clean interface to backend APIs:

```typescript
import workOrderService from './services/workOrder.service';

// Basic CRUD
const workOrders = await workOrderService.getAll(0, 20);
const workOrder = await workOrderService.getById(1);
const created = await workOrderService.create(data);
const updated = await workOrderService.update(1, data);
await workOrderService.delete(1);

// Advanced queries
const byStatus = await workOrderService.getByStatus('PENDING');
const byPriority = await workOrderService.getByPriority('HIGH');
const byCustomer = await workOrderService.getByCustomerId(100);
const byTechnician = await workOrderService.getByTechnicianId(200);
const overdue = await workOrderService.getOverdue();

// Actions
const assigned = await workOrderService.assignToTechnician(1, 200, 'Jane Tech');
const statusUpdated = await workOrderService.updateStatus(1, 'IN_PROGRESS');
```

### Custom Hooks

#### `useApi<T>` - Generic API Hook

Provides loading state, error handling, and execution control for any API call:

```typescript
import { useApi } from './hooks/useApi';
import workOrderService from './services/workOrder.service';

const { data, loading, error, execute } = useApi(workOrderService.getAll);

// Execute the API call
await execute(0, 20);
```

#### `useWorkOrders` - Work Order Operations Hook

Specialized hook for managing work order operations:

```typescript
import { useWorkOrders } from './hooks/useWorkOrders';

const {
  workOrders,
  isLoading,
  error,
  loadAll,
  loadByStatus,
  loadByPriority,
  assignToTechnician,
  updateStatus,
} = useWorkOrders();

// Load work orders
await loadAll();
await loadByStatus('PENDING');

// Actions
await assignToTechnician(1, 200, 'Jane Tech');
await updateStatus(1, 'IN_PROGRESS');
```

## Components

### WorkOrderList

Displays work orders in a table format with:
- Status and priority badges with color coding
- Formatted dates
- Action buttons (View, Edit, Delete)
- Loading and empty states

### WorkOrderForm

Handles create and edit operations with:
- Form validation (email, ZIP code, numeric fields)
- Conditional fields (status only shown in edit mode)
- Customer information (editable only in create mode)
- Service location details
- Scheduling and assignment
- Cost information
- Additional notes

### WorkOrderDetails

Displays complete work order information with:
- Basic information (title, description, status, priority)
- Customer information
- Service location
- Scheduling and assignment details
- Cost information
- Notes
- Metadata (created, updated, version)
- Quick actions section

### WorkOrderActions

Provides quick actions for:
- **Assign Technician**: Assign or reassign to a technician
- **Update Status**: Change work order status

Features:
- Inline forms with validation
- Loading states
- Automatic list refresh on success

### WorkOrderFilters

Advanced filtering options:
- **All Work Orders**: Default view
- **By Status**: Filter by specific status
- **By Priority**: Filter by priority level
- **By Customer ID**: View customer's work orders
- **By Technician ID**: View technician's work orders
- **Overdue Only**: Show overdue work orders

### WorkOrders (Main Component)

Orchestrates all work order operations:
- Manages view modes (list, create, edit, view)
- Handles CRUD operations
- Manages filtering
- Coordinates actions (assign, status update)
- Error handling and loading states

## API Endpoints Mapping

| Backend Endpoint | Service Method | Component Usage |
|-----------------|----------------|----------------|
| `GET /api/v1/work-orders` | `getAll(page, size)` | WorkOrders (list view) |
| `GET /api/v1/work-orders/{id}` | `getById(id)` | WorkOrderDetails |
| `GET /api/v1/work-orders/number/{number}` | `getByWorkOrderNumber(number)` | Future search feature |
| `GET /api/v1/work-orders/status/{status}` | `getByStatus(status)` | WorkOrderFilters |
| `GET /api/v1/work-orders/priority/{priority}` | `getByPriority(priority)` | WorkOrderFilters |
| `GET /api/v1/work-orders/customer/{id}` | `getByCustomerId(id)` | WorkOrderFilters |
| `GET /api/v1/work-orders/technician/{id}` | `getByTechnicianId(id)` | WorkOrderFilters |
| `GET /api/v1/work-orders/overdue` | `getOverdue()` | WorkOrderFilters |
| `POST /api/v1/work-orders` | `create(request)` | WorkOrderForm |
| `PUT /api/v1/work-orders/{id}` | `update(id, request)` | WorkOrderForm |
| `DELETE /api/v1/work-orders/{id}` | `delete(id)` | WorkOrderList, WorkOrderDetails |
| `POST /api/v1/work-orders/{id}/assign` | `assignToTechnician(id, techId, name)` | WorkOrderActions |
| `PATCH /api/v1/work-orders/{id}/status` | `updateStatus(id, status)` | WorkOrderActions |

## Error Handling

### API Service Layer

The `api.service.ts` provides centralized error handling:

```typescript
try {
  const result = await workOrderService.create(data);
  // Success handling
} catch (error) {
  if (error instanceof ApiException) {
    console.error(`API Error ${error.status}: ${error.message}`);
    // Display error to user
  }
}
```

### Component Level

Components use the `useApi` hook for automatic error state management:

```typescript
const { data, loading, error, execute } = useApi(workOrderService.getAll);

// In render:
{error && (
  <div className="error">
    <strong>Error:</strong> {error}
  </div>
)}
```

## Loading States

All async operations display loading states:

1. **List Loading**: Shows "Loading work orders..." message
2. **Action Loading**: Disables buttons and shows loading text
3. **Form Submission**: Shows "Saving..." on submit button

## Data Flow

### Create Work Order Flow

```
User → WorkOrderForm → create() → workOrderService.create() 
  → apiService.post() → Backend API → Response
  → Update State → Refresh List → Show List View
```

### Assign Technician Flow

```
User → WorkOrderActions → assignToTechnician() 
  → workOrderService.assignToTechnician() → apiService.post()
  → Backend API → Response → Update Work Order → Refresh List
```

### Filter Work Orders Flow

```
User → WorkOrderFilters → handleFilter() → loadWorkOrders()
  → workOrderService.getByStatus() → apiService.get()
  → Backend API → Response → Update Work Orders List
```

## Configuration

### Environment Variables

Configure the backend API URL in `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

For production, use `.env.production`:

```env
VITE_API_BASE_URL=https://api.example.com/api/v1
```

### CORS Configuration

The backend work-order-service is configured to accept cross-origin requests:

```java
@CrossOrigin(origins = "*", methods = {
  RequestMethod.GET, 
  RequestMethod.POST, 
  RequestMethod.PUT, 
  RequestMethod.DELETE, 
  RequestMethod.PATCH, 
  RequestMethod.OPTIONS
})
```

## Testing

### Manual Testing

1. **Start Backend Service**:
   ```bash
   cd work-order-service
   mvn spring-boot:run
   ```

2. **Start React UI**:
   ```bash
   cd field-services-ui
   npm run dev
   ```

3. **Test Operations**:
   - Create a new work order
   - View work order details
   - Edit work order
   - Assign to technician
   - Update status
   - Filter by status/priority
   - Delete work order

### API Testing with Backend

Ensure the backend is running on `http://localhost:8080` (or configured URL) and test:

```bash
# Test work orders endpoint
curl http://localhost:8080/api/v1/work-orders

# Test create
curl -X POST http://localhost:8080/api/v1/work-orders \
  -H "Content-Type: application/json" \
  -d '{"title":"Test WO","priority":"NORMAL","customerId":100}'
```

## Best Practices Implemented

1. ✅ **Separation of Concerns**: Service layer separated from components
2. ✅ **Error Handling**: Comprehensive error handling at all levels
3. ✅ **Loading States**: User feedback during async operations
4. ✅ **Type Safety**: Full TypeScript typing for all API calls
5. ✅ **Reusable Hooks**: Generic `useApi` hook for any API call
6. ✅ **Validation**: Form validation before API calls
7. ✅ **Professional UI**: Clean, consistent design with proper feedback
8. ✅ **RESTful Patterns**: Following REST conventions for API calls

## Future Enhancements

Potential improvements:
- [ ] Add React Query for advanced caching and synchronization
- [ ] Implement optimistic updates
- [ ] Add WebSocket support for real-time updates
- [ ] Implement infinite scroll for large lists
- [ ] Add advanced search with multiple filters
- [ ] Export work orders (CSV, PDF)
- [ ] Bulk operations (assign multiple, update multiple)
- [ ] Work order templates
- [ ] Mobile-responsive enhancements

## Troubleshooting

### Common Issues

**Issue**: API calls fail with CORS errors
- **Solution**: Ensure backend has CORS configured correctly
- Check `@CrossOrigin` annotation on controller

**Issue**: 404 errors on API calls
- **Solution**: Verify `VITE_API_BASE_URL` in environment variables
- Ensure backend service is running
- Check endpoint paths match backend controller

**Issue**: Data not updating after actions
- **Solution**: Verify `loadWorkOrders()` is called after mutations
- Check network tab for successful API responses

## Support

For issues or questions:
1. Check the [CONTRIBUTING.md](../CONTRIBUTING.md) guide
2. Review backend API documentation at `/swagger-ui.html`
3. Check backend logs for API errors
4. Review browser console for client-side errors
