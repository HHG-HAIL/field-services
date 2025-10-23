# Spring Boot Copilot Instructions

Specific guidelines for using GitHub Copilot with Spring Boot development in the Field Services project.

## Spring Boot Application Structure

### Main Application Class

```java
package com.hhg.fieldservices.servicename;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Main application class for [Service Name] service.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class ServiceNameApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceNameApplication.class, args);
    }
}
```

## REST Controllers

### Standard Controller Pattern

When creating controllers, follow this pattern:

```java
package com.hhg.fieldservices.servicename.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for managing [Resource] entities.
 */
@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
@Slf4j
public class ResourceController {

    private final ResourceService resourceService;

    /**
     * Retrieves all resources.
     *
     * @return list of resource DTOs
     */
    @GetMapping
    public ResponseEntity<List<ResourceDto>> getAllResources() {
        log.debug("REST request to get all Resources");
        List<ResourceDto> resources = resourceService.findAll();
        return ResponseEntity.ok(resources);
    }

    /**
     * Retrieves a single resource by ID.
     *
     * @param id the resource ID
     * @return the resource DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceDto> getResourceById(@PathVariable Long id) {
        log.debug("REST request to get Resource : {}", id);
        ResourceDto resource = resourceService.findById(id);
        return ResponseEntity.ok(resource);
    }

    /**
     * Creates a new resource.
     *
     * @param request the resource creation request
     * @return the created resource DTO
     */
    @PostMapping
    public ResponseEntity<ResourceDto> createResource(@Valid @RequestBody CreateResourceRequest request) {
        log.debug("REST request to save Resource : {}", request);
        ResourceDto result = resourceService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * Updates an existing resource.
     *
     * @param id the resource ID
     * @param request the update request
     * @return the updated resource DTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResourceDto> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody UpdateResourceRequest request) {
        log.debug("REST request to update Resource : {}, {}", id, request);
        ResourceDto result = resourceService.update(id, request);
        return ResponseEntity.ok(result);
    }

    /**
     * Deletes a resource by ID.
     *
     * @param id the resource ID
     * @return no content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        log.debug("REST request to delete Resource : {}", id);
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Pagination and Sorting

```java
@GetMapping
public ResponseEntity<Page<ResourceDto>> getAllResources(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "id,desc") String[] sort) {
    
    log.debug("REST request to get page of Resources");
    
    List<Sort.Order> orders = Arrays.stream(sort)
            .map(s -> s.split(","))
            .map(arr -> new Sort.Order(
                    arr.length > 1 ? Sort.Direction.fromString(arr[1]) : Sort.Direction.ASC,
                    arr[0]))
            .toList();
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(orders));
    Page<ResourceDto> resources = resourceService.findAll(pageable);
    
    return ResponseEntity.ok(resources);
}
```

## Service Layer

### Service Pattern

```java
package com.hhg.fieldservices.servicename.service;

