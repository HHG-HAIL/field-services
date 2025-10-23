# API Design Copilot Instructions

Guidelines for designing RESTful APIs using GitHub Copilot in the Field Services Spring Boot microservices project.

## RESTful API Principles

### Resource Naming

- Use **plural nouns** for collections: `/api/v1/users`, `/api/v1/resources`
- Use **lowercase** with **hyphens** for multi-word resources: `/api/v1/service-requests`
- Keep URLs **hierarchical** and **logical**: `/api/v1/users/{userId}/orders/{orderId}`

### HTTP Methods

| Method | Usage | Example |
|--------|-------|---------|
| GET | Retrieve resource(s) | `GET /api/v1/users` |
| POST | Create new resource | `POST /api/v1/users` |
| PUT | Update entire resource | `PUT /api/v1/users/{id}` |
| PATCH | Partial update | `PATCH /api/v1/users/{id}` |
| DELETE | Remove resource | `DELETE /api/v1/users/{id}` |

## API Versioning

Always version your APIs in the URL:

```java
@RestController
@RequestMapping("/api/v1/resources")
public class ResourceController {
    // Controller implementation
}
```

For major changes, create a new version:

```java
// Version 2 with breaking changes
@RestController
@RequestMapping("/api/v2/resources")
public class ResourceControllerV2 {
    // New implementation
}
```

## HTTP Status Codes

### Success Codes

```java
// 200 OK - Successful GET, PUT, PATCH
@GetMapping("/{id}")
public ResponseEntity<ResourceDto> getResource(@PathVariable Long id) {
    return ResponseEntity.ok(resourceService.findById(id));
}

// 201 Created - Successful POST
@PostMapping
public ResponseEntity<ResourceDto> createResource(@Valid @RequestBody CreateResourceRequest request) {
    ResourceDto created = resourceService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}

// 204 No Content - Successful DELETE
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
    resourceService.delete(id);
    return ResponseEntity.noContent().build();
}
```

### Error Codes

```java
// 400 Bad Request - Validation errors
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
    return ResponseEntity.badRequest().body(errorResponse);
}

// 404 Not Found - Resource not found
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
}

// 409 Conflict - Business rule violation
@ExceptionHandler(ResourceConflictException.class)
public ResponseEntity<ErrorResponse> handleConflict(ResourceConflictException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
}

// 500 Internal Server Error - Unexpected errors
@ExceptionHandler(Exception.class)
public ResponseEntity<ErrorResponse> handleServerError(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
}
```

## Request/Response Patterns

### Standard CRUD Operations

```java
/**
 * REST controller for Resource management.
 */
@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
@Slf4j
public class ResourceController {

    private final ResourceService resourceService;

    /**
     * GET /api/v1/resources - List all resources
     */
    @GetMapping
    public ResponseEntity<List<ResourceDto>> listResources() {
        log.debug("REST request to get all Resources");
        return ResponseEntity.ok(resourceService.findAll());
    }

    /**
     * GET /api/v1/resources/{id} - Get single resource
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceDto> getResource(@PathVariable Long id) {
        log.debug("REST request to get Resource : {}", id);
        return ResponseEntity.ok(resourceService.findById(id));
    }

    /**
     * POST /api/v1/resources - Create new resource
     */
    @PostMapping
    public ResponseEntity<ResourceDto> createResource(@Valid @RequestBody CreateResourceRequest request) {
        log.debug("REST request to save Resource : {}", request);
        ResourceDto result = resourceService.create(request);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(result.id())
            .toUri();
        return ResponseEntity.created(location).body(result);
    }

    /**
     * PUT /api/v1/resources/{id} - Update entire resource
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResourceDto> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody UpdateResourceRequest request) {
        log.debug("REST request to update Resource : {}, {}", id, request);
        return ResponseEntity.ok(resourceService.update(id, request));
    }

    /**
     * PATCH /api/v1/resources/{id} - Partial update
     */
    @PatchMapping("/{id}")
    public ResponseEntity<ResourceDto> partialUpdateResource(
            @PathVariable Long id,
            @RequestBody PartialUpdateResourceRequest request) {
        log.debug("REST request to partially update Resource : {}, {}", id, request);
        return ResponseEntity.ok(resourceService.partialUpdate(id, request));
    }

    /**
     * DELETE /api/v1/resources/{id} - Delete resource
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        log.debug("REST request to delete Resource : {}", id);
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

## Pagination and Filtering

### Pagination

```java
/**
 * GET /api/v1/resources?page=0&size=20&sort=name,asc
 */
