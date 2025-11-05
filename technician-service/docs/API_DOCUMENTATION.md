# Technician Service API Documentation

## Overview

The Technician Service provides RESTful APIs for managing field service technicians. This service follows REST best practices including proper HTTP methods, status codes, and error handling.

**Base URL**: `/api/v1/technicians`

**Version**: 1.0.0

## Table of Contents

- [RESTful Standards](#restful-standards)
- [API Endpoints](#api-endpoints)
- [Request/Response Formats](#requestresponse-formats)
- [Error Handling](#error-handling)
- [Examples](#examples)

## RESTful Standards

### HTTP Methods

| Method | Usage | Idempotent |
|--------|-------|------------|
| GET | Retrieve resource(s) | Yes |
| POST | Create new resource | No |
| PUT | Update entire resource | Yes |
| DELETE | Remove resource | Yes |

### HTTP Status Codes

#### Success Codes

| Code | Description | When Used |
|------|-------------|-----------|
| 200 OK | Success | Successful GET, PUT operations |
| 201 Created | Resource created | Successful POST operation |
| 204 No Content | Success with no body | Successful DELETE operation |

#### Error Codes

| Code | Description | When Used |
|------|-------------|-----------|
| 400 Bad Request | Invalid request | Validation errors, malformed JSON |
| 404 Not Found | Resource not found | Technician ID does not exist |
| 409 Conflict | Business rule violation | Duplicate employee ID or email |
| 500 Internal Server Error | Server error | Unexpected system errors |

### Resource Naming

- **Plural nouns** for collections: `/technicians`
- **Hierarchical structure** for related resources
- **Lowercase with hyphens** for multi-word fields

## API Endpoints

### 1. List All Technicians

Retrieve a list of all technicians in the system.

```http
GET /api/v1/technicians
```

**Response**: `200 OK`

```json
[
  {
    "id": 1,
    "employeeId": "EMP-001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "555-0100",
    "status": "ACTIVE",
    "skillLevel": "SENIOR",
    "skills": ["HVAC", "Plumbing"],
    "address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "notes": null,
    "createdAt": "2025-01-15T10:00:00",
    "updatedAt": "2025-01-15T10:00:00",
    "version": 0
  }
]
```

### 2. Get Technician by ID

Retrieve a specific technician by their unique identifier.

```http
GET /api/v1/technicians/{id}
```

**Path Parameters**:
- `id` (Long, required): Technician ID

**Response**: `200 OK`

```json
{
  "id": 1,
  "employeeId": "EMP-001",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "555-0100",
  "status": "ACTIVE",
  "skillLevel": "SENIOR",
  "skills": ["HVAC", "Plumbing"],
  "address": "123 Main St",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62701",
  "notes": null,
  "createdAt": "2025-01-15T10:00:00",
  "updatedAt": "2025-01-15T10:00:00",
  "version": 0
}
```

**Error Response**: `404 Not Found`

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Technician not found with id: 99",
  "path": "/api/v1/technicians/99",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

### 3. Get Technician by Employee ID

Retrieve a technician by their unique employee ID.

```http
GET /api/v1/technicians/employee/{employeeId}
```

**Path Parameters**:
- `employeeId` (String, required): Employee ID

**Response**: `200 OK` (same as Get by ID)

**Error Response**: `404 Not Found`

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Technician not found with employee ID: EMP-999",
  "path": "/api/v1/technicians/employee/EMP-999",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

### 4. Get Technicians by Status

Retrieve all technicians with a specific status.

```http
GET /api/v1/technicians/status/{status}
```

**Path Parameters**:
- `status` (String, required): One of: `ACTIVE`, `BUSY`, `ON_LEAVE`, `INACTIVE`

**Response**: `200 OK` (array of technicians)

### 5. Get Technicians by Skill Level

Retrieve all technicians with a specific skill level.

```http
GET /api/v1/technicians/skill-level/{skillLevel}
```

**Path Parameters**:
- `skillLevel` (String, required): One of: `JUNIOR`, `INTERMEDIATE`, `SENIOR`, `EXPERT`

**Response**: `200 OK` (array of technicians)

### 6. Get Technicians by Skill

Retrieve all technicians with a specific skill.

```http
GET /api/v1/technicians/skill/{skill}
```

**Path Parameters**:
- `skill` (String, required): Skill name (e.g., "HVAC", "Plumbing")

**Response**: `200 OK` (array of technicians)

### 7. Create Technician

Create a new technician.

```http
POST /api/v1/technicians
Content-Type: application/json
```

**Request Body**:

```json
{
  "employeeId": "EMP-002",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "phone": "555-0200",
  "status": "ACTIVE",
  "skillLevel": "INTERMEDIATE",
  "skills": ["Electrical"],
  "address": "456 Oak Ave",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62702",
  "notes": "Available for evening shifts"
}
```

**Response**: `201 Created`

```json
{
  "id": 2,
  "employeeId": "EMP-002",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "phone": "555-0200",
  "status": "ACTIVE",
  "skillLevel": "INTERMEDIATE",
  "skills": ["Electrical"],
  "address": "456 Oak Ave",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62702",
  "notes": "Available for evening shifts",
  "createdAt": "2025-11-05T19:00:00",
  "updatedAt": "2025-11-05T19:00:00",
  "version": 0
}
```

**Error Response**: `400 Bad Request` (Validation Errors)

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/technicians",
  "details": [
    "employeeId: Employee ID is required",
    "email: Email must be valid",
    "firstName: First name must be between 2 and 100 characters"
  ],
  "timestamp": "2025-11-05T19:00:00"
}
```

**Error Response**: `409 Conflict` (Duplicate Resource)

```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Technician with employee ID EMP-002 already exists",
  "path": "/api/v1/technicians",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

### 8. Update Technician

Update an existing technician.

```http
PUT /api/v1/technicians/{id}
Content-Type: application/json
```

**Path Parameters**:
- `id` (Long, required): Technician ID

**Request Body**:

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "555-0201",
  "status": "BUSY",
  "skillLevel": "SENIOR",
  "skills": ["Electrical", "HVAC"],
  "address": "456 Oak Ave",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62702",
  "notes": "Promoted to senior level"
}
```

**Response**: `200 OK` (updated technician object)

**Error Response**: `404 Not Found`

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Technician not found with id: 99",
  "path": "/api/v1/technicians/99",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

**Error Response**: `409 Conflict` (Email already exists)

```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Technician with email jane.doe@example.com already exists",
  "path": "/api/v1/technicians/1",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

### 9. Delete Technician

Delete a technician by ID.

```http
DELETE /api/v1/technicians/{id}
```

**Path Parameters**:
- `id` (Long, required): Technician ID

**Response**: `204 No Content`

**Error Response**: `404 Not Found`

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Technician not found with id: 99",
  "path": "/api/v1/technicians/99",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

## Request/Response Formats

### Technician Status Values

| Status | Description |
|--------|-------------|
| ACTIVE | Available for work assignments |
| BUSY | Currently assigned to work |
| ON_LEAVE | Temporarily unavailable |
| INACTIVE | No longer active in system |

### Skill Level Values

| Level | Description |
|-------|-------------|
| JUNIOR | Entry-level technician |
| INTERMEDIATE | Mid-level technician |
| SENIOR | Senior technician |
| EXPERT | Expert-level technician |

### Validation Rules

#### Create Technician Request

| Field | Required | Rules |
|-------|----------|-------|
| employeeId | Yes | 3-50 characters, unique |
| firstName | Yes | 2-100 characters |
| lastName | Yes | 2-100 characters |
| email | Yes | Valid email format, unique, max 255 characters |
| phone | No | Valid phone format, max 20 characters |
| status | Yes | Must be valid TechnicianStatus |
| skillLevel | Yes | Must be valid TechnicianSkillLevel |
| skills | No | Set of skill names |
| address | No | Max 500 characters |
| city | No | Max 100 characters |
| state | No | Max 50 characters |
| zipCode | No | Valid US ZIP code format (12345 or 12345-6789) |
| notes | No | Max 1000 characters |

## Error Handling

### Standard Error Response Format

All error responses follow a consistent structure:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Technician not found with id: 99",
  "path": "/api/v1/technicians/99",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

**Fields**:
- `status` (int): HTTP status code
- `error` (String): HTTP status reason phrase
- `message` (String): Human-readable error message
- `path` (String): Request URI that caused the error
- `details` (List<String>, optional): Additional error details (e.g., validation errors)
- `timestamp` (LocalDateTime): When the error occurred

### Common Error Scenarios

#### 1. Resource Not Found (404)

**Trigger**: Accessing a non-existent technician ID

**Example**:
```http
GET /api/v1/technicians/99999
```

**Response**:
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Technician not found with id: 99999",
  "path": "/api/v1/technicians/99999",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

#### 2. Validation Errors (400)

**Trigger**: Submitting invalid or incomplete data

**Example**:
```http
POST /api/v1/technicians
Content-Type: application/json

{
  "firstName": "J"
}
```

**Response**:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/technicians",
  "details": [
    "employeeId: Employee ID is required",
    "firstName: First name must be between 2 and 100 characters",
    "lastName: Last name is required",
    "email: Email is required",
    "status: Status is required",
    "skillLevel: Skill level is required"
  ],
  "timestamp": "2025-11-05T19:00:00"
}
```

#### 3. Malformed JSON (400)

**Trigger**: Sending invalid JSON in request body

**Example**:
```http
POST /api/v1/technicians
Content-Type: application/json

{ invalid json }
```

**Response**:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request body format",
  "path": "/api/v1/technicians",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

#### 4. Invalid Path Parameter Type (400)

**Trigger**: Using incorrect type for path parameter

**Example**:
```http
GET /api/v1/technicians/invalid-id
```

**Response**:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid value 'invalid-id' for parameter 'id'. Expected type: Long",
  "path": "/api/v1/technicians/invalid-id",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

#### 5. Duplicate Resource (409)

**Trigger**: Creating technician with existing employee ID or email

**Example**:
```http
POST /api/v1/technicians
Content-Type: application/json

{
  "employeeId": "EMP-001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.smith@example.com",
  "status": "ACTIVE",
  "skillLevel": "JUNIOR"
}
```

**Response**:
```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Technician with employee ID EMP-001 already exists",
  "path": "/api/v1/technicians",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

#### 6. Internal Server Error (500)

**Trigger**: Unexpected system error

**Response**:
```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred. Please try again later.",
  "path": "/api/v1/technicians",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

## Examples

### Example 1: Create a New Technician

**Request**:
```bash
curl -X POST http://localhost:8080/api/v1/technicians \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP-003",
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "phone": "555-0300",
    "status": "ACTIVE",
    "skillLevel": "EXPERT",
    "skills": ["HVAC", "Electrical", "Plumbing"],
    "address": "789 Elm St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62703"
  }'
```

**Response**: `201 Created`
```json
{
  "id": 3,
  "employeeId": "EMP-003",
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "phone": "555-0300",
  "status": "ACTIVE",
  "skillLevel": "EXPERT",
  "skills": ["HVAC", "Electrical", "Plumbing"],
  "address": "789 Elm St",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62703",
  "notes": null,
  "createdAt": "2025-11-05T19:00:00",
  "updatedAt": "2025-11-05T19:00:00",
  "version": 0
}
```

### Example 2: Update Technician Status

**Request**:
```bash
curl -X PUT http://localhost:8080/api/v1/technicians/3 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "phone": "555-0300",
    "status": "BUSY",
    "skillLevel": "EXPERT",
    "skills": ["HVAC", "Electrical", "Plumbing"],
    "address": "789 Elm St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62703",
    "notes": "Assigned to emergency repair"
  }'
