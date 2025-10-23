# API Guide

This guide provides information about the Field Services REST APIs, including conventions, authentication, and common patterns.

## Base URL

```
Development: http://localhost:8080
Staging: https://api-staging.fieldservices.com
Production: https://api.fieldservices.com
```

## API Versioning

All APIs are versioned using URL versioning:

```
/api/v1/resources
/api/v2/resources
```

## Authentication

### JWT Authentication

All API requests (except public endpoints) require authentication using JWT tokens.

**Obtaining a Token**:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response**:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "refreshToken": "refresh_token_here"
}
```

**Using the Token**:

```http
GET /api/v1/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Common Headers

### Request Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-ID: unique-request-id  (optional, for tracking)
```

### Response Headers

```http
Content-Type: application/json
X-Request-ID: unique-request-id
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

## HTTP Status Codes

### Success Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH requests |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |

### Error Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 400 | Bad Request | Invalid request format or validation errors |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Semantic errors in request |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

## Error Response Format

All error responses follow a consistent format:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with id: 123",
  "path": "/api/v1/resources/123",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Validation Errors

```json
{
  "status": 400,
  "error": "Validation Failed",
  "fieldErrors": {
    "name": "Name is required",
    "email": "Email must be valid"
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## Pagination

List endpoints support pagination using query parameters:

**Request**:

```http
GET /api/v1/resources?page=0&size=20&sort=name,asc
```

**Parameters**:
- `page`: Page number (0-based, default: 0)
- `size`: Items per page (default: 20, max: 100)
- `sort`: Sort field and direction (format: `field,direction`)

**Response**:

```json
{
  "content": [
    { "id": 1, "name": "Resource 1" },
    { "id": 2, "name": "Resource 2" }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": true,
      "unsorted": false
    }
  },
  "totalPages": 5,
  "totalElements": 100,
  "last": false,
  "first": true,
  "numberOfElements": 20
}
```

## Filtering and Search

### Query Parameters

```http
GET /api/v1/resources?status=ACTIVE&category=EQUIPMENT&createdAfter=2025-01-01
```

### Search Endpoint

```http
GET /api/v1/resources/search?q=field+equipment&page=0&size=20
```

## Common API Patterns

### List Resources

```http
GET /api/v1/resources
```

**Response**:

```json
{
  "content": [
    {
      "id": 1,
      "name": "Resource 1",
      "status": "ACTIVE",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "totalElements": 100,
  "totalPages": 5
}
```

### Get Single Resource

```http
GET /api/v1/resources/{id}
```

**Response**:

```json
{
  "id": 1,
  "name": "Field Equipment",
  "description": "Mobile equipment for field technicians",
  "status": "ACTIVE",
  "category": "EQUIPMENT",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-16T14:30:00Z"
}
```

### Create Resource

```http
POST /api/v1/resources
Content-Type: application/json

{
  "name": "New Resource",
  "description": "Resource description",
  "status": "ACTIVE",
  "category": "EQUIPMENT"
}
```

**Response**: (201 Created)

```json
{
  "id": 101,
  "name": "New Resource",
  "description": "Resource description",
  "status": "ACTIVE",
  "category": "EQUIPMENT",
  "createdAt": "2025-01-17T09:00:00Z",
  "updatedAt": "2025-01-17T09:00:00Z"
}
```

### Update Resource

**Full Update (PUT)**:

```http
PUT /api/v1/resources/{id}
Content-Type: application/json

{
  "name": "Updated Resource",
  "description": "Updated description",
  "status": "INACTIVE",
  "category": "EQUIPMENT"
}
```

**Partial Update (PATCH)**:

```http
PATCH /api/v1/resources/{id}
Content-Type: application/json

{
  "status": "INACTIVE"
}
```

**Response**: (200 OK)

```json
{
  "id": 1,
  "name": "Updated Resource",
  "description": "Updated description",
  "status": "INACTIVE",
  "category": "EQUIPMENT",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-17T10:00:00Z"
}
```

### Delete Resource

```http
DELETE /api/v1/resources/{id}
```

**Response**: (204 No Content)

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated**: 1000 requests per hour
- **Unauthenticated**: 100 requests per hour

Check rate limit status in response headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

## API Documentation

Interactive API documentation is available via Swagger UI:

```
http://localhost:8080/swagger-ui.html
```

OpenAPI specification:

```
http://localhost:8080/v3/api-docs
```

## Service-Specific APIs

### User Service

Base Path: `/api/v1/users`

- `GET /api/v1/users` - List users
- `GET /api/v1/users/{id}` - Get user
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Resource Service

Base Path: `/api/v1/resources`

- `GET /api/v1/resources` - List resources
- `GET /api/v1/resources/{id}` - Get resource
- `POST /api/v1/resources` - Create resource
- `PUT /api/v1/resources/{id}` - Update resource
- `DELETE /api/v1/resources/{id}` - Delete resource
- `GET /api/v1/resources/search` - Search resources

## Best Practices for API Consumers

1. **Always include authentication** for protected endpoints
2. **Handle pagination** for list endpoints
3. **Implement retry logic** with exponential backoff for transient errors
4. **Respect rate limits** and implement throttling
5. **Use appropriate HTTP methods** (GET for reads, POST for creates, etc.)
6. **Validate responses** and handle errors gracefully
7. **Keep tokens secure** - never expose in logs or version control
8. **Use correlation IDs** for request tracking across services

## Code Examples

### JavaScript (Fetch API)

```javascript
const API_BASE_URL = 'http://localhost:8080';
const token = 'your-jwt-token';

// Get resources
async function getResources() {
  const response = await fetch(`${API_BASE_URL}/api/v1/resources`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Create resource
async function createResource(data) {
  const response = await fetch(`${API_BASE_URL}/api/v1/resources`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return await response.json();
}
```

### Python (Requests)

```python
import requests

API_BASE_URL = 'http://localhost:8080'
token = 'your-jwt-token'

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Get resources
def get_resources():
    response = requests.get(f'{API_BASE_URL}/api/v1/resources', headers=headers)
    response.raise_for_status()
    return response.json()

# Create resource
def create_resource(data):
    response = requests.post(
        f'{API_BASE_URL}/api/v1/resources',
        headers=headers,
        json=data
    )
    response.raise_for_status()
    return response.json()
```

### Java (Spring RestTemplate)

```java
RestTemplate restTemplate = new RestTemplate();
String baseUrl = "http://localhost:8080";
String token = "your-jwt-token";

HttpHeaders headers = new HttpHeaders();
headers.set("Authorization", "Bearer " + token);
headers.setContentType(MediaType.APPLICATION_JSON);

// Get resources
HttpEntity<String> entity = new HttpEntity<>(headers);
ResponseEntity<Page<ResourceDto>> response = restTemplate.exchange(
    baseUrl + "/api/v1/resources",
    HttpMethod.GET,
    entity,
    new ParameterizedTypeReference<Page<ResourceDto>>() {}
);

// Create resource
CreateResourceRequest request = new CreateResourceRequest("Name", "Description", ResourceStatus.ACTIVE);
HttpEntity<CreateResourceRequest> createEntity = new HttpEntity<>(request, headers);
ResponseEntity<ResourceDto> createResponse = restTemplate.exchange(
    baseUrl + "/api/v1/resources",
    HttpMethod.POST,
    createEntity,
    ResourceDto.class
);
```

## Support

For API support:
- Check this documentation
- Review [Swagger/OpenAPI docs](http://localhost:8080/swagger-ui.html)
- Create an issue in the repository
- Contact the development team

## Changelog

### v1.0.0 (Initial Release)
- Basic CRUD operations for all resources
- JWT authentication
- Pagination and filtering support
- OpenAPI documentation
