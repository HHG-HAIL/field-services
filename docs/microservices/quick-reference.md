# Quick Reference Guide

This quick reference provides common patterns, commands, and code snippets for the Field Services project.

## Table of Contents

- [Project Setup](#project-setup)
- [Common Commands](#common-commands)
- [Code Snippets](#code-snippets)
- [GitHub Copilot Prompts](#github-copilot-prompts)
- [Troubleshooting](#troubleshooting)

## Project Setup

### Clone and Build

```bash
# Clone repository
git clone https://github.com/HHG-HAIL/field-services.git
cd field-services

# Build all services
mvn clean install

# Build specific service
mvn clean install -pl services/user-service
```

### Start Infrastructure

```bash
# Start all infrastructure services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Run Service

```bash
# Using Maven
cd services/user-service
mvn spring-boot:run

# Using JAR
java -jar target/user-service-1.0.0.jar

# With specific profile
java -jar target/user-service-1.0.0.jar --spring.profiles.active=dev
```

## Common Commands

### Maven

```bash
# Clean build
mvn clean install

# Skip tests
mvn clean install -DskipTests

# Run tests only
mvn test

# Run specific test
mvn test -Dtest=ResourceServiceTest

# Generate test coverage report
mvn clean test jacoco:report

# Check code style
mvn checkstyle:check

# Update dependencies
mvn versions:display-dependency-updates
```

### Git

```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "feat(service): description"

# Push branch
git push origin feature/feature-name

# Update from main
git fetch origin
git rebase origin/main

# View changes
git status
git diff
```

### Docker

```bash
# Build image
docker build -t field-services/service-name:1.0.0 .

# Run container
docker run -p 8080:8080 field-services/service-name:1.0.0

# View logs
docker logs container-name

# Execute command in container
docker exec -it container-name /bin/sh

# Remove unused images
docker image prune -a
```

### Kubernetes

```bash
# Apply deployment
kubectl apply -f deployment.yaml

# Get pods
kubectl get pods

# View logs
kubectl logs pod-name

# Scale deployment
kubectl scale deployment service-name --replicas=3

# Port forward
kubectl port-forward service/service-name 8080:8080
```

## Code Snippets

### REST Controller

```java
@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
@Slf4j
public class ResourceController {
    
    private final ResourceService resourceService;
    
    @GetMapping
    public ResponseEntity<List<ResourceDto>> list() {
        return ResponseEntity.ok(resourceService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ResourceDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.findById(id));
    }
    
    @PostMapping
    public ResponseEntity<ResourceDto> create(@Valid @RequestBody CreateRequest request) {
        ResourceDto result = resourceService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ResourceDto> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRequest request) {
        return ResponseEntity.ok(resourceService.update(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Service Layer

```java
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ResourceService {
    
    private final ResourceRepository repository;
    private final ResourceMapper mapper;
    
    @Transactional(readOnly = true)
    public List<ResourceDto> findAll() {
        log.debug("Finding all resources");
        return repository.findAll().stream()
            .map(mapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ResourceDto findById(Long id) {
        log.debug("Finding resource by id: {}", id);
        return repository.findById(id)
            .map(mapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
    }
    
    public ResourceDto create(CreateRequest request) {
        log.debug("Creating resource: {}", request);
        Resource resource = mapper.toEntity(request);
        resource = repository.save(resource);
        return mapper.toDto(resource);
    }
}
```

### Repository

```java
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Optional<Resource> findByName(String name);
    List<Resource> findByStatus(Status status);
    Page<Resource> findByStatus(Status status, Pageable pageable);
    
    @Query("SELECT r FROM Resource r WHERE r.name LIKE %:searchTerm%")
    List<Resource> search(@Param("searchTerm") String searchTerm);
}
```

### Entity

```java
@Entity
@Table(name = "resources")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Version
    private Long version;
}
```

### DTO (Record)

```java
public record ResourceDto(
    Long id,
    String name,
    String description,
    Status status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}

public record CreateRequest(
    @NotBlank @Size(min = 3, max = 100) String name,
    @Size(max = 500) String description,
    @NotNull Status status
) {}
```

### Exception Handler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        
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

### Unit Test

```java
@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {
    
    @Mock
    private ResourceRepository repository;
    
    @Mock
    private ResourceMapper mapper;
    
    @InjectMocks
    private ResourceService service;
    
    @Test
    void givenValidId_whenFindById_thenReturnsResource() {
        // Given
        Long id = 1L;
        Resource resource = new Resource();
        ResourceDto dto = new ResourceDto(id, "Test", null, null, null, null);
        
        when(repository.findById(id)).thenReturn(Optional.of(resource));
        when(mapper.toDto(resource)).thenReturn(dto);
        
        // When
        ResourceDto result = service.findById(id);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        verify(repository).findById(id);
    }
}
```

### Integration Test

```java
@SpringBootTest
@AutoConfigureMockMvc
class ResourceIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private ResourceRepository repository;
    
    @AfterEach
    void tearDown() {
        repository.deleteAll();
    }
    
    @Test
    void givenValidRequest_whenCreate_thenReturnsCreated() throws Exception {
        CreateRequest request = new CreateRequest("Test", "Description", Status.ACTIVE);
        
        mockMvc.perform(post("/api/v1/resources")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Test"));
    }
}
```

## GitHub Copilot Prompts

### Creating a Controller

```java
// Create a REST controller for managing orders
// Include CRUD operations with pagination and search
// Follow RESTful conventions and include proper validation
// Use DTOs for request/response
```

### Creating a Service

```java
// Create a service for order management
// Include business logic for order processing
// Implement proper error handling and logging
// Use transactions where appropriate
```

### Creating Tests

```java
// Create comprehensive unit tests for OrderService
// Test all methods including happy path and error scenarios
// Use Mockito for mocking dependencies
// Follow AAA (Arrange-Act-Assert) pattern
```

### Creating DTOs

```java
// Create DTOs for order management
// Include validation annotations
// Use Java records for immutability
// Add proper JavaDoc comments
```

## Troubleshooting

### Service Won't Start

```bash
# Check if port is in use
lsof -i :8080

# Check application logs
tail -f logs/application.log

# Verify configuration
cat src/main/resources/application.yml
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Test connection
psql -h localhost -U postgres -d dbname

# Check environment variables
echo $DATABASE_URL
```

### Test Failures

```bash
# Run with verbose output
mvn test -X

# Run specific test
mvn test -Dtest=ClassName#methodName

# Clear Maven cache
mvn dependency:purge-local-repository
```

### Docker Build Issues

```bash
# Clean Docker cache
docker builder prune

# Build without cache
docker build --no-cache -t image-name .

# Check Dockerfile
docker build -t image-name . --progress=plain
```

## Environment Variables

### Development

```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/dev_db
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=postgres
export EUREKA_SERVER_URL=http://localhost:8761/eureka
export SPRING_PROFILES_ACTIVE=local
```

### Testing

```bash
export SPRING_PROFILES_ACTIVE=test
export DATABASE_URL=jdbc:h2:mem:testdb
```

## Useful URLs

### Local Development

- Service Registry: http://localhost:8761
- API Gateway: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Actuator Health: http://localhost:8080/actuator/health
- Zipkin UI: http://localhost:9411

### Documentation

- [Main README](../../README.md)
- [Contributing Guide](../../CONTRIBUTING.md)
- [Developer Guide](../developer-guide.md)
- [Architecture Guide](../architecture.md)
- [API Guide](../api-guide.md)
- [Copilot Instructions](../../.github/copilot-instructions.md)

## Common Patterns

### Pagination

```java
@GetMapping
public ResponseEntity<Page<ResourceDto>> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "id,desc") String[] sort) {
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(
        Arrays.stream(sort)
            .map(s -> s.split(","))
            .map(arr -> new Sort.Order(
                arr.length > 1 ? Sort.Direction.fromString(arr[1]) : Sort.Direction.ASC,
                arr[0]))
            .toArray(Sort.Order[]::new)
    ));
    
    return ResponseEntity.ok(service.findAll(pageable));
}
```

### Feign Client

```java
@FeignClient(name = "service-name", fallback = ServiceFallback.class)
public interface ServiceClient {
    @GetMapping("/api/v1/resources/{id}")
    ResourceDto getResource(@PathVariable("id") Long id);
}

@Component
class ServiceFallback implements ServiceClient {
    @Override
    public ResourceDto getResource(Long id) {
        return new ResourceDto(id, "Unavailable", null, null, null, null);
    }
}
```

### Kafka Producer/Consumer

```java
// Producer
@Component
@RequiredArgsConstructor
public class EventProducer {
    private final KafkaTemplate<String, Event> kafkaTemplate;
    
    public void publish(Event event) {
        kafkaTemplate.send("topic-name", event);
    }
}

// Consumer
@Component
@Slf4j
public class EventConsumer {
    @KafkaListener(topics = "topic-name", groupId = "${spring.application.name}")
    public void consume(Event event) {
        log.info("Received: {}", event);
    }
}
```

## Tips

1. **Use Lombok** to reduce boilerplate code
2. **Enable JPA Auditing** for automatic timestamps
3. **Use MapStruct** for entity-DTO mapping
4. **Implement Circuit Breakers** for external calls
5. **Add Correlation IDs** for request tracing
6. **Use Records** for immutable DTOs
7. **Enable Actuator** for monitoring
8. **Write Tests First** when possible
9. **Review Copilot Suggestions** before accepting
10. **Keep Services Small** and focused
