# Microservices Copilot Instructions

Guidelines for implementing microservices patterns using GitHub Copilot in the Field Services project.

## Microservices Architecture Overview

Our architecture follows these key principles:

- **Service Independence**: Each service owns its data and business logic
- **API-First Design**: Well-defined contracts between services
- **Distributed Systems**: Resilience, fault tolerance, and graceful degradation
- **Event-Driven**: Asynchronous communication where appropriate
- **Observability**: Comprehensive logging, monitoring, and tracing

## Service Discovery

### Eureka Client Configuration

```java
package com.hhg.fieldservices.servicename.config;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for service discovery.
 */
@Configuration
@EnableDiscoveryClient
public class DiscoveryConfig {
    // Additional discovery configuration can be added here
}
```

### Application Configuration

```yaml
eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka}
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
    instance-id: ${spring.application.name}:${spring.application.instance_id:${random.value}}
    lease-renewal-interval-in-seconds: 10
    lease-expiration-duration-in-seconds: 30
```

## Inter-Service Communication

### Feign Clients (Synchronous)

```java
package com.hhg.fieldservices.servicename.client;

import com.hhg.fieldservices.servicename.dto.ExternalServiceDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Feign client for communicating with the External Service.
 */
@FeignClient(
    name = "external-service",
    fallback = ExternalServiceClientFallback.class
)
public interface ExternalServiceClient {

    @GetMapping("/api/v1/resources/{id}")
    ExternalServiceDto getResource(@PathVariable("id") Long id);

    @GetMapping("/api/v1/resources")
    List<ExternalServiceDto> getAllResources();

    @PostMapping("/api/v1/resources")
    ExternalServiceDto createResource(@RequestBody CreateExternalResourceRequest request);
}
```

### Feign Client Fallback (Circuit Breaker)

```java
package com.hhg.fieldservices.servicename.client;

import com.hhg.fieldservices.servicename.dto.ExternalServiceDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * Fallback implementation for ExternalServiceClient.
 * Provides default responses when the external service is unavailable.
 */
@Component
@Slf4j
public class ExternalServiceClientFallback implements ExternalServiceClient {

    @Override
    public ExternalServiceDto getResource(Long id) {
        log.warn("Fallback: External service unavailable for resource {}", id);
        return new ExternalServiceDto(id, "Service Unavailable", null);
    }

    @Override
    public List<ExternalServiceDto> getAllResources() {
        log.warn("Fallback: External service unavailable for all resources");
        return Collections.emptyList();
    }

    @Override
    public ExternalServiceDto createResource(CreateExternalResourceRequest request) {
        log.warn("Fallback: External service unavailable for creating resource");
        throw new ServiceUnavailableException("External service is currently unavailable");
    }
}
```

### Feign Configuration

```java
package com.hhg.fieldservices.servicename.config;

import feign.Logger;
import feign.Request;
import feign.Retryer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Configuration for Feign clients.
 */
@Configuration
public class FeignConfig {

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public Request.Options requestOptions() {
        return new Request.Options(
            5000, TimeUnit.MILLISECONDS,  // connect timeout
            10000, TimeUnit.MILLISECONDS  // read timeout
        );
    }

    @Bean
    public Retryer retryer() {
        return new Retryer.Default(
            100,   // initial interval
            1000,  // max interval
            3      // max attempts
        );
    }
}
```

## Circuit Breaker with Resilience4j

### Resilience4j Configuration

```yaml
resilience4j:
  circuitbreaker:
    instances:
      externalService:
        register-health-indicator: true
        sliding-window-size: 10
        minimum-number-of-calls: 5
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
        wait-duration-in-open-state: 10s
        failure-rate-threshold: 50
        event-consumer-buffer-size: 10
  
  retry:
    instances:
      externalService:
        max-attempts: 3
        wait-duration: 1s
        enable-exponential-backoff: true
        exponential-backoff-multiplier: 2
  
  timelimiter:
    instances:
      externalService:
        timeout-duration: 5s
```

### Using Circuit Breaker in Service

