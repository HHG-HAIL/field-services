# Work Order Assignment Integration Guide

## Overview

This document describes the integration between `technician-service` and `work-order-service` for assigning and tracking work orders. It provides comprehensive API documentation, workflow descriptions, and integration contracts.

**Version**: 1.0  
**Last Updated**: November 2025

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Integration Endpoints](#integration-endpoints)
- [Assignment Workflows](#assignment-workflows)
- [API Payloads](#api-payloads)
- [Integration Contracts](#integration-contracts)
- [Error Handling](#error-handling)
- [Testing Guide](#testing-guide)
- [UI Integration](#ui-integration)

## Architecture Overview

### Service Communication

The work order assignment system involves three main components:

1. **work-order-service** (Port 8084)
   - Manages work order lifecycle
   - Stores assignment information
   - Provides work order CRUD operations

2. **technician-service** (Port 8085)
   - Manages technician profiles
   - Integrates with work-order-service to fetch assigned work orders
   - Provides available technicians list

3. **field-service-ui**
   - React-based frontend
   - Integrates with both services
   - Provides user interface for assignment operations

### Communication Pattern

```
field-service-ui
    |
    |-- POST /api/v1/work-orders/{id}/assign --> work-order-service
    |                                                |
    |                                                v
    |                                           Updates WorkOrder
    |                                           (assignedTechnicianId,
    |                                            assignedTechnicianName,
    |                                            status = ASSIGNED)
    |
    |-- GET /api/v1/technicians/available --> technician-service
    |
    |-- GET /api/v1/technicians/{id}/work-orders --> technician-service
                                                          |
                                                          v
                                                    Fetches from work-order-service
                                                    GET /api/v1/work-orders/technician/{id}
```

## Integration Endpoints

### Work Order Service Endpoints

#### 1. Assign Work Order to Technician

**Endpoint**: `POST /api/v1/work-orders/{id}/assign`

**Description**: Assigns a work order to a technician and updates the status to ASSIGNED.

**Request**:
```http
POST /api/v1/work-orders/1/assign?technicianId=200&technicianName=Jane%20Tech
```

**Query Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| technicianId | Long | Yes | Technician's unique ID | 200 |
| technicianName | String | Yes | Technician's full name | Jane Tech |

**Response**: `200 OK`
```json
{
  "id": 1,
  "workOrderNumber": "WO-20251106123456",
  "title": "HVAC Repair",
  "description": "Air conditioning unit not cooling",
  "status": "ASSIGNED",
  "priority": "HIGH",
  "customerId": 100,
  "customerName": "John Doe",
  "customerPhone": "555-1234",
  "customerEmail": "john@example.com",
  "serviceAddress": "123 Main St",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62701",
  "assignedTechnicianId": 200,
  "assignedTechnicianName": "Jane Tech",
  "scheduledDate": "2025-11-10T10:00:00",
  "startedAt": null,
  "completedAt": null,
  "estimatedCost": 500.00,
  "actualCost": null,
  "notes": null,
  "items": [],
  "createdAt": "2025-11-06T10:00:00",
  "updatedAt": "2025-11-06T12:00:00",
  "version": 1
}
```

**Error Responses**:

`404 Not Found` - Work order does not exist
```json
{
  "timestamp": "2025-11-06T12:00:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Work order not found with id: 1",
  "path": "/api/v1/work-orders/1/assign"
}
```

`400 Bad Request` - Work order cannot be assigned (already completed or cancelled)
```json
{
  "timestamp": "2025-11-06T12:00:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Cannot assign work order with status: COMPLETED",
  "path": "/api/v1/work-orders/1/assign"
}
```

#### 2. Get Work Orders by Technician

**Endpoint**: `GET /api/v1/work-orders/technician/{technicianId}`

**Description**: Retrieves all work orders assigned to a specific technician.

**Request**:
```http
GET /api/v1/work-orders/technician/200
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| technicianId | Long | Yes | Technician's unique ID |

**Response**: `200 OK`
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
    "assignedTechnicianId": 200,
    "assignedTechnicianName": "Jane Tech",
    "scheduledDate": "2025-11-10T10:00:00",
    "createdAt": "2025-11-06T10:00:00",
    "updatedAt": "2025-11-06T12:00:00"
  }
]
```

#### 3. Update Work Order Status

**Endpoint**: `PATCH /api/v1/work-orders/{id}/status`

**Description**: Updates the status of a work order. Automatically sets timestamps based on status transitions.

**Request**:
```http
PATCH /api/v1/work-orders/1/status?status=IN_PROGRESS
```

**Query Parameters**:
| Parameter | Type | Required | Description | Allowed Values |
|-----------|------|----------|-------------|----------------|
| status | String | Yes | New status | PENDING, ASSIGNED, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED |

**Response**: `200 OK`
```json
{
  "id": 1,
  "workOrderNumber": "WO-20251106123456",
  "title": "HVAC Repair",
  "status": "IN_PROGRESS",
  "startedAt": "2025-11-10T10:05:00",
  "assignedTechnicianId": 200,
  "assignedTechnicianName": "Jane Tech",
  "createdAt": "2025-11-06T10:00:00",
  "updatedAt": "2025-11-10T10:05:00"
}
```

### Technician Service Endpoints

#### 4. Get Work Orders for Technician

**Endpoint**: `GET /api/v1/technicians/{id}/work-orders`

**Description**: Retrieves all work orders assigned to a specific technician. This endpoint integrates with work-order-service.

**Request**:
```http
GET /api/v1/technicians/200/work-orders
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Technician's unique ID |

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "workOrderNumber": "WO-20251106123456",
    "title": "HVAC Repair",
    "description": "Air conditioning unit not cooling",
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
    "estimatedCost": 500.00,
    "createdAt": "2025-11-06T10:00:00",
    "updatedAt": "2025-11-06T12:00:00"
  }
]
```

**Notes**:
- Returns empty array if technician has no assigned work orders
- If work-order-service is unavailable, returns empty array (graceful degradation)
- Work order data is fetched in real-time from work-order-service

#### 5. Get Available Technicians

**Endpoint**: `GET /api/v1/technicians/available`

**Description**: Retrieves all technicians with ACTIVE status who are available for work order assignment.

**Request**:
```http
GET /api/v1/technicians/available
```

**Response**: `200 OK`
```json
[
  {
    "id": 200,
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

**Notes**:
- Only returns technicians with status = ACTIVE
- Useful for UI components showing available technicians for assignment

## Assignment Workflows

### Workflow 1: Assign Work Order to Technician

**Use Case**: A dispatcher assigns a new work order to an available technician.

**Steps**:

1. **Get Available Technicians**
   ```
   GET /api/v1/technicians/available
   ```
   Returns list of active technicians.

2. **Select Technician**
   User selects a technician from the list (e.g., ID: 200, Name: "Jane Tech").

3. **Assign Work Order**
   ```
   POST /api/v1/work-orders/1/assign?technicianId=200&technicianName=Jane%20Tech
   ```
   Work order status changes to ASSIGNED.

4. **Verify Assignment**
   ```
   GET /api/v1/technicians/200/work-orders
   ```
   Confirms work order appears in technician's list.

**Sequence Diagram**:
```
UI -> technician-service: GET /api/v1/technicians/available
UI <- technician-service: List of active technicians
UI -> work-order-service: POST /api/v1/work-orders/1/assign
work-order-service: Update work order (technicianId=200, status=ASSIGNED)
UI <- work-order-service: Updated work order
UI -> technician-service: GET /api/v1/technicians/200/work-orders
technician-service -> work-order-service: GET /api/v1/work-orders/technician/200
technician-service <- work-order-service: Work order list
UI <- technician-service: Work order list
```

### Workflow 2: Technician Views Assigned Work Orders

**Use Case**: A technician logs in and views their assigned work orders.

**Steps**:

1. **Authenticate Technician**
   (Authentication details depend on your auth system)

2. **Get Technician's Work Orders**
   ```
   GET /api/v1/technicians/200/work-orders
   ```
   Returns all work orders assigned to the technician.

3. **Display Work Orders**
   UI displays work orders sorted by priority and scheduled date.

### Workflow 3: Update Work Order Status During Service

**Use Case**: A technician starts working on a work order and updates its status.

**Steps**:

1. **Technician Starts Work**
   ```
   PATCH /api/v1/work-orders/1/status?status=IN_PROGRESS
   ```
   System automatically sets `startedAt` timestamp.

2. **Technician Completes Work**
   ```
   PATCH /api/v1/work-orders/1/status?status=COMPLETED
   ```
   System automatically sets `completedAt` timestamp.

3. **Refresh Work Order List**
   ```
   GET /api/v1/technicians/200/work-orders
   ```
   Updated status is reflected in the list.

### Workflow 4: Reassign Work Order

**Use Case**: A work order needs to be reassigned to a different technician.

**Steps**:

1. **Get Current Assignment**
   ```
   GET /api/v1/work-orders/1
   ```
   Current technician: ID 200

2. **Get Available Technicians**
   ```
   GET /api/v1/technicians/available
   ```

3. **Reassign to New Technician**
   ```
   POST /api/v1/work-orders/1/assign?technicianId=201&technicianName=John%20Smith
   ```
   Work order is now assigned to technician 201.

## API Payloads

### Work Order Assignment Request

**Query Parameters**:
```
technicianId: Long (required)
technicianName: String (required)
```

**Example**:
```
POST /api/v1/work-orders/1/assign?technicianId=200&technicianName=Jane%20Tech
```

### Work Order Status Update Request

**Query Parameters**:
```
status: String (required)
```

**Allowed Status Values**:
- `PENDING`: Work order created but not yet assigned
- `ASSIGNED`: Assigned to a technician
- `IN_PROGRESS`: Currently being worked on
- `ON_HOLD`: Paused or put on hold
- `COMPLETED`: Successfully completed
- `CANCELLED`: Cancelled

**Example**:
```
PATCH /api/v1/work-orders/1/status?status=IN_PROGRESS
```

### Work Order Summary Response

**Structure**:
```json
{
  "id": Long,
  "workOrderNumber": String,
  "title": String,
  "description": String,
  "status": String,
  "priority": String,
  "customerId": Long,
  "customerName": String,
  "serviceAddress": String,
  "city": String,
  "state": String,
  "zipCode": String,
  "scheduledDate": DateTime,
  "startedAt": DateTime,
  "completedAt": DateTime,
  "estimatedCost": Decimal,
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

### Technician Summary Response

**Structure**:
```json
{
  "id": Long,
  "employeeId": String,
  "firstName": String,
  "lastName": String,
  "email": String,
  "phone": String,
  "status": String,
  "skillLevel": String,
  "skills": [String],
  "city": String,
  "state": String
}
```

## Integration Contracts

### Contract 1: Work Order Assignment

**Provider**: work-order-service  
**Consumer**: field-service-ui

**Guarantee**:
- Work order status will be updated to ASSIGNED
- assignedTechnicianId and assignedTechnicianName will be set
- Returns 404 if work order doesn't exist
- Returns 400 if work order cannot be assigned (COMPLETED or CANCELLED status)

### Contract 2: Technician Work Orders

**Provider**: technician-service  
**Consumer**: field-service-ui

**Guarantee**:
- Returns all work orders assigned to the specified technician
- Returns empty array if no work orders are assigned
- Returns empty array if work-order-service is unavailable (graceful degradation)
- Returns 404 if technician doesn't exist

### Contract 3: Available Technicians

**Provider**: technician-service  
**Consumer**: field-service-ui

**Guarantee**:
- Returns only technicians with status = ACTIVE
- Returns empty array if no active technicians exist
- Returns all relevant technician information for assignment decision

### Contract 4: Status Transitions

**Provider**: work-order-service  
**Consumer**: field-service-ui, technician-service

**Guarantee**:
- Automatic timestamp management:
  - `startedAt` set when status changes to IN_PROGRESS (if not already set)
  - `completedAt` set when status changes to COMPLETED (if not already set)
- Prevents invalid transitions:
  - Cannot change status from COMPLETED or CANCELLED
- Returns 400 for invalid transitions

## Error Handling

### Error Response Format

All services use a consistent error response format:

```json
{
  "timestamp": "2025-11-06T12:00:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Work order not found with id: 1",
  "path": "/api/v1/work-orders/1"
}
```

### Common Error Scenarios

#### 1. Work Order Not Found

**Status**: `404 Not Found`

**Cause**: Attempting to assign or update a work order that doesn't exist.

**Resolution**: Verify work order ID exists before attempting operation.

#### 2. Technician Not Found

**Status**: `404 Not Found`

**Cause**: Requesting work orders for a technician that doesn't exist.

**Resolution**: Verify technician ID exists before requesting work orders.

#### 3. Invalid Status Transition

**Status**: `400 Bad Request`

**Cause**: Attempting to assign a completed or cancelled work order, or changing status from a terminal state.

**Resolution**: Check current work order status before attempting operation.

#### 4. Service Unavailable

**Status**: Service returns empty array (graceful degradation)

**Cause**: work-order-service is unavailable when technician-service attempts to fetch work orders.

**Resolution**: System returns empty array instead of error. Monitor service health and retry.

### Retry Strategy

For inter-service communication failures:
1. Use timeout: 5 seconds for connection, 10 seconds for read
2. Return empty results on failure (graceful degradation)
3. Log errors for monitoring and alerting

## Testing Guide

### Unit Testing

#### Test Work Order Assignment

```bash
# Assign work order
curl -X POST "http://localhost:8084/api/v1/work-orders/1/assign?technicianId=200&technicianName=Jane%20Tech"

# Verify assignment
curl -X GET "http://localhost:8084/api/v1/work-orders/1"
```

Expected: Work order shows technicianId=200, status=ASSIGNED

#### Test Get Available Technicians

```bash
curl -X GET "http://localhost:8085/api/v1/technicians/available"
```

Expected: Returns list of technicians with status=ACTIVE

#### Test Get Technician Work Orders

```bash
curl -X GET "http://localhost:8085/api/v1/technicians/200/work-orders"
```

Expected: Returns list of work orders assigned to technician 200

### Integration Testing

#### Test Complete Assignment Workflow

```bash
# 1. Create a work order
curl -X POST "http://localhost:8084/api/v1/work-orders" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Work Order",
    "priority": "HIGH",
    "customerId": 100,
    "customerName": "Test Customer",
    "scheduledDate": "2025-11-10T10:00:00"
  }'

# 2. Get available technicians
curl -X GET "http://localhost:8085/api/v1/technicians/available"

# 3. Assign to first available technician (assume ID 1)
curl -X POST "http://localhost:8084/api/v1/work-orders/1/assign?technicianId=1&technicianName=Test%20Tech"

# 4. Verify in technician's work order list
curl -X GET "http://localhost:8085/api/v1/technicians/1/work-orders"

# 5. Update status to IN_PROGRESS
curl -X PATCH "http://localhost:8084/api/v1/work-orders/1/status?status=IN_PROGRESS"

# 6. Update status to COMPLETED
curl -X PATCH "http://localhost:8084/api/v1/work-orders/1/status?status=COMPLETED"
```

### Error Case Testing

```bash
# Test assigning non-existent work order
curl -X POST "http://localhost:8084/api/v1/work-orders/99999/assign?technicianId=1&technicianName=Test"
# Expected: 404 Not Found

# Test assigning completed work order
curl -X POST "http://localhost:8084/api/v1/work-orders/1/assign?technicianId=1&technicianName=Test"
# Expected: 400 Bad Request (if already completed)

# Test getting work orders for non-existent technician
curl -X GET "http://localhost:8085/api/v1/technicians/99999/work-orders"
# Expected: 404 Not Found
```

## UI Integration

### React Component Integration

The field-service-ui integrates with these APIs using the following services:

#### workOrder.service.ts

```typescript
// Assign work order to technician
assignToTechnician: (
  id: number,
  technicianId: number,
  technicianName: string,
): Promise<WorkOrder> => {
  return apiService.post<WorkOrder>(`${BASE_PATH}/${id}/assign`, null, {
    params: {
      technicianId: String(technicianId),
      technicianName,
    },
  });
}

// Get work orders by technician
getByTechnicianId: (technicianId: number): Promise<WorkOrder[]> => {
  return apiService.get<WorkOrder[]>(`${BASE_PATH}/technician/${technicianId}`);
}

// Update work order status
updateStatus: (id: number, status: WorkOrderStatus): Promise<WorkOrder> => {
  return apiService.patch<WorkOrder>(`${BASE_PATH}/${id}/status`, null, {
    params: { status },
  });
}
```

### Environment Configuration

Configure service URLs in `.env.development`:

```env
VITE_WORK_ORDER_SERVICE_URL=http://localhost:8084/api/v1
VITE_TECHNICIAN_SERVICE_URL=http://localhost:8085/api/v1
```

For production, use `.env.production`:

```env
VITE_WORK_ORDER_SERVICE_URL=https://api.example.com/work-orders/api/v1
VITE_TECHNICIAN_SERVICE_URL=https://api.example.com/technicians/api/v1
```

### CORS Configuration

Both services are configured to accept cross-origin requests:

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

## Configuration

### Technician Service Configuration

Configure work-order-service URL in `application.yml`:

```yaml
integration:
  work-order-service:
    url: ${WORK_ORDER_SERVICE_URL:http://localhost:8084}
```

### Environment Variables

**Technician Service**:
- `WORK_ORDER_SERVICE_URL`: URL of work-order-service (default: http://localhost:8084)

**Work Order Service**:
- No additional configuration needed for assignment features

## Monitoring and Observability

### Health Checks

Both services expose health check endpoints:

```bash
# Technician Service
curl http://localhost:8085/actuator/health

# Work Order Service
curl http://localhost:8084/actuator/health
```

### Logging

All assignment operations are logged at DEBUG level:

```
technician-service:
- "Fetching work orders for technician: {id}"
- "Retrieved {count} work orders for technician {id}"
- "Error fetching work orders for technician {id}: {error}"

work-order-service:
- "Assigning work order {id} to technician {technicianId}"
- "Assigned work order {id} to technician {technicianId}"
```

### Metrics

Monitor these key metrics:
- Work order assignment success rate
- Average time to assign work orders
- Number of work orders per technician
- Status transition frequency
- Inter-service communication failures

## Best Practices

### For Developers

1. **Always verify resources exist** before operations
2. **Use proper error handling** for inter-service calls
3. **Implement graceful degradation** when services are unavailable
4. **Log all integration points** for debugging
5. **Use timeouts** for external service calls
6. **Test error scenarios** in addition to happy paths

### For API Consumers

1. **Check error responses** and handle appropriately
2. **Validate status transitions** before attempting
3. **Cache available technicians** when appropriate
4. **Refresh data after mutations** to ensure consistency
5. **Handle empty results** gracefully
6. **Provide user feedback** for all operations

## Troubleshooting

### Issue: Work orders not appearing in technician's list

**Possible Causes**:
1. Work order not assigned (status != ASSIGNED)
2. work-order-service unavailable
3. Incorrect technician ID

**Resolution**:
1. Verify work order status: `GET /api/v1/work-orders/{id}`
2. Check work-order-service health: `GET http://localhost:8084/actuator/health`
3. Verify technician exists: `GET /api/v1/technicians/{id}`

### Issue: Cannot assign work order

**Possible Causes**:
1. Work order doesn't exist
2. Work order already completed or cancelled
3. Invalid technician ID

**Resolution**:
1. Check work order exists: `GET /api/v1/work-orders/{id}`
2. Verify current status is not COMPLETED or CANCELLED
3. Verify technician exists: `GET /api/v1/technicians/{technicianId}`

### Issue: No available technicians returned

**Possible Causes**:
1. All technicians have status != ACTIVE
2. No technicians in database

**Resolution**:
1. Check technician statuses: `GET /api/v1/technicians`
2. Create active technicians if needed
3. Update existing technician status to ACTIVE

## Support

For questions and support:
- Check the [API Documentation](../technician-service/docs/API_DOCUMENTATION.md)
- Review backend logs for detailed error messages
- Check service health endpoints
- Create an issue in the GitHub repository
- Contact the Field Services team

## Version History

### Version 1.0 (November 2025)
- Initial integration documentation
- Work order assignment workflow
- Technician work order tracking
- Available technicians endpoint
- Complete API reference
- Integration contracts
- Testing guide
- UI integration guide
