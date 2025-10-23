# Microservices Development Guide

This guide provides detailed information about developing individual microservices within the Field Services platform.

## Service Development Lifecycle

### 1. Service Creation

When creating a new microservice, follow these steps:

#### Use Spring Initializr or Maven Archetype

```bash
mvn archetype:generate \
  -DgroupId=com.hhg.fieldservices \
  -DartifactId=new-service \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

Or use [Spring Initializr](https://start.spring.io/) with:
- Spring Boot 3.x
- Java 17
- Maven
- Dependencies: Spring Web, Spring Data JPA, Spring Cloud (Eureka Client, Config Client)

#### Set Up Project Structure

```
new-service/
├── src/
│   ├── main/
│   │   ├── java/com/hhg/fieldservices/newservice/
│   │   │   ├── NewServiceApplication.java
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── model/
│   │   │   ├── dto/
│   │   │   ├── mapper/
│   │   │   └── exception/
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/
│   └── test/
├── Dockerfile
├── pom.xml
└── README.md
```

### 2. Configuration

#### application.yml

```yaml
spring:
  application:
    name: new-service
  
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/newservice_db}
    username: ${DATABASE_USERNAME:postgres}
    password: ${DATABASE_PASSWORD:postgres}
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  flyway:
    enabled: true
    baseline-on-migrate: true

server:
  port: ${PORT:8084}

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka}
  instance:
    prefer-ip-address: true

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
```

### 3. Database Setup

#### Flyway Migrations

Create migration files in `src/main/resources/db/migration/`:

**V1__create_initial_schema.sql**:
```sql
CREATE TABLE IF NOT EXISTS resources (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_created_at ON resources(created_at);
```

### 4. Implementing Core Components

#### Domain Model

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
    
    @Column(nullable = false, unique = true, length = 100)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Version
    private Long version;
}
```

#### Repository

```java
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Optional<Resource> findByName(String name);
    List<Resource> findByStatus(ResourceStatus status);
}
```

#### Service

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
        return repository.findAll().stream()
            .map(mapper::toDto)
            .collect(Collectors.toList());
    }
    
    public ResourceDto create(CreateResourceRequest request) {
        Resource resource = mapper.toEntity(request);
        resource = repository.save(resource);
        return mapper.toDto(resource);
    }
}
```

#### Controller

```java
@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
@Slf4j
public class ResourceController {
    private final ResourceService resourceService;
    
    @GetMapping
    public ResponseEntity<List<ResourceDto>> listResources() {
        return ResponseEntity.ok(resourceService.findAll());
    }
    
    @PostMapping
    public ResponseEntity<ResourceDto> createResource(@Valid @RequestBody CreateResourceRequest request) {
        ResourceDto result = resourceService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
```

## Service Communication

### Synchronous Communication (Feign)

#### 1. Add Dependencies

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

#### 2. Enable Feign Clients

```java
@SpringBootApplication
@EnableFeignClients
public class NewServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(NewServiceApplication.class, args);
    }
}
```

#### 3. Create Feign Client

```java
@FeignClient(name = "user-service", fallback = UserServiceFallback.class)
public interface UserServiceClient {
    @GetMapping("/api/v1/users/{id}")
    UserDto getUser(@PathVariable("id") Long id);
}
```

### Asynchronous Communication (Kafka)

#### 1. Add Dependencies

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

#### 2. Configure Kafka

```yaml
spring:
  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: ${spring.application.name}
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
```

#### 3. Create Producer

```java
@Component
@RequiredArgsConstructor
public class ResourceEventProducer {
    private final KafkaTemplate<String, ResourceEvent> kafkaTemplate;
    
    public void publishEvent(ResourceEvent event) {
        kafkaTemplate.send("resource-events", event);
    }
}
```

#### 4. Create Consumer

```java
@Component
@Slf4j
public class ResourceEventConsumer {
    @KafkaListener(topics = "resource-events", groupId = "${spring.application.name}")
    public void consumeEvent(ResourceEvent event) {
        log.info("Received event: {}", event);
        // Process event
    }
}
```

## Service-Specific Patterns

### Service Registry Pattern

Each service automatically registers with Eureka:

```java
@SpringBootApplication
@EnableDiscoveryClient
public class NewServiceApplication {
    // Application code
}
```

### Health Checks

Implement custom health indicators:

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        // Check service health
        boolean healthy = checkServiceHealth();
        
        if (healthy) {
            return Health.up()
                .withDetail("service", "available")
                .build();
        }
        
        return Health.down()
            .withDetail("service", "unavailable")
            .build();
    }
}
```

