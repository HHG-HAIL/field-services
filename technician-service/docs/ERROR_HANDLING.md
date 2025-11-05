# Error Handling Guide - Technician Service

## Overview

The Technician Service implements centralized exception handling using Spring's `@RestControllerAdvice` to provide consistent, structured error responses across all API endpoints.

## Exception Handler Architecture

### GlobalExceptionHandler

Located at: `com.hhg.fieldservices.technician.exception.GlobalExceptionHandler`

This class is annotated with `@RestControllerAdvice` and handles all exceptions thrown by REST controllers, converting them into standardized `ErrorResponse` objects.

**Key Features**:
- Centralized error handling for all REST endpoints
- Consistent error response format
- Detailed logging of all errors
- HTTP status code mapping
- Request path tracking for debugging

## Error Response Format

All errors return a standardized `ErrorResponse` object:

```java
public class ErrorResponse {
    private int status;           // HTTP status code
    private String error;         // HTTP status reason phrase
    private String message;       // Human-readable error message
    private String path;          // Request URI that caused the error
    private List<String> details; // Additional error details (optional)
    private LocalDateTime timestamp; // When the error occurred
}
```

### Example Error Response

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

## Exception Types and Handling

### 1. TechnicianNotFoundException (404 Not Found)

**When Thrown**: When a technician with the specified ID or employee ID does not exist

**HTTP Status**: `404 NOT FOUND`

**Handler**: `handleTechnicianNotFound()`

**Example**:

```java
// Service layer
public TechnicianDto findById(Long id) {
    Technician technician = technicianRepository.findById(id)
        .orElseThrow(() -> new TechnicianNotFoundException(id));
    return technicianMapper.toDto(technician);
}

// API Response
{
  "status": 404,
  "error": "Not Found",
  "message": "Technician not found with id: 99",
  "path": "/api/v1/technicians/99",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

**Use Cases**:
- GET /api/v1/technicians/{id} - ID doesn't exist
- GET /api/v1/technicians/employee/{employeeId} - Employee ID doesn't exist
- PUT /api/v1/technicians/{id} - Trying to update non-existent technician
- DELETE /api/v1/technicians/{id} - Trying to delete non-existent technician

### 2. TechnicianValidationException (409 Conflict)

**When Thrown**: When business rules are violated (e.g., duplicate resources)

**HTTP Status**: `409 CONFLICT`

**Handler**: `handleTechnicianValidation()`

**Example**:

```java
// Service layer
public TechnicianDto create(CreateTechnicianRequest request) {
    if (technicianRepository.existsByEmployeeId(request.getEmployeeId())) {
        throw new TechnicianValidationException(
            "Technician with employee ID " + request.getEmployeeId() + " already exists");
    }
    // ... create technician
}