@GetMapping
public ResponseEntity<Page<ResourceDto>> listResources(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "id,desc") String[] sort) {
    
    log.debug("REST request to get page of Resources");
    
    List<Sort.Order> orders = Arrays.stream(sort)
        .map(s -> {
            String[] parts = s.split(",");
            return new Sort.Order(
                parts.length > 1 ? Sort.Direction.fromString(parts[1]) : Sort.Direction.ASC,
                parts[0]
            );
        })
        .toList();
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(orders));
    Page<ResourceDto> resources = resourceService.findAll(pageable);
    
    return ResponseEntity.ok(resources);
}
```

### Filtering and Search

```java
/**
 * GET /api/v1/resources/search?name=test&status=ACTIVE
 */
@GetMapping("/search")
public ResponseEntity<List<ResourceDto>> searchResources(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) ResourceStatus status,
        @RequestParam(required = false) LocalDate createdAfter) {
    
    log.debug("REST request to search Resources with criteria");
    
    ResourceSearchCriteria criteria = ResourceSearchCriteria.builder()
        .name(name)
        .status(status)
        .createdAfter(createdAfter)
        .build();
    
    return ResponseEntity.ok(resourceService.search(criteria));
}
```

## Request Validation

### Bean Validation

```java
/**
 * Request DTO with validation constraints.
 */
public record CreateResourceRequest(
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    String name,
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    String description,
    
    @NotNull(message = "Status is required")
    ResourceStatus status,
    
    @NotNull(message = "Category is required")
    ResourceCategory category,
    
    @Email(message = "Email must be valid")
    String contactEmail,
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be valid")
    String contactPhone,
    
    @Min(value = 0, message = "Quantity must be non-negative")
    @Max(value = 10000, message = "Quantity must not exceed 10000")
    Integer quantity,
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    BigDecimal price
) {}
```

### Custom Validation

```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ResourceTypeValidator.class)
public @interface ValidResourceType {
    String message() default "Invalid resource type";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class ResourceTypeValidator implements ConstraintValidator<ValidResourceType, String> {
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        return Arrays.asList("TYPE_A", "TYPE_B", "TYPE_C").contains(value);
    }
}
```

## Error Response Format

### Standard Error Response

```java
/**
 * Standard error response structure.
 */
public record ErrorResponse(
    int status,
    String error,
    String message,
    String path,
    LocalDateTime timestamp,
    Map<String, Object> details
) {
    public ErrorResponse(int status, String error, String message, String path) {
        this(status, error, message, path, LocalDateTime.now(), null);
    }
}

/**
 * Validation error response with field-level errors.
 */
public record ValidationErrorResponse(
    int status,
    String error,
    Map<String, String> fieldErrors,
    LocalDateTime timestamp
) {}
```

### Global Exception Handler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {
        
        log.error("Resource not found: {}", ex.getMessage());
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            ex.getMessage(),
            request.getRequestURI()
        );
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        
        log.error("Validation error: {}", ex.getMessage());
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        ValidationErrorResponse response = new ValidationErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation Failed",
            errors,
            LocalDateTime.now()
        );
        
        return ResponseEntity.badRequest().body(response);
    }
}
```

## API Documentation with OpenAPI/Swagger

### Configuration

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI fieldServicesOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Field Services API")
                .description("RESTful API for Field Services Management")
                .version("v1.0")
                .contact(new Contact()
                    .name("Field Services Team")
                    .email("team@fieldservices.com"))
                .license(new License()
                    .name("MIT")
                    .url("https://opensource.org/licenses/MIT")))
            .externalDocs(new ExternalDocumentation()
                .description("Field Services Documentation")
                .url("https://docs.fieldservices.com"));
    }
}
```

### Annotating Controllers

```java
@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Resources", description = "Resource management API")
public class ResourceController {

    private final ResourceService resourceService;