### Service Metrics

Add custom metrics:

```java
@Component
@RequiredArgsConstructor
public class ServiceMetrics {
    private final MeterRegistry meterRegistry;
    
    public void recordOperation(String operation) {
        Counter.builder("service.operations")
            .tag("type", operation)
            .register(meterRegistry)
            .increment();
    }
}
```

## Testing Microservices

### Unit Tests

Test individual components in isolation:

```java
@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {
    @Mock
    private ResourceRepository repository;
    
    @InjectMocks
    private ResourceService service;
    
    @Test
    void testFindAll() {
        // Test implementation
    }
}
```

### Integration Tests

Test with real Spring context:

```java
@SpringBootTest
@AutoConfigureMockMvc
class ResourceIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testCreateResource() throws Exception {
        // Test implementation
    }
}
```

### Contract Tests

Ensure API compatibility:

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureRestDocs
class ApiContractTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void documentResourceCreation() throws Exception {
        // Document API with Spring REST Docs
    }
}
```

## Deployment

### Dockerfile

```dockerfile
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Build Docker Image

```bash
mvn clean package
docker build -t field-services/new-service:1.0.0 .
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: new-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: new-service
  template:
    metadata:
      labels:
        app: new-service
    spec:
      containers:
      - name: new-service
        image: field-services/new-service:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
```

## Best Practices

### Service Design

1. **Single Responsibility**: Each service should have one well-defined purpose
2. **Loose Coupling**: Minimize dependencies between services
3. **High Cohesion**: Related functionality should be in the same service
4. **API-First**: Design APIs before implementation

### Data Management

1. **Database per Service**: Each service owns its data
2. **Event Sourcing**: Consider for audit trails
3. **CQRS**: Separate read and write models for complex scenarios
4. **Eventual Consistency**: Accept for non-critical operations

### Communication

1. **Sync for Queries**: Use REST/Feign for read operations
2. **Async for Commands**: Use events for state changes
3. **Circuit Breakers**: Protect against cascading failures
4. **Retries**: Implement with exponential backoff

### Security

1. **Authentication**: JWT tokens validated at API gateway
2. **Authorization**: Method-level security in services
3. **Secrets**: Never hardcode, use environment variables
4. **Input Validation**: Validate all external input

### Monitoring

1. **Logging**: Structured JSON logs with correlation IDs
2. **Metrics**: Business and technical metrics
3. **Tracing**: Distributed tracing with Zipkin
4. **Alerts**: Proactive monitoring and alerting

## Service Documentation

Each service should include:

### README.md

```markdown
# Service Name

Brief description of the service.

## Responsibilities
- What this service does
- Key features

## API Endpoints
- List of main endpoints

## Dependencies
- External services
- Databases
- Message queues

## Configuration
- Required environment variables
- Configuration options

## Running Locally
- How to run the service

## Testing
- How to run tests

## Deployment
- Deployment instructions
```

### API Documentation

Use OpenAPI/Swagger for interactive documentation.

### Architecture Decision Records (ADRs)

Document important architectural decisions.

## Common Pitfalls

1. **Too Many Dependencies**: Keep service dependencies minimal
2. **Shared Databases**: Each service should have its own database
3. **Chatty Communication**: Minimize service-to-service calls
4. **Ignoring Failures**: Always handle failures gracefully
5. **Missing Monitoring**: Instrument all services from the start

## Resources

- [Main Copilot Instructions](../../.github/copilot-instructions.md)
- [Spring Boot Guide](../../.github/copilot-instructions/spring-boot.md)
- [Microservices Patterns](../../.github/copilot-instructions/microservices.md)
- [Testing Guide](../../.github/copilot-instructions/testing.md)
- [Architecture Guide](../architecture.md)
