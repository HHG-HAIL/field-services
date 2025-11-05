# Work Order Assignment API Documentation

This document describes the complete API workflow for assigning work orders to technicians and tracking their status in the Field Services system.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Integration Workflows](#integration-workflows)
- [API Examples](#api-examples)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Overview

The Field Services system provides comprehensive APIs for managing work orders and technicians, with full support for:

- **Work Order Assignment**: Assign work orders to available technicians
- **Technician Management**: CRUD operations for technician profiles
- **Status Tracking**: Real-time tracking of work order and technician status
- **Availability Queries**: Find available technicians for assignment
- **Skill-Based Matching**: Query technicians by skills and certifications

## Architecture

The system consists of two primary microservices:

### Work Order Service
- **Base URL**: `http://localhost:8084/api/v1`
- **Responsibilities**: 
  - Work order lifecycle management
  - Assignment to technicians
  - Status tracking
  - Customer information management

### Technician Service
- **Base URL**: `http://localhost:8085/api/v1`
- **Responsibilities**:
  - Technician profile management
  - Availability tracking
  - Skills and certification management
  - Location-based queries

### Field Service UI
- **Type**: React Single Page Application
- **Integration**: Consumes both Work Order and Technician Service APIs
- **Features**: Visual assignment interface, real-time status updates

## API Endpoints

### Technician Service API

#### Get All Technicians
```http
GET /api/v1/technicians
```

Returns a list of all technicians in the system.

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phoneNumber": "555-1234",
    "status": "AVAILABLE",
    "skills": "HVAC, Electrical",
    "certifications": "EPA 608, NATE",
    "city": "Springfield",
    "state": "IL",
    "createdAt": "2025-01-15T10:00:00",
    "updatedAt": "2025-01-15T10:00:00",
    "version": 0
  }
]
```

#### Get Available Technicians
```http
GET /api/v1/technicians/available
```

Returns all technicians with `AVAILABLE` status, sorted by last name.

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    "status": "AVAILABLE",
    ...
  },
  {
    "id": 3,
    "firstName": "Jane",
    "lastName": "Doe",
    "status": "AVAILABLE",
    ...
  }
]
```

#### Get Technician by ID
```http
GET /api/v1/technicians/{id}
```

**Parameters**:
- `id` (path) - Technician ID

**Response**: `200 OK` or `404 Not Found`

#### Get Technicians by Status
```http
GET /api/v1/technicians/status/{status}
```

**Parameters**:
- `status` (path) - One of: `AVAILABLE`, `ON_JOB`, `ON_BREAK`, `OFF_DUTY`, `ON_LEAVE`, `INACTIVE`

**Response**: `200 OK`

#### Get Technicians by Skill
```http
GET /api/v1/technicians/skill/{skill}
```

**Parameters**:
- `skill` (path) - Skill name (e.g., "HVAC", "Electrical")

**Response**: `200 OK`

Returns technicians whose skills field contains the specified skill (case-insensitive).

#### Get Technicians by Location
```http
GET /api/v1/technicians/city/{city}
GET /api/v1/technicians/state/{state}
```

**Parameters**:
- `city` (path) - City name
- `state` (path) - State code (e.g., "IL", "CA")

**Response**: `200 OK`