import com.hhg.fieldservices.servicename.dto.*;
import com.hhg.fieldservices.servicename.exception.ResourceNotFoundException;
import com.hhg.fieldservices.servicename.model.Resource;
import com.hhg.fieldservices.servicename.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link Resource}.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceMapper resourceMapper;

    /**
     * Get all resources.
     *
     * @return the list of resources
     */
    @Transactional(readOnly = true)
    public List<ResourceDto> findAll() {
        log.debug("Request to get all Resources");
        return resourceRepository.findAll().stream()
                .map(resourceMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all resources with pagination.
     *
     * @param pageable the pagination information
     * @return the page of resources
     */
    @Transactional(readOnly = true)
    public Page<ResourceDto> findAll(Pageable pageable) {
        log.debug("Request to get all Resources with pagination");
        return resourceRepository.findAll(pageable)
                .map(resourceMapper::toDto);
    }

    /**
     * Get one resource by id.
     *
     * @param id the id of the resource
     * @return the resource
     * @throws ResourceNotFoundException if resource not found
     */
    @Transactional(readOnly = true)
    public ResourceDto findById(Long id) {
        log.debug("Request to get Resource : {}", id);
        return resourceRepository.findById(id)
                .map(resourceMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    /**
     * Save a resource.
     *
     * @param request the resource to save
     * @return the persisted resource
     */
    public ResourceDto create(CreateResourceRequest request) {
        log.debug("Request to save Resource : {}", request);
        Resource resource = resourceMapper.toEntity(request);
        resource = resourceRepository.save(resource);
        return resourceMapper.toDto(resource);
    }

    /**
     * Update a resource.
     *
     * @param id the id of the resource to update
     * @param request the updated resource data
     * @return the updated resource
     * @throws ResourceNotFoundException if resource not found
     */
    public ResourceDto update(Long id, UpdateResourceRequest request) {
        log.debug("Request to update Resource : {}, {}", id, request);
        
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        
        resourceMapper.updateEntityFromDto(request, resource);
        resource = resourceRepository.save(resource);
        
        return resourceMapper.toDto(resource);
    }

    /**
     * Delete the resource by id.
     *
     * @param id the id of the resource
     * @throws ResourceNotFoundException if resource not found
     */
    public void delete(Long id) {
        log.debug("Request to delete Resource : {}", id);
        
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with id: " + id);
        }
        
        resourceRepository.deleteById(id);
    }
}
```

## Data Transfer Objects (DTOs)

### Record-based DTOs (Java 17+)

```java
package com.hhg.fieldservices.servicename.dto;

import javax.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * DTO for Resource entity.
 */
public record ResourceDto(
    Long id,
    String name,
    String description,
    ResourceStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}

/**
 * DTO for creating a new Resource.
 */
public record CreateResourceRequest(
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    String name,
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    String description,
    
    @NotNull(message = "Status is required")
    ResourceStatus status
) {}

/**
 * DTO for updating an existing Resource.
 */
public record UpdateResourceRequest(
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    String name,
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    String description,
    
    @NotNull(message = "Status is required")
    ResourceStatus status
) {}
```

## Entity Models

### JPA Entity Pattern

```java
package com.hhg.fieldservices.servicename.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing a Resource.
 */
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

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ResourceStatus status;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    @Column(name = "version")
    private Long version;
}
```

## Repository Layer

### Spring Data JPA Repository

```java
package com.hhg.fieldservices.servicename.repository;

import com.hhg.fieldservices.servicename.model.Resource;
import com.hhg.fieldservices.servicename.model.ResourceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Resource entity.
 */
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    /**
     * Find a resource by name.
     *
     * @param name the name to search for
     * @return the resource if found
     */
    Optional<Resource> findByName(String name);

    /**
     * Find all resources with a specific status.
     *
     * @param status the status to filter by
     * @return list of resources
     */
    List<Resource> findByStatus(ResourceStatus status);

    /**
     * Find all resources with a specific status (paginated).
     *
     * @param status the status to filter by
     * @param pageable pagination information
     * @return page of resources
     */
    Page<Resource> findByStatus(ResourceStatus status, Pageable pageable);

    /**
     * Custom query to find resources by name containing search term.
     *
     * @param searchTerm the term to search for
     * @param pageable pagination information
     * @return page of resources
     */
    @Query("SELECT r FROM Resource r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Resource> searchByName(@Param("searchTerm") String searchTerm, Pageable pageable);
}
```

## Exception Handling

### Custom Exceptions

```java
package com.hhg.fieldservices.servicename.exception;

/**
 * Exception thrown when a resource is not found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

### Global Exception Handler

```java
package com.hhg.fieldservices.servicename.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handle ResourceNotFoundException.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage());
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            "Resource Not Found",
            ex.getMessage(),
            LocalDateTime.now()
        );
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handle validation errors.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        log.error("Validation error: {}", ex.getMessage());
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ValidationErrorResponse response = new ValidationErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation Failed",
            errors,
            LocalDateTime.now()
        );
        
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle generic exceptions.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            "An unexpected error occurred",
            LocalDateTime.now()
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

/**
 * Error response DTO.
 */
record ErrorResponse(
    int status,
    String error,
    String message,
    LocalDateTime timestamp
) {}

/**
 * Validation error response DTO.
 */
record ValidationErrorResponse(
    int status,
    String error,
    Map<String, String> validationErrors,
    LocalDateTime timestamp
) {}
```

## Configuration

### Application Configuration

```yaml
# application.yml
spring:
  application:
    name: service-name
  
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/servicedb}
    username: ${DATABASE_USERNAME:postgres}
    password: ${DATABASE_PASSWORD:password}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration

server:
  port: ${PORT:8080}
  servlet:
    context-path: /

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka}
  instance:
    prefer-ip-address: true

logging:
  level:
    root: INFO
    com.hhg.fieldservices: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized
```

## MapStruct Mappers

### Entity-DTO Mapping

```java
package com.hhg.fieldservices.servicename.mapper;

import com.hhg.fieldservices.servicename.dto.*;
import com.hhg.fieldservices.servicename.model.Resource;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Resource} and its DTOs.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ResourceMapper {

    /**
     * Convert entity to DTO.
     */
    ResourceDto toDto(Resource entity);

    /**
     * Convert DTO to entity.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Resource toEntity(CreateResourceRequest dto);

    /**
     * Update entity from DTO.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntityFromDto(UpdateResourceRequest dto, @MappingTarget Resource entity);
}
```

## Best Practices Summary

1. **Use constructor injection** (via `@RequiredArgsConstructor`)
2. **Add logging** at appropriate levels (DEBUG for request logging, ERROR for exceptions)
3. **Validate input** using Bean Validation annotations
4. **Use DTOs** for API contracts, never expose entities directly
5. **Handle exceptions** globally with `@RestControllerAdvice`
6. **Follow REST conventions** for endpoint naming and HTTP methods
7. **Document APIs** with JavaDoc and OpenAPI/Swagger annotations
8. **Use transactions** appropriately (`@Transactional`)
9. **Enable JPA auditing** for created/modified timestamps
10. **Externalize configuration** using environment variables or config server