// API Response
{
  "status": 409,
  "error": "Conflict",
  "message": "Technician with employee ID EMP-001 already exists",
  "path": "/api/v1/technicians",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

**Use Cases**:
- POST /api/v1/technicians - Duplicate employee ID
- POST /api/v1/technicians - Duplicate email
- PUT /api/v1/technicians/{id} - Email already used by another technician

### 3. MethodArgumentNotValidException (400 Bad Request)

**When Thrown**: When request body validation fails (using `@Valid` annotation)

**HTTP Status**: `400 BAD REQUEST`

**Handler**: `handleValidationErrors()`

**Example**:

```java
// Controller
@PostMapping
public ResponseEntity<TechnicianDto> createTechnician(
        @Valid @RequestBody CreateTechnicianRequest request) {
    // ...
}

// API Response
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/technicians",
  "details": [
    "employeeId: Employee ID is required",
    "firstName: First name must be between 2 and 100 characters",
    "email: Email must be valid"
  ],
  "timestamp": "2025-11-05T19:00:00"
}
```

**Use Cases**:
- POST /api/v1/technicians - Missing required fields
- POST /api/v1/technicians - Invalid field formats
- PUT /api/v1/technicians/{id} - Invalid update data

**Common Validation Errors**:
- `employeeId`: Required, 3-50 characters
- `firstName`: Required, 2-100 characters
- `lastName`: Required, 2-100 characters
- `email`: Required, valid email format, max 255 characters
- `phone`: Valid phone format if provided, max 20 characters
- `zipCode`: Valid US ZIP code format (12345 or 12345-6789)
- `status`: Must be valid TechnicianStatus enum value
- `skillLevel`: Must be valid TechnicianSkillLevel enum value

### 4. HttpMessageNotReadableException (400 Bad Request)

**When Thrown**: When the request body cannot be parsed (malformed JSON)

**HTTP Status**: `400 BAD REQUEST`

**Handler**: `handleHttpMessageNotReadable()`

**Example**:

```json
// Request with invalid JSON
POST /api/v1/technicians
{ invalid json }

// API Response
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request body format",
  "path": "/api/v1/technicians",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

**Common Causes**:
- Malformed JSON syntax
- Invalid JSON structure
- Missing closing braces/brackets
- Trailing commas
- Unquoted property names

### 5. MethodArgumentTypeMismatchException (400 Bad Request)

**When Thrown**: When a path variable or request parameter has an invalid type

**HTTP Status**: `400 BAD REQUEST`

**Handler**: `handleMethodArgumentTypeMismatch()`

**Example**:

```http
GET /api/v1/technicians/invalid-id

// API Response
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid value 'invalid-id' for parameter 'id'. Expected type: Long",
  "path": "/api/v1/technicians/invalid-id",
  "details": null,
  "timestamp": "2025-11-05T19:00:00"
}
```

**Common Causes**:
- Non-numeric ID in path (expecting Long)
- Invalid enum value in path
- Invalid date format in query parameter

### 6. Generic Exception (500 Internal Server Error)

**When Thrown**: For all other unexpected errors

**HTTP Status**: `500 INTERNAL SERVER ERROR`

**Handler**: `handleGenericException()`

**Example**:

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

**Use Cases**:
- Database connection failures
- Unexpected runtime exceptions
- System errors

**Note**: Full exception details are logged server-side but not exposed to clients for security reasons.

## Best Practices for Error Handling

### For API Developers

1. **Use Specific Exceptions**: Throw `TechnicianNotFoundException` or `TechnicianValidationException` rather than generic exceptions when possible.

2. **Provide Clear Messages**: Exception messages should be clear and actionable.

   ```java
   // Good
   throw new TechnicianNotFoundException("Technician not found with id: " + id);
   
   // Avoid
   throw new TechnicianNotFoundException("Not found");
   ```

3. **Validate Early**: Check business rules in the service layer before attempting database operations.

   ```java
   public TechnicianDto create(CreateTechnicianRequest request) {
       // Validate business rules first
       if (technicianRepository.existsByEmployeeId(request.getEmployeeId())) {
           throw new TechnicianValidationException(...);
       }
       // Then proceed with creation
   }
   ```

4. **Log Appropriately**: Use different log levels based on error severity.
   - `log.error()` for unexpected errors (500)
   - `log.warn()` for business rule violations (409)
   - `log.debug()` for validation errors (400)

5. **Don't Expose Sensitive Information**: Never include sensitive data (passwords, tokens) in error messages.

### For API Consumers

1. **Always Check HTTP Status Codes**: Don't assume success. Check the status code before processing the response.

   ```javascript
   const response = await fetch('/api/v1/technicians/1');
   if (!response.ok) {
       const error = await response.json();
       console.error(`Error ${error.status}: ${error.message}`);
       return;
   }
   const technician = await response.json();
   ```

2. **Handle Specific Error Cases**: Implement specific handling for different error types.

   ```javascript
   if (response.status === 404) {
       // Resource not found - redirect or show not found message
   } else if (response.status === 409) {
       // Conflict - show validation error to user
   } else if (response.status === 500) {
       // Server error - show generic error and retry
   }
   ```

3. **Parse Error Details**: For validation errors (400), check the `details` array for field-specific errors.

   ```javascript
   if (error.status === 400 && error.details) {
       error.details.forEach(detail => {
           // Display field-specific errors to user
           console.error(detail);
       });
   }
   ```

4. **Implement Retry Logic**: For 500 errors, implement exponential backoff retry logic.

   ```javascript
   async function fetchWithRetry(url, maxRetries = 3) {
       for (let i = 0; i < maxRetries; i++) {
           const response = await fetch(url);
           if (response.ok || response.status < 500) {
               return response;
           }
           await new Promise(resolve => 
               setTimeout(resolve, Math.pow(2, i) * 1000)
           );
       }
       throw new Error('Max retries exceeded');
   }
   ```

5. **Use Error Path for Debugging**: The `path` field helps identify which endpoint caused the error.

## Testing Error Scenarios

### Unit Tests

Example tests from `TechnicianControllerTest`:

```java
@Test
void givenInvalidId_whenGetTechnicianById_thenReturn404() throws Exception {
    // Given
    when(technicianService.findById(99L))
        .thenThrow(new TechnicianNotFoundException(99L));
    
    // When & Then
    mockMvc.perform(get("/api/v1/technicians/99"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.status").value(404))
        .andExpect(jsonPath("$.message").value("Technician not found with id: 99"))
        .andExpect(jsonPath("$.path").value("/api/v1/technicians/99"));
}

@Test
void givenDuplicateEmployeeId_whenCreateTechnician_thenReturnConflict() {
    // Given
    when(technicianService.create(any()))
        .thenThrow(new TechnicianValidationException(
            "Technician with employee ID EMP-002 already exists"));
    
    // When & Then
    mockMvc.perform(post("/api/v1/technicians")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(createRequest)))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.status").value(409))
        .andExpect(jsonPath("$.error").value("Conflict"));
}
```

### Integration Tests

Test error scenarios end-to-end:

```java
@Test
void testCreateDuplicateTechnician() {
    // Create first technician
    TechnicianDto first = createTechnician("EMP-001", "john@example.com");
    assertNotNull(first.getId());
    
    // Try to create duplicate
    CreateTechnicianRequest duplicate = CreateTechnicianRequest.builder()
        .employeeId("EMP-001")
        .email("different@example.com")
        .build();
    
    // Expect 409 Conflict
    assertThrows(TechnicianValidationException.class, () -> {
        technicianService.create(duplicate);
    });
}
```

## Monitoring and Debugging

### Log Format

All errors are logged with consistent formatting:

```
// Not Found (404)
2025-11-05 19:00:00 ERROR GlobalExceptionHandler - Technician not found: Technician not found with id: 99

// Validation Error (400)
2025-11-05 19:00:00 ERROR GlobalExceptionHandler - Validation errors: [employeeId: Employee ID is required, email: Email must be valid]

// Conflict (409)
2025-11-05 19:00:00 ERROR GlobalExceptionHandler - Technician validation failed: Technician with employee ID EMP-001 already exists

// Internal Error (500)
2025-11-05 19:00:00 ERROR GlobalExceptionHandler - Unexpected error occurred
java.lang.NullPointerException: ...
    at com.hhg.fieldservices...
```

### Metrics to Monitor

1. **Error Rate by Status Code**: Track frequency of 4xx vs 5xx errors
2. **Most Common Validation Errors**: Identify fields causing frequent validation failures
3. **404 Patterns**: Identify if clients are using invalid IDs
4. **409 Frequency**: Monitor duplicate resource creation attempts
5. **500 Occurrences**: Alert on any 500 errors for immediate investigation

## Summary

The Technician Service implements comprehensive, centralized error handling that:

✅ Provides **consistent error response format** across all endpoints

✅ Maps exceptions to **appropriate HTTP status codes**

✅ Includes **detailed error messages** for debugging

✅ Tracks **request paths** for error context

✅ Supports **field-level validation errors** with detailed feedback

✅ Logs all errors with **appropriate severity levels**

✅ Protects **sensitive information** from exposure

✅ Follows **REST API best practices** for error handling

This design ensures a great developer experience for both API consumers and maintainers.