```java
package com.hhg.fieldservices.servicename.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Service that communicates with external services using circuit breaker pattern.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ExternalIntegrationService {

    private final ExternalServiceClient externalServiceClient;

    /**
     * Get resource from external service with circuit breaker.
     */
    @CircuitBreaker(name = "externalService", fallbackMethod = "getResourceFallback")
    @Retry(name = "externalService")
    public ExternalServiceDto getResource(Long id) {
        log.debug("Calling external service for resource {}", id);
        return externalServiceClient.getResource(id);
    }

    /**
     * Fallback method for getResource.
     */
    private ExternalServiceDto getResourceFallback(Long id, Exception ex) {
        log.error("Fallback for getResource called for id {}: {}", id, ex.getMessage());
        return new ExternalServiceDto(id, "Service Unavailable", null);
    }

    /**
     * Get all resources with timeout.
     */
    @TimeLimiter(name = "externalService")
    @CircuitBreaker(name = "externalService", fallbackMethod = "getAllResourcesFallback")
    public CompletableFuture<List<ExternalServiceDto>> getAllResourcesAsync() {
        log.debug("Calling external service for all resources asynchronously");
        return CompletableFuture.supplyAsync(() -> externalServiceClient.getAllResources());
    }

    /**
     * Fallback for getAllResourcesAsync.
     */
    private CompletableFuture<List<ExternalServiceDto>> getAllResourcesFallback(Exception ex) {
        log.error("Fallback for getAllResourcesAsync: {}", ex.getMessage());
        return CompletableFuture.completedFuture(Collections.emptyList());
    }
}
```

## Event-Driven Communication

### Apache Kafka Configuration

```yaml
spring:
  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    consumer:
      group-id: ${spring.application.name}
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      acks: all
      retries: 3
```

### Kafka Producer

```java
package com.hhg.fieldservices.servicename.messaging;

import com.hhg.fieldservices.servicename.dto.ResourceEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Kafka producer for publishing resource events.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ResourceEventProducer {

    private static final String TOPIC = "resource-events";
    
    private final KafkaTemplate<String, ResourceEvent> kafkaTemplate;

    /**
     * Publish a resource event to Kafka.
     *
     * @param event the resource event to publish
     */
    public void publishResourceEvent(ResourceEvent event) {
        log.debug("Publishing resource event: {}", event);
        
        CompletableFuture<SendResult<String, ResourceEvent>> future = 
            kafkaTemplate.send(TOPIC, event.getResourceId().toString(), event);
        
        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish resource event: {}", event, ex);
            } else {
                log.debug("Resource event published successfully: {}, offset: {}",
                    event, result.getRecordMetadata().offset());
            }
        });
    }
}
```

### Kafka Consumer

```java
package com.hhg.fieldservices.servicename.messaging;

import com.hhg.fieldservices.servicename.dto.ResourceEvent;
import com.hhg.fieldservices.servicename.service.ResourceEventHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/**
 * Kafka consumer for processing resource events.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ResourceEventConsumer {

    private final ResourceEventHandler eventHandler;

    /**
     * Listen for resource events from Kafka.
     *
     * @param event the resource event
     * @param partition the partition
     * @param offset the offset
     */
    @KafkaListener(
        topics = "resource-events",
        groupId = "${spring.application.name}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeResourceEvent(
            @Payload ResourceEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {
        
        log.debug("Received resource event from partition {} with offset {}: {}", 
            partition, offset, event);
        
        try {
            eventHandler.handleResourceEvent(event);
            log.debug("Successfully processed resource event: {}", event);
        } catch (Exception ex) {
            log.error("Failed to process resource event: {}", event, ex);
            // Could implement dead letter queue here
        }
    }
}
```

### Event DTOs

```java
package com.hhg.fieldservices.servicename.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Event representing a change to a Resource.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceEvent {
    
    private Long resourceId;
    private ResourceEventType eventType;
    private String resourceName;
    private ResourceStatus status;
    private LocalDateTime timestamp;
    private String source;
}

/**
 * Types of resource events.
 */
public enum ResourceEventType {
    CREATED,
    UPDATED,
    DELETED,
    STATUS_CHANGED
}
```

## API Gateway Integration