#### Create Technician
```http
POST /api/v1/technicians
Content-Type: application/json
```

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phoneNumber": "555-1234",
  "address": "123 Main St",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62701",
  "status": "AVAILABLE",
  "skills": "HVAC, Electrical, Plumbing",
  "certifications": "EPA 608, NATE",
  "notes": "Preferred for emergency calls"
}
```

**Response**: `201 Created`

**Validation**:
- `firstName`: Required, 2-100 characters
- `lastName`: Required, 2-100 characters
- `email`: Required, valid email format, unique
- `phoneNumber`: Required, valid phone format
- `zipCode`: Optional, format: 12345 or 12345-6789

#### Update Technician
```http
PUT /api/v1/technicians/{id}
Content-Type: application/json
```

**Request Body**: Same as Create (all fields optional)

**Response**: `200 OK` or `404 Not Found`

#### Update Technician Status
```http
PATCH /api/v1/technicians/{id}/status?status={status}
```

**Parameters**:
- `id` (path) - Technician ID
- `status` (query) - New status value

**Response**: `200 OK`

**Example**:
```http
PATCH /api/v1/technicians/1/status?status=ON_JOB
```

#### Delete Technician
```http
DELETE /api/v1/technicians/{id}
```

**Response**: `204 No Content` or `404 Not Found`

---

### Work Order Service API

#### Assign Work Order to Technician
```http
POST /api/v1/work-orders/{id}/assign?technicianId={technicianId}&technicianName={technicianName}
```

**Parameters**:
- `id` (path) - Work order ID
- `technicianId` (query) - Technician ID to assign
- `technicianName` (query) - Technician full name

**Response**: `200 OK`

**Example**:
```http
POST /api/v1/work-orders/123/assign?technicianId=1&technicianName=John Smith
```

**Response Body**:
```json
{
  "id": 123,
  "workOrderNumber": "WO-20251105123456",
  "title": "HVAC Repair",
  "status": "ASSIGNED",
  "assignedTechnicianId": 1,
  "assignedTechnicianName": "John Smith",
  "scheduledDate": "2025-11-06T09:00:00",
  ...
}
```

**Behavior**:
- Updates work order status to `ASSIGNED`
- Sets `assignedTechnicianId` and `assignedTechnicianName`
- Returns error if work order is already `COMPLETED` or `CANCELLED`

#### Get Work Orders by Technician
```http
GET /api/v1/work-orders/technician/{technicianId}
```

**Parameters**:
- `technicianId` (path) - Technician ID

**Response**: `200 OK`

Returns all work orders assigned to the specified technician.

**Example Response**:
```json
[
  {
    "id": 123,
    "workOrderNumber": "WO-20251105123456",
    "title": "HVAC Repair",
    "status": "ASSIGNED",
    "priority": "HIGH",
    "assignedTechnicianId": 1,
    "assignedTechnicianName": "John Smith",
    "customerName": "ABC Company",
    "serviceAddress": "456 Business Blvd",
    "city": "Springfield",
    "state": "IL",
    "scheduledDate": "2025-11-06T09:00:00",
    ...
  }
]
```

#### Update Work Order Status
```http
PATCH /api/v1/work-orders/{id}/status?status={status}
```

**Parameters**:
- `id` (path) - Work order ID
- `status` (query) - New status: `PENDING`, `ASSIGNED`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `CANCELLED`

**Response**: `200 OK`

**Automatic Timestamp Behavior**:
- Status → `IN_PROGRESS`: Sets `startedAt` timestamp
- Status → `COMPLETED`: Sets `completedAt` timestamp

## Integration Workflows

### Workflow 1: Assigning a New Work Order

**Scenario**: Dispatcher needs to assign a new work order to an available technician.

**Steps**:

1. **Get Available Technicians**
   ```http
   GET /api/v1/technicians/available
   ```

2. **Optional: Filter by Skill**
   ```http
   GET /api/v1/technicians/skill/HVAC
   ```

3. **Optional: Filter by Location**
   ```http
   GET /api/v1/technicians/city/Springfield
   ```

4. **Assign Work Order**
   ```http
   POST /api/v1/work-orders/123/assign?technicianId=1&technicianName=John Smith
   ```

5. **Update Technician Status (Recommended)**
   ```http
   PATCH /api/v1/technicians/1/status?status=ON_JOB
   ```

### Workflow 2: Technician Accepting and Starting Work

**Scenario**: Technician accepts work order and starts the job.

**Steps**:

1. **Technician Views Assigned Work Orders**
   ```http
   GET /api/v1/work-orders/technician/1
   ```

2. **Technician Updates Status to In Progress**
   ```http
   PATCH /api/v1/work-orders/123/status?status=IN_PROGRESS
   ```
   
   This automatically sets the `startedAt` timestamp.

3. **Update Technician Status**
   ```http
   PATCH /api/v1/technicians/1/status?status=ON_JOB
   ```

### Workflow 3: Completing a Work Order

**Scenario**: Technician completes work and returns to available status.

**Steps**:

1. **Mark Work Order as Completed**
   ```http
   PATCH /api/v1/work-orders/123/status?status=COMPLETED
   ```
   
   This automatically sets the `completedAt` timestamp.

2. **Update Technician Status to Available**
   ```http
   PATCH /api/v1/technicians/1/status?status=AVAILABLE
   ```

### Workflow 4: Emergency Re-assignment

**Scenario**: Technician becomes unavailable, need to reassign work order.

**Steps**:

1. **Update Original Technician Status**
   ```http
   PATCH /api/v1/technicians/1/status?status=ON_LEAVE
   ```

2. **Find Replacement Technician**
   ```http
   GET /api/v1/technicians/available
   GET /api/v1/technicians/skill/HVAC
   ```

3. **Reassign Work Order**
   ```http
   POST /api/v1/work-orders/123/assign?technicianId=2&technicianName=Jane Doe
   ```

## API Examples

### Example 1: Complete Assignment Flow (JavaScript)

```javascript
// 1. Get available technicians with required skill
async function findTechnician(skill) {
  const response = await fetch(
    `http://localhost:8085/api/v1/technicians/skill/${skill}`
  );
  const technicians = await response.json();
  
  // Filter for available status
  return technicians.filter(t => t.status === 'AVAILABLE');
}