```

**Response**: `200 OK`
```json
{
  "id": 3,
  "employeeId": "EMP-003",
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "phone": "555-0300",
  "status": "BUSY",
  "skillLevel": "EXPERT",
  "skills": ["HVAC", "Electrical", "Plumbing"],
  "address": "789 Elm St",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62703",
  "notes": "Assigned to emergency repair",
  "createdAt": "2025-11-05T19:00:00",
  "updatedAt": "2025-11-05T19:15:00",
  "version": 1
}
```

### Example 3: Get Technicians by Skill

**Request**:
```bash
curl -X GET http://localhost:8080/api/v1/technicians/skill/HVAC
```

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "employeeId": "EMP-001",
    "firstName": "John",
    "lastName": "Smith",
    "skills": ["HVAC", "Plumbing"],
    ...
  },
  {
    "id": 3,
    "employeeId": "EMP-003",
    "firstName": "Alice",
    "lastName": "Johnson",
    "skills": ["HVAC", "Electrical", "Plumbing"],
    ...
  }
]
```

### Example 4: Delete a Technician

**Request**:
```bash
curl -X DELETE http://localhost:8080/api/v1/technicians/3
```

**Response**: `204 No Content`

## API Documentation UI

Interactive API documentation is available via Swagger UI:

```
http://localhost:8080/swagger-ui.html
```

OpenAPI specification (JSON format):

```
http://localhost:8080/v3/api-docs
```

## Best Practices

1. **Always validate input** before making requests
2. **Handle all HTTP status codes** appropriately
3. **Use appropriate HTTP methods** for each operation
4. **Check error responses** for detailed information
5. **Include proper headers** (Content-Type, Accept)
6. **Never expose sensitive data** in requests or logs
7. **Implement retry logic** with exponential backoff for 5xx errors
8. **Use pagination** for list endpoints (when available in future versions)

## Version History

### Version 1.0.0 (Current)

- Initial release with full CRUD operations
- RESTful API design with proper HTTP methods and status codes
- Comprehensive error handling with consistent error response format
- Validation for all input fields
- Support for filtering by status, skill level, and skills
- Swagger/OpenAPI documentation

## Support

For API support:
- Check the Swagger UI documentation
- Review this documentation
- Create an issue in the GitHub repository
- Contact the Field Services team