### Gateway Routes Configuration

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/v1/users/**
          filters:
            - StripPrefix=0
            - name: CircuitBreaker
              args:
                name: userServiceCircuitBreaker
                fallbackUri: forward:/fallback/users
        
        - id: resource-service
          uri: lb://resource-service
          predicates:
            - Path=/api/v1/resources/**
          filters:
            - StripPrefix=0
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
```

## Distributed Tracing

### Sleuth and Zipkin Configuration

```yaml
spring:
  sleuth:
    sampler:
      probability: 1.0  # Sample 100% in development, lower in production
  zipkin:
    base-url: ${ZIPKIN_URL:http://localhost:9411}
    enabled: true
```

### Adding Trace Information

```java
package com.hhg.fieldservices.servicename.service;

import brave.Tracer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service with distributed tracing support.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TracedService {

    private final Tracer tracer;
    private final ExternalServiceClient externalClient;

    /**
     * Method with custom span for detailed tracing.
     */
    public void processWithTracing(Long resourceId) {
        // Current span is automatically propagated
        log.info("Processing resource {}", resourceId);
        
        // Create a custom span for a specific operation
        var span = tracer.nextSpan().name("custom-operation").start();
        try {
            // Your business logic here
            externalClient.getResource(resourceId);
            span.tag("resource.id", resourceId.toString());
        } catch (Exception ex) {
            span.tag("error", ex.getMessage());
            throw ex;
        } finally {
            span.finish();
        }
    }
}
```

## Configuration Management

### Spring Cloud Config Client

```yaml
spring:
  application:
    name: resource-service
  
  config:
    import: optional:configserver:${CONFIG_SERVER_URL:http://localhost:8888}
  
  cloud:
    config:
      fail-fast: false
      retry:
        initial-interval: 1000
        max-attempts: 6
        max-interval: 2000
        multiplier: 1.1
```

### Refresh Configuration at Runtime

```java
package com.hhg.fieldservices.servicename.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

/**
 * Configuration properties that can be refreshed at runtime.
 */
@Component
@ConfigurationProperties(prefix = "app")
@RefreshScope
@Data
public class AppConfig {
    
    private String feature1Enabled;
    private int maxRetryAttempts;
    private long timeoutMs;
}
```

## Health Checks and Metrics

### Custom Health Indicator

```java
package com.hhg.fieldservices.servicename.health;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

/**
 * Custom health indicator for external service connectivity.
 */
@Component
@RequiredArgsConstructor
public class ExternalServiceHealthIndicator implements HealthIndicator {

    private final ExternalServiceClient externalClient;

    @Override
    public Health health() {
        try {
            // Perform a lightweight check
            externalClient.healthCheck();
            return Health.up()
                .withDetail("external-service", "Available")
                .build();
        } catch (Exception ex) {
            return Health.down()
                .withDetail("external-service", "Unavailable")
                .withException(ex)
                .build();
        }
    }
}
```

### Custom Metrics

```java
package com.hhg.fieldservices.servicename.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Custom metrics for resource operations.
 */
@Component
@RequiredArgsConstructor
public class ResourceMetrics {

    private final MeterRegistry meterRegistry;

    /**
     * Record a resource creation event.
     */
    public void recordResourceCreated() {
        Counter.builder("resources.created")
            .description("Number of resources created")
            .tag("service", "resource-service")
            .register(meterRegistry)
            .increment();
    }

    /**
     * Record resource processing time.
     */
    public void recordProcessingTime(Runnable operation) {
        Timer.builder("resources.processing.time")
            .description("Time taken to process a resource")
            .tag("service", "resource-service")
            .register(meterRegistry)
            .record(operation);
    }
}
```

## Security in Microservices

### JWT Token Validation

```java
package com.hhg.fieldservices.servicename.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for the microservice.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        
        return http.build();
    }
}
```

## Best Practices Summary

1. **Service Independence**: Each service should own its data and not directly access other services' databases
2. **API Contracts**: Define clear API contracts and use versioning
3. **Resilience**: Implement circuit breakers, retries, and timeouts for all inter-service communication
4. **Asynchronous Communication**: Use event-driven patterns for non-critical operations
5. **Observability**: Implement comprehensive logging, distributed tracing, and metrics
6. **Configuration**: Externalize configuration and use config server for centralized management
7. **Security**: Implement JWT-based authentication and authorize at the API gateway and service levels
8. **Health Checks**: Provide meaningful health indicators for monitoring
9. **Versioning**: Version your APIs to maintain backward compatibility
10. **Documentation**: Document service dependencies and communication patterns
