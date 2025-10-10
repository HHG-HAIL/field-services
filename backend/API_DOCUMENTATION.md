# Field Service API Documentation

## Swagger UI Access

After starting the backend services, you can access the interactive API documentation through Swagger UI:

### Work Order Service (Port 8081)
- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8081/api-docs

### Technician Service (Port 8082)
- **Swagger UI**: http://localhost:8082/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8082/api-docs

### Schedule Service (Port 8083)
- **Swagger UI**: http://localhost:8083/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8083/api-docs

## Quick Start

1. **Start the Backend Services**:
   ```powershell
   cd backend
   .\restart-backend.ps1
   ```

2. **Access Swagger UI**:
   - Open http://localhost:8082/swagger-ui.html in your browser
   - Try the "GET /api/technicians" endpoint to see sample data
   - Use the "Try it out" button to execute API calls directly

## API Overview

### Work Order Service
- **Base URL**: http://localhost:8081/api/work-orders
- **Features**:
  - Complete CRUD operations for work orders
  - Status management (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED)
  - Technician assignment capabilities
  - Priority management (LOW, MEDIUM, HIGH, URGENT)
  - Date range filtering
  - Real-time status updates

### Technician Service
- **Base URL**: http://localhost:8082/api/technicians
- **Features**:
  - Technician profile management
  - Status tracking (AVAILABLE, BUSY, OFFLINE, ON_BREAK)
  - Skill-based matching and filtering
  - Location tracking
  - Availability management
  - Performance analytics

### Schedule Service
- **Base URL**: http://localhost:8083/api/schedules
- **Features**:
  - Schedule management and coordination
  - Calendar operations
  - Conflict detection
  - Time slot optimization
  - Appointment scheduling

## Key Endpoints

### Technician Service Examples

#### Get All Technicians
```http
GET /api/technicians
Content-Type: application/json
```

#### Update Technician Status
```http
PATCH /api/technicians/{id}/status
Content-Type: application/json

{
  "status": "BUSY"
}
```

#### Find Best Technician for Skills
```http
POST /api/technicians/find-best
Content-Type: application/json

{
  "skills": ["Network Installation", "Hardware Repair"]
}
```

### Work Order Service Examples

#### Create Work Order
```http
POST /api/work-orders
Content-Type: application/json

{
  "title": "Network Installation",
  "description": "Install network equipment",
  "priority": "HIGH",
  "customerId": 1,
  "scheduledDate": "2025-10-10T10:00:00"
}
```

#### Assign Technician
```http
PATCH /api/work-orders/{id}/assign
Content-Type: application/json

{
  "technicianId": 1
}
```

## Status Values

### Technician Status
- `AVAILABLE` - Ready for assignment
- `BUSY` - Currently working on tasks
- `OFFLINE` - Not available for work
- `ON_BREAK` - Taking a break

### Work Order Status
- `PENDING` - Newly created, awaiting assignment
- `ASSIGNED` - Assigned to a technician
- `IN_PROGRESS` - Work is being performed
- `COMPLETED` - Work has been finished
- `CANCELLED` - Work order was cancelled

### Priority Levels
- `LOW` - Non-urgent tasks
- `MEDIUM` - Standard priority
- `HIGH` - Important tasks requiring prompt attention
- `URGENT` - Critical issues requiring immediate action

## Error Handling

All APIs return standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include detailed message information:
```json
{
  "message": "Technician not found",
  "status": 404,
  "timestamp": "2025-10-09T14:30:00"
}
```

## CORS Configuration

All services are configured to allow cross-origin requests from:
- http://localhost:3000 (React development server)
- https://field-service-demo.surge.sh (Production deployment)

## Database Access

Each service includes H2 console access for development:
- Work Order Service: http://localhost:8081/h2-console
- Technician Service: http://localhost:8082/h2-console
- Schedule Service: http://localhost:8083/h2-console

**Connection Details**:
- JDBC URL: `jdbc:h2:mem:{servicename}db`
- Username: `sa`
- Password: `password`

## Authentication

Currently, the APIs are configured for development without authentication. In production, implement:
- JWT token authentication
- Role-based access control (RBAC)
- API key management

## Rate Limiting

For production deployment, consider implementing:
- Request rate limiting per client
- API usage quotas
- Throttling for resource-intensive operations

## Monitoring

The APIs include detailed logging and can be monitored through:
- Application logs (DEBUG level enabled)
- HTTP request/response logging
- Database query logging
- Performance metrics

## Testing with Swagger UI

1. **Navigate to Swagger UI** for any service
2. **Expand endpoint sections** to see available operations
3. **Click "Try it out"** on any endpoint
4. **Fill in parameters** as needed
5. **Execute** to see live results
6. **View response** including status codes and data

This interactive documentation makes it easy to:
- Test API functionality
- Understand request/response formats
- Validate data schemas
- Explore available endpoints
- Debug integration issues