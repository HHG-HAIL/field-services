# GitHub Copilot Instructions for Field Services Project

This document provides comprehensive guidelines for using GitHub Copilot effectively within the Field Services Spring Boot microservices project.

## Overview

GitHub Copilot is an AI-powered code completion tool that can significantly enhance productivity. These instructions help ensure Copilot generates code that aligns with our project standards, Spring Boot best practices, and microservices architecture patterns.

## Table of Contents

- [General Guidelines](#general-guidelines)
- [Project-Specific Instructions](#project-specific-instructions)
- [Module-Specific Guidelines](#module-specific-guidelines)
- [Code Quality Standards](#code-quality-standards)
- [Security Considerations](#security-considerations)

## General Guidelines

### When to Use Copilot

✅ **Recommended Use Cases:**
- Generating boilerplate code (DTOs, entities, repositories)
- Creating standard REST controller endpoints
- Writing unit and integration tests
- Implementing common design patterns
- Generating documentation comments
- Creating configuration files

⚠️ **Use with Caution:**
- Security-sensitive code (authentication, authorization)
- Complex business logic (review carefully)
- Database migrations and schema changes
- Production configuration files

### Best Practices

1. **Provide Clear Context**: Write descriptive comments before letting Copilot generate code
2. **Review Suggestions**: Always review and understand generated code before accepting
3. **Maintain Consistency**: Ensure generated code follows existing patterns in the codebase
4. **Test Thoroughly**: All Copilot-generated code must be tested
5. **Refactor When Needed**: Don't accept suboptimal suggestions; refactor for clarity

## Project-Specific Instructions

### Technology Stack

Our project uses:
- **Java 17+** with modern language features
- **Spring Boot 3.x** with Spring Cloud
- **Maven** for dependency management
- **JUnit 5** and **Mockito** for testing
- **PostgreSQL/MySQL** for persistence
- **Docker** for containerization
- **Lombok** for reducing boilerplate (when appropriate)

### Architecture Patterns

This is a **microservices architecture** with:
- Service discovery (Eureka)
- API Gateway (Spring Cloud Gateway)
- Configuration server (Spring Cloud Config)
- Event-driven communication (Kafka/RabbitMQ)
- Circuit breakers (Resilience4j)

### Code Organization

```
service-name/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/hhg/fieldservices/<service>/
│   │   │       ├── config/          # Configuration classes
│   │   │       ├── controller/      # REST controllers
│   │   │       ├── service/         # Business logic
│   │   │       ├── repository/      # Data access
│   │   │       ├── model/           # Domain entities
│   │   │       ├── dto/             # Data transfer objects
│   │   │       ├── exception/       # Custom exceptions
│   │   │       └── util/            # Utility classes
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/        # Flyway migrations
│   └── test/
└── pom.xml
```

## Module-Specific Guidelines

### 1. Spring Boot Controllers

Detailed guidelines available in: [copilot-instructions/spring-boot.md](copilot-instructions/spring-boot.md)

**Quick Reference:**

```java
// When creating REST controllers, follow this pattern:
@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
@Slf4j
public class ResourceController {
    
    private final ResourceService resourceService;
    
    @GetMapping
    public ResponseEntity<List<ResourceDto>> getAllResources() {
        log.debug("Fetching all resources");
        return ResponseEntity.ok(resourceService.findAll());
    }
    
    @PostMapping
    public ResponseEntity<ResourceDto> createResource(@Valid @RequestBody CreateResourceRequest request) {
        log.debug("Creating resource: {}", request);
        ResourceDto created = resourceService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
```

### 2. Microservices Patterns

Detailed guidelines available in: [copilot-instructions/microservices.md](copilot-instructions/microservices.md)

**Quick Reference:**

- Use **Feign clients** for synchronous service-to-service communication
- Implement **circuit breakers** for resilience
- Use **event-driven patterns** for asynchronous operations
- Include **distributed tracing** (Sleuth/Zipkin)

### 3. Testing

Detailed guidelines available in: [copilot-instructions/testing.md](copilot-instructions/testing.md)

**Quick Reference:**

```java
// Unit test example
@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {
    
    @Mock
    private ResourceRepository repository;
    
    @InjectMocks
    private ResourceService service;
    
    @Test
    void givenValidResource_whenCreate_thenResourceIsSaved() {
        // Given
        CreateResourceRequest request = new CreateResourceRequest("Test");
        Resource resource = new Resource(1L, "Test");
        when(repository.save(any())).thenReturn(resource);
        
        // When
        ResourceDto result = service.create(request);
        
        // Then
        assertThat(result.getName()).isEqualTo("Test");
        verify(repository).save(any());
    }
}
```

### 4. Data Access

**Quick Reference:**

```java
// Repository pattern
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    
    Optional<Resource> findByName(String name);
    
    @Query("SELECT r FROM Resource r WHERE r.status = :status")
    List<Resource> findByStatus(@Param("status") ResourceStatus status);
}

// Entity example
@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Enumerated(EnumType.STRING)
    private ResourceStatus status;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

## Code Quality Standards

### Naming Conventions

- **Classes**: PascalCase (e.g., `UserService`, `OrderController`)
- **Methods**: camelCase (e.g., `findUserById`, `createOrder`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Packages**: lowercase (e.g., `com.hhg.fieldservices.user`)

### Documentation

Always generate JavaDoc for:
- Public classes and interfaces
- Public methods
- Complex algorithms or business logic

```java
/**
 * Service for managing field service resources.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Service
public class ResourceService {
    
    /**
     * Creates a new resource with the provided details.
     * 
     * @param request the resource creation request
     * @return the created resource DTO
     * @throws ResourceAlreadyExistsException if a resource with the same name exists
     */
    public ResourceDto create(CreateResourceRequest request) {
        // Implementation
    }
}
```

### Error Handling

Use global exception handling:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
```

## Security Considerations

### Authentication & Authorization

```java
// Secure endpoints appropriately
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
    resourceService.delete(id);
    return ResponseEntity.noContent().build();
}
```

### Input Validation

Always validate input:

```java
public record CreateResourceRequest(
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100)
    String name,
    
    @NotNull(message = "Type is required")
    ResourceType type
) {}
```

### Sensitive Data

- Never hardcode credentials or API keys
- Use environment variables or secure vaults
- Avoid logging sensitive information

## Working with Copilot

### Effective Prompting

**Good Example:**
```java
// Create a REST endpoint to retrieve a paginated list of active users
// Include sorting by creation date and filtering by role
// Return 404 if no users found, 200 with user DTOs otherwise
```

**Poor Example:**
```java
// Get users
```

### Iterative Refinement

1. Start with a comment describing what you need
2. Review the Copilot suggestion
3. Accept if it meets standards, or refine your comment
4. Add additional context if needed

### Code Review Checklist

Before accepting Copilot suggestions:

- [ ] Follows project naming conventions
- [ ] Includes proper error handling
- [ ] Has appropriate logging
- [ ] Follows security best practices
- [ ] Includes input validation
- [ ] Has JavaDoc documentation
- [ ] Uses dependency injection correctly
- [ ] Follows REST conventions (for controllers)
- [ ] Includes appropriate tests

## Additional Resources

- [GitHub Copilot Agents Guide](agents.md)
- [Spring Boot Specific Guidelines](copilot-instructions/spring-boot.md)
- [Microservices Patterns](copilot-instructions/microservices.md)
- [Testing Guidelines](copilot-instructions/testing.md)
- [API Design Guidelines](copilot-instructions/api-design.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Architecture Documentation](../docs/architecture.md)

## Updating These Instructions

These instructions should evolve with the project. If you notice:

- Missing patterns or use cases
- Outdated recommendations
- Areas for improvement

Please submit a pull request or create an issue with suggestions.

---

**Remember**: Copilot is a tool to enhance productivity, not replace thoughtful engineering. Always review, understand, and test generated code before committing.
