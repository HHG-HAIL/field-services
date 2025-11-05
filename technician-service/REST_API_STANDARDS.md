# REST API Standards and Exception Handling

This document describes the REST API standards, conventions, and exception handling implemented in the Technician Service.

## Table of Contents

- [REST Standards](#rest-standards)
- [Exception Handling](#exception-handling)
- [API Endpoints](#api-endpoints)
- [Error Response Format](#error-response-format)
- [Examples](#examples)

## REST Standards

The Technician Service follows RESTful best practices and conventions:

### Resource Naming

- **Base URL Pattern**: `/api/v{version}/{resource-name}`
- **Example**: `/api/v1/technicians`
- Resources use plural nouns
- Version prefix for API versioning

### HTTP Methods

| Method | Purpose | Success Status |
|--------|---------|----------------|
| GET | Retrieve resource(s) | 200 OK |
| POST | Create new resource | 201 Created |
| PUT | Update existing resource | 200 OK |
| DELETE | Delete resource | 204 No Content |

### Request/Response Format

- **Content-Type**: `application/json`
- **Character Encoding**: UTF-8
- Requests with body use JSON format
- Responses are JSON formatted with consistent structure

### HTTP Status Codes

The API uses standard HTTP status codes:

#### Success Codes
- **200 OK** - Successful GET/PUT request
- **201 Created** - Successful POST request
- **204 No Content** - Successful DELETE request

#### Client Error Codes
- **400 Bad Request** - Invalid request data or validation errors
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resource (e.g., employee ID or email already exists)

#### Server Error Codes
- **500 Internal Server Error** - Unexpected server error

## Exception Handling

Centralized exception handling is implemented using Spring's `@RestControllerAdvice` pattern.

### Custom Exceptions

1. **ResourceNotFoundException** (404)
   - Thrown when a requested resource cannot be found
   - Example: Technician with specified ID does not exist

2. **DuplicateResourceException** (409)
   - Thrown when attempting to create a resource that already exists
   - Example: Employee ID or email already in use

3. **InvalidRequestException** (400)
   - Thrown for business logic violations or invalid data
   - Example: Invalid business rule violation

### Global Exception Handler

The `GlobalExceptionHandler` class (`@RestControllerAdvice`) provides centralized error handling:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    // Handles all exceptions and returns consistent error responses
}
```

Features:
- Catches exceptions from all controllers
- Provides consistent error response format
- Logs errors appropriately
- Handles validation errors from `@Valid` annotations

## Error Response Format

All error responses follow a consistent structure:

### Standard Error Response

```json
{
  "status": 404,
  "message": "Resource Not Found",
  "details": "Technician with ID 123 not found",
  "timestamp": "2025-11-05T17:10:27",
  "path": "/api/v1/technicians/123"
}
```

Fields:
- **status**: HTTP status code
- **message**: Brief error category
- **details**: Detailed error description
- **timestamp**: When the error occurred (ISO 8601 format)
- **path**: Request path that caused the error

### Validation Error Response

For validation failures (400 Bad Request with `@Valid`):

```json
{
  "status": 400,
  "message": "Validation Failed",
  "timestamp": "2025-11-05T17:10:11",
  "path": "/api/v1/technicians",
  "errors": {
    "firstName": ["First name is required"],
    "email": ["Email is required", "Email must be valid"],
    "skillLevel": ["Skill level is required"]
  }
}
```

Additional fields:
- **errors**: Map of field names to their validation error messages (array of strings)

## API Endpoints

### Technician Management

Base path: `/api/v1/technicians`

#### Get All Technicians

```
GET /api/v1/technicians
```

Query parameters:
- `status` (optional): Filter by status (ACTIVE, INACTIVE, ON_LEAVE, SUSPENDED)
- `skillLevel` (optional): Filter by skill level (JUNIOR, INTERMEDIATE, SENIOR, EXPERT)

**Success Response** (200):
```json
[
  {
    "id": 1,
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "ACTIVE",
    "skillLevel": "SENIOR",
    "createdAt": "2025-11-05T17:09:27",
    "updatedAt": "2025-11-05T17:09:27"
  }
]
```

#### Get Technician by ID

```
GET /api/v1/technicians/{id}
```

**Success Response** (200): Single technician object

**Error Responses**:
- 404 Not Found - Technician doesn't exist
- 400 Bad Request - Invalid ID format

#### Get Technician by Employee ID

```
GET /api/v1/technicians/employee/{employeeId}
```

**Success Response** (200): Single technician object

**Error Responses**:
- 404 Not Found - Technician with employee ID doesn't exist

#### Create Technician

```
POST /api/v1/technicians
Content-Type: application/json

{
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "status": "ACTIVE",
  "skillLevel": "SENIOR"
}
```

**Success Response** (201): Created technician object

**Error Responses**:
- 400 Bad Request - Validation errors (missing required fields, invalid email, etc.)
- 409 Conflict - Employee ID or email already exists

#### Update Technician

```
PUT /api/v1/technicians/{id}
Content-Type: application/json

{
  "firstName": "Jonathan",
  "status": "ON_LEAVE"
}
```

All fields are optional (partial update supported).

**Success Response** (200): Updated technician object

**Error Responses**:
- 400 Bad Request - Validation errors
- 404 Not Found - Technician doesn't exist
- 409 Conflict - Email already in use by another technician

#### Delete Technician

```
DELETE /api/v1/technicians/{id}
```

**Success Response** (204): No content

**Error Responses**:
- 404 Not Found - Technician doesn't exist
- 400 Bad Request - Invalid ID format

## Examples

### Success Example: Create Technician

**Request**:
```bash
curl -X POST http://localhost:8085/api/v1/technicians \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "ACTIVE",
    "skillLevel": "SENIOR"
  }'
```

**Response** (201 Created):
```json
{
  "id": 1,
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "status": "ACTIVE",
  "skillLevel": "SENIOR",
  "createdAt": "2025-11-05T17:09:27",
  "updatedAt": "2025-11-05T17:09:27"
}
```

### Error Example: Duplicate Resource

**Request**:
```bash
curl -X POST http://localhost:8085/api/v1/technicians \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1234567890",
    "status": "ACTIVE",
    "skillLevel": "JUNIOR"
  }'
```

**Response** (409 Conflict):
```json
{
  "status": 409,
  "message": "Duplicate Resource",
  "details": "Technician with employee ID EMP001 already exists",
  "timestamp": "2025-11-05T17:10:00",
  "path": "/api/v1/technicians"
}
```

### Error Example: Validation Failure

**Request**:
```bash
curl -X POST http://localhost:8085/api/v1/technicians \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** (400 Bad Request):
```json
{
  "status": 400,
  "message": "Validation Failed",
  "timestamp": "2025-11-05T17:10:11",
  "path": "/api/v1/technicians",
  "errors": {
    "lastName": ["Last name is required"],
    "firstName": ["First name is required"],
    "employeeId": ["Employee ID is required"],
    "skillLevel": ["Skill level is required"],
    "email": ["Email is required"],
    "status": ["Status is required"]
  }
}
```

### Error Example: Resource Not Found

**Request**:
```bash
curl http://localhost:8085/api/v1/technicians/999
```

**Response** (404 Not Found):
```json
{
  "status": 404,
  "message": "Resource Not Found",
  "details": "Technician with ID 999 not found",
  "timestamp": "2025-11-05T17:10:27",
  "path": "/api/v1/technicians/999"
}
```

### Error Example: Invalid Parameter Type

**Request**:
```bash
curl http://localhost:8085/api/v1/technicians/invalid
```

**Response** (400 Bad Request):
```json
{
  "status": 400,
  "message": "Invalid Parameter Type",
  "details": "Invalid value 'invalid' for parameter 'id'. Expected type: Long",
  "timestamp": "2025-11-05T17:10:44",
  "path": "/api/v1/technicians/invalid"
}
```

## API Documentation

Interactive API documentation is available via Swagger UI:

- **Swagger UI**: http://localhost:8085/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8085/v3/api-docs

The Swagger UI provides:
- Complete API documentation
- Request/response schemas
- Error response documentation
- Interactive API testing interface

## Validation Rules

### Create Technician Request

| Field | Required | Constraints |
|-------|----------|-------------|
| employeeId | Yes | 3-50 characters |
| firstName | Yes | 1-100 characters |
| lastName | Yes | 1-100 characters |
| email | Yes | Valid email format, max 255 characters |
| phone | No | Max 20 characters |
| status | Yes | Valid enum value (ACTIVE, INACTIVE, ON_LEAVE, SUSPENDED) |
| skillLevel | Yes | Valid enum value (JUNIOR, INTERMEDIATE, SENIOR, EXPERT) |

### Update Technician Request

All fields are optional (supports partial updates):

| Field | Constraints |
|-------|-------------|
| firstName | 1-100 characters if provided |
| lastName | 1-100 characters if provided |
| email | Valid email format, max 255 characters if provided |
| phone | Max 20 characters if provided |
| status | Valid enum value if provided |
| skillLevel | Valid enum value if provided |

Note: Employee ID cannot be updated after creation.

## Best Practices

1. **Always validate input**: Use `@Valid` annotation with request DTOs
2. **Return appropriate status codes**: Use correct HTTP status codes for different scenarios
3. **Provide clear error messages**: Include helpful details in error responses
4. **Use consistent error format**: All errors follow the same structure
5. **Document all endpoints**: Use OpenAPI annotations for comprehensive documentation
6. **Handle exceptions centrally**: Use `@RestControllerAdvice` for consistent error handling
7. **Log errors appropriately**: Log errors at appropriate levels (error, warn, debug)

## Testing

Comprehensive tests are provided:

- **GlobalExceptionHandlerTest**: Tests exception handling for all error scenarios
- **TechnicianControllerTest**: Tests all REST endpoints with various scenarios including success and error cases

Run tests:
```bash
mvn test
```

## References

- [Spring REST Best Practices](https://spring.io/guides/tutorials/rest/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Design Guidelines](https://restfulapi.net/)
- [OpenAPI Specification](https://swagger.io/specification/)