    @Operation(
        summary = "Get all resources",
        description = "Retrieve a list of all resources with optional pagination and sorting"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved resources",
            content = @Content(schema = @Schema(implementation = ResourceDto.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<Page<ResourceDto>> listResources(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(resourceService.findAll(pageable));
    }

    @Operation(
        summary = "Get resource by ID",
        description = "Retrieve a specific resource by its unique identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Resource found",
            content = @Content(schema = @Schema(implementation = ResourceDto.class))),
        @ApiResponse(responseCode = "404", description = "Resource not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ResourceDto> getResource(
            @Parameter(description = "Resource ID") @PathVariable Long id) {
        return ResponseEntity.ok(resourceService.findById(id));
    }

    @Operation(
        summary = "Create new resource",
        description = "Create a new resource with the provided details"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Resource created successfully",
            content = @Content(schema = @Schema(implementation = ResourceDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request",
            content = @Content(schema = @Schema(implementation = ValidationErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<ResourceDto> createResource(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Resource creation request",
                required = true,
                content = @Content(schema = @Schema(implementation = CreateResourceRequest.class))
            )
            @Valid @RequestBody CreateResourceRequest request) {
        
        ResourceDto result = resourceService.create(request);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(result.id())
            .toUri();
        return ResponseEntity.created(location).body(result);
    }
}
```

### Documenting DTOs

```java
@Schema(description = "Resource data transfer object")
public record ResourceDto(
    @Schema(description = "Unique identifier", example = "1")
    Long id,
    
    @Schema(description = "Resource name", example = "Field Equipment")
    String name,
    
    @Schema(description = "Resource description", example = "Mobile field equipment for technicians")
    String description,
    
    @Schema(description = "Resource status", example = "ACTIVE")
    ResourceStatus status,
    
    @Schema(description = "Creation timestamp", example = "2025-01-15T10:30:00")
    LocalDateTime createdAt,
    
    @Schema(description = "Last update timestamp", example = "2025-01-16T14:45:00")
    LocalDateTime updatedAt
) {}
```

## HATEOAS (Hypermedia)

For more advanced APIs, include links to related resources:

```java
@GetMapping("/{id}")
public ResponseEntity<EntityModel<ResourceDto>> getResource(@PathVariable Long id) {
    ResourceDto resource = resourceService.findById(id);
    
    EntityModel<ResourceDto> model = EntityModel.of(resource);
    model.add(linkTo(methodOn(ResourceController.class).getResource(id)).withSelfRel());
    model.add(linkTo(methodOn(ResourceController.class).listResources(0, 20, new String[]{"id"})).withRel("all-resources"));
    
    return ResponseEntity.ok(model);
}
```

## Content Negotiation

Support multiple response formats:

```java
@GetMapping(
    value = "/{id}",
    produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE}
)
public ResponseEntity<ResourceDto> getResource(@PathVariable Long id) {
    return ResponseEntity.ok(resourceService.findById(id));
}
```

## Rate Limiting

Add rate limiting annotations (if using appropriate library):

```java
@GetMapping
@RateLimiter(name = "resourceApi", fallbackMethod = "rateLimitFallback")
public ResponseEntity<List<ResourceDto>> listResources() {
    return ResponseEntity.ok(resourceService.findAll());
}

public ResponseEntity<List<ResourceDto>> rateLimitFallback(Exception ex) {
    return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
}
```

## API Security

### Securing Endpoints

```java
@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
public class ResourceController {

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ResourceDto>> listResources() {
        return ResponseEntity.ok(resourceService.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceDto> createResource(@Valid @RequestBody CreateResourceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.create(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

## Best Practices Summary

1. **Use plural nouns** for resource names
2. **Version your APIs** from the start
3. **Return appropriate HTTP status codes**
4. **Validate all input** using Bean Validation
5. **Provide meaningful error messages** with consistent format
6. **Document your APIs** with OpenAPI/Swagger
7. **Implement pagination** for list endpoints
8. **Use DTOs** for request/response, never expose entities
9. **Follow REST conventions** for HTTP methods
10. **Secure endpoints** with appropriate authentication and authorization
11. **Include request/response examples** in documentation
12. **Support filtering and searching** where applicable
13. **Use HATEOAS** for discoverable APIs (optional, for advanced use cases)
14. **Implement rate limiting** to prevent abuse
15. **Log all API operations** for monitoring and debugging