// 2. Assign work order
async function assignWorkOrder(workOrderId, technicianId, technicianName) {
  const response = await fetch(
    `http://localhost:8084/api/v1/work-orders/${workOrderId}/assign?` +
    `technicianId=${technicianId}&technicianName=${encodeURIComponent(technicianName)}`,
    { method: 'POST' }
  );
  
  if (!response.ok) {
    throw new Error(`Assignment failed: ${response.status}`);
  }
  
  return await response.json();
}

// 3. Update technician status
async function updateTechnicianStatus(technicianId, status) {
  const response = await fetch(
    `http://localhost:8085/api/v1/technicians/${technicianId}/status?status=${status}`,
    { method: 'PATCH' }
  );
  
  return await response.json();
}

// Usage
const technicians = await findTechnician('HVAC');
if (technicians.length > 0) {
  const tech = technicians[0];
  await assignWorkOrder(123, tech.id, tech.firstName + ' ' + tech.lastName);
  await updateTechnicianStatus(tech.id, 'ON_JOB');
  console.log('Work order assigned successfully!');
}
```

### Example 2: Technician Dashboard (React Component)

```jsx
import React, { useEffect, useState } from 'react';

function TechnicianDashboard({ technicianId }) {
  const [workOrders, setWorkOrders] = useState([]);
  
  useEffect(() => {
    // Load technician's work orders
    fetch(`http://localhost:8084/api/v1/work-orders/technician/${technicianId}`)
      .then(res => res.json())
      .then(data => setWorkOrders(data));
  }, [technicianId]);
  
  const startWorkOrder = async (workOrderId) => {
    // Update work order status
    await fetch(
      `http://localhost:8084/api/v1/work-orders/${workOrderId}/status?status=IN_PROGRESS`,
      { method: 'PATCH' }
    );
    
    // Update technician status
    await fetch(
      `http://localhost:8085/api/v1/technicians/${technicianId}/status?status=ON_JOB`,
      { method: 'PATCH' }
    );
    
    // Refresh work orders
    window.location.reload();
  };
  
  return (
    <div>
      <h2>My Work Orders</h2>
      {workOrders.map(wo => (
        <div key={wo.id}>
          <h3>{wo.title}</h3>
          <p>Status: {wo.status}</p>
          <p>Customer: {wo.customerName}</p>
          <p>Location: {wo.serviceAddress}</p>
          {wo.status === 'ASSIGNED' && (
            <button onClick={() => startWorkOrder(wo.id)}>
              Start Work
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid request parameters",
  "fieldErrors": {
    "email": "Email must be valid",
    "phoneNumber": "Phone number is required"
  },
  "path": "/api/v1/technicians",
  "timestamp": "2025-11-05T16:00:00"
}
```

#### 404 Not Found
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Technician not found with id: 999",
  "path": "/api/v1/technicians/999",
  "timestamp": "2025-11-05T16:00:00"
}
```

#### 409 Conflict
```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Technician already exists with email: john.smith@example.com",
  "path": "/api/v1/technicians",
  "timestamp": "2025-11-05T16:00:00"
}
```

### Error Handling Best Practices

1. **Check Response Status**: Always check `response.ok` or status code
2. **Parse Error Messages**: Extract `message` field for user-friendly errors
3. **Handle Validation Errors**: Display `fieldErrors` next to form fields
4. **Retry Logic**: Implement exponential backoff for 5xx errors
5. **User Feedback**: Show clear error messages to end users

## Best Practices

### For Work Order Assignment

1. **Always Check Availability**: Query `/technicians/available` before assignment
2. **Consider Skills**: Match technician skills to work order requirements
3. **Location-Based Assignment**: Assign technicians closest to job site
4. **Update Both Statuses**: Update work order AND technician status
5. **Handle Conflicts**: Check if work order can be assigned (not completed/cancelled)

### For Status Management

1. **Automatic Timestamps**: Let the system manage `startedAt` and `completedAt`
2. **Status Transitions**: Follow logical state transitions:
   - `PENDING` → `ASSIGNED` → `IN_PROGRESS` → `COMPLETED`
3. **Synchronize States**: Keep technician status in sync with work order status
4. **Real-time Updates**: Poll or use webhooks for status changes

### For Integration

1. **CORS Configuration**: Both services support CORS for frontend integration
2. **API Versioning**: Use `/api/v1` endpoints for stability
3. **Error Handling**: Implement comprehensive error handling
4. **Data Validation**: Validate on both client and server side
5. **Testing**: Use Swagger UI for API testing:
   - Work Order Service: `http://localhost:8084/swagger-ui.html`
   - Technician Service: `http://localhost:8085/swagger-ui.html`

### Performance Optimization

1. **Batch Operations**: Minimize API calls by batching when possible
2. **Caching**: Cache technician lists for short periods
3. **Pagination**: Use pagination for large result sets (future enhancement)
4. **Filtering**: Apply filters at API level, not client side
5. **Compression**: Enable gzip compression for large responses

## OpenAPI/Swagger Documentation

Both services provide interactive API documentation:

### Work Order Service
- **Swagger UI**: http://localhost:8084/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8084/v3/api-docs

### Technician Service
- **Swagger UI**: http://localhost:8085/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8085/v3/api-docs

Use these interfaces to:
- Explore all available endpoints
- Try API calls interactively
- View request/response schemas
- Test authentication and authorization

## Support and Troubleshooting

### Common Issues

**Issue**: CORS errors in browser
- **Solution**: Both services have CORS enabled for `*` origins. Check browser console for specific errors.

**Issue**: 404 on assignment endpoint
- **Solution**: Verify work order exists and is not already completed/cancelled

**Issue**: Duplicate email error
- **Solution**: Each technician must have unique email address

**Issue**: Validation errors
- **Solution**: Check field requirements in request body schema

### Getting Help

For additional support:
1. Review API documentation at `/swagger-ui.html`
2. Check server logs for detailed error messages
3. Review the [Contributing Guide](../CONTRIBUTING.md)
4. Create an issue in the GitHub repository

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-05 | Initial release with full assignment and tracking APIs |
