# Testing Copilot Instructions

Comprehensive testing guidelines for using GitHub Copilot to generate tests in the Field Services Spring Boot microservices project.

## Testing Strategy

Our testing strategy follows the testing pyramid:

1. **Unit Tests** (70-80%): Fast, isolated tests for individual components
2. **Integration Tests** (15-25%): Test component interactions and external dependencies
3. **End-to-End Tests** (5-10%): Test complete user workflows

## Unit Testing

### Controller Tests

Use `@WebMvcTest` for testing controllers in isolation:

```java
package com.hhg.fieldservices.servicename.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hhg.fieldservices.servicename.dto.*;
import com.hhg.fieldservices.servicename.exception.ResourceNotFoundException;
import com.hhg.fieldservices.servicename.service.ResourceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for {@link ResourceController}.
 */
@WebMvcTest(ResourceController.class)
class ResourceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ResourceService resourceService;

    @Test
    void givenResources_whenGetAllResources_thenReturnsResourceList() throws Exception {
        // Given
        List<ResourceDto> resources = Arrays.asList(
            new ResourceDto(1L, "Resource 1", "Description 1", ResourceStatus.ACTIVE, null, null),
            new ResourceDto(2L, "Resource 2", "Description 2", ResourceStatus.INACTIVE, null, null)
        );
        when(resourceService.findAll()).thenReturn(resources);

        // When & Then
        mockMvc.perform(get("/api/v1/resources")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].name", is("Resource 1")))
            .andExpect(jsonPath("$[1].name", is("Resource 2")));

        verify(resourceService).findAll();
    }

    @Test
    void givenValidId_whenGetResourceById_thenReturnsResource() throws Exception {
        // Given
        Long resourceId = 1L;
        ResourceDto resource = new ResourceDto(
            resourceId, "Test Resource", "Description", ResourceStatus.ACTIVE, null, null
        );
        when(resourceService.findById(resourceId)).thenReturn(resource);

        // When & Then
        mockMvc.perform(get("/api/v1/resources/{id}", resourceId)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(resourceId.intValue())))
            .andExpect(jsonPath("$.name", is("Test Resource")))
            .andExpect(jsonPath("$.status", is("ACTIVE")));

        verify(resourceService).findById(resourceId);
    }

    @Test
    void givenInvalidId_whenGetResourceById_thenReturnsNotFound() throws Exception {
        // Given
        Long resourceId = 999L;
        when(resourceService.findById(resourceId))
            .thenThrow(new ResourceNotFoundException("Resource not found with id: " + resourceId));

        // When & Then
        mockMvc.perform(get("/api/v1/resources/{id}", resourceId)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message", containsString("Resource not found")));

        verify(resourceService).findById(resourceId);
    }

    @Test
    void givenValidRequest_whenCreateResource_thenReturnsCreatedResource() throws Exception {
        // Given
        CreateResourceRequest request = new CreateResourceRequest(
            "New Resource", "New Description", ResourceStatus.ACTIVE
        );
        ResourceDto createdResource = new ResourceDto(
            1L, request.name(), request.description(), request.status(), null, null
        );
        when(resourceService.create(any(CreateResourceRequest.class))).thenReturn(createdResource);

        // When & Then
        mockMvc.perform(post("/api/v1/resources")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.name", is("New Resource")))
            .andExpect(jsonPath("$.status", is("ACTIVE")));

        verify(resourceService).create(any(CreateResourceRequest.class));
    }

    @Test
    void givenInvalidRequest_whenCreateResource_thenReturnsBadRequest() throws Exception {
        // Given - empty name is invalid
        CreateResourceRequest request = new CreateResourceRequest(
            "", "Description", ResourceStatus.ACTIVE
        );

        // When & Then
        mockMvc.perform(post("/api/v1/resources")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.validationErrors.name").exists());

        verify(resourceService, never()).create(any());
    }

    @Test
    void givenValidRequest_whenUpdateResource_thenReturnsUpdatedResource() throws Exception {
        // Given
        Long resourceId = 1L;
        UpdateResourceRequest request = new UpdateResourceRequest(
            "Updated Resource", "Updated Description", ResourceStatus.INACTIVE
        );
        ResourceDto updatedResource = new ResourceDto(
            resourceId, request.name(), request.description(), request.status(), null, null
        );
        when(resourceService.update(eq(resourceId), any(UpdateResourceRequest.class)))
            .thenReturn(updatedResource);

        // When & Then
        mockMvc.perform(put("/api/v1/resources/{id}", resourceId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(resourceId.intValue())))
            .andExpect(jsonPath("$.name", is("Updated Resource")))
            .andExpect(jsonPath("$.status", is("INACTIVE")));

        verify(resourceService).update(eq(resourceId), any(UpdateResourceRequest.class));
    }

    @Test
    void givenValidId_whenDeleteResource_thenReturnsNoContent() throws Exception {
        // Given
        Long resourceId = 1L;
        doNothing().when(resourceService).delete(resourceId);

        // When & Then
        mockMvc.perform(delete("/api/v1/resources/{id}", resourceId))
            .andExpect(status().isNoContent());

        verify(resourceService).delete(resourceId);
    }
}
```

### Service Tests

Use `@ExtendWith(MockitoExtension.class)` for service layer tests:

```java
package com.hhg.fieldservices.servicename.service;

import com.hhg.fieldservices.servicename.dto.*;
import com.hhg.fieldservices.servicename.exception.ResourceNotFoundException;
import com.hhg.fieldservices.servicename.mapper.ResourceMapper;
import com.hhg.fieldservices.servicename.model.Resource;
import com.hhg.fieldservices.servicename.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link ResourceService}.
 */
@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private ResourceMapper resourceMapper;

    @InjectMocks
    private ResourceService resourceService;

    private Resource resource;
    private ResourceDto resourceDto;
    private CreateResourceRequest createRequest;
    private UpdateResourceRequest updateRequest;

    @BeforeEach
    void setUp() {
        resource = Resource.builder()
            .id(1L)
            .name("Test Resource")
            .description("Test Description")
            .status(ResourceStatus.ACTIVE)
            .build();

        resourceDto = new ResourceDto(
            1L, "Test Resource", "Test Description", ResourceStatus.ACTIVE, null, null
        );

        createRequest = new CreateResourceRequest(
            "New Resource", "New Description", ResourceStatus.ACTIVE
        );

        updateRequest = new UpdateResourceRequest(
            "Updated Resource", "Updated Description", ResourceStatus.INACTIVE
        );
    }

    @Test
    void givenResources_whenFindAll_thenReturnsAllResources() {
        // Given
        List<Resource> resources = Arrays.asList(resource);
        when(resourceRepository.findAll()).thenReturn(resources);
        when(resourceMapper.toDto(any(Resource.class))).thenReturn(resourceDto);

        // When
        List<ResourceDto> result = resourceService.findAll();

        // Then
        assertThat(result).isNotEmpty().hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Test Resource");
        verify(resourceRepository).findAll();
        verify(resourceMapper).toDto(any(Resource.class));
    }

    @Test
    void givenValidId_whenFindById_thenReturnsResource() {
        // Given
        Long resourceId = 1L;
        when(resourceRepository.findById(resourceId)).thenReturn(Optional.of(resource));
        when(resourceMapper.toDto(resource)).thenReturn(resourceDto);

        // When
        ResourceDto result = resourceService.findById(resourceId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(resourceId);
        assertThat(result.name()).isEqualTo("Test Resource");
        verify(resourceRepository).findById(resourceId);
        verify(resourceMapper).toDto(resource);
    }

    @Test
    void givenInvalidId_whenFindById_thenThrowsResourceNotFoundException() {
        // Given
        Long resourceId = 999L;
        when(resourceRepository.findById(resourceId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> resourceService.findById(resourceId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Resource not found with id: " + resourceId);

        verify(resourceRepository).findById(resourceId);
        verify(resourceMapper, never()).toDto(any());
    }

    @Test
    void givenValidRequest_whenCreate_thenSavesAndReturnsResource() {
        // Given
        Resource newResource = Resource.builder()
            .name(createRequest.name())
            .description(createRequest.description())
            .status(createRequest.status())
            .build();
        
        Resource savedResource = Resource.builder()
            .id(1L)
            .name(createRequest.name())
            .description(createRequest.description())
            .status(createRequest.status())
            .build();

        when(resourceMapper.toEntity(createRequest)).thenReturn(newResource);
        when(resourceRepository.save(newResource)).thenReturn(savedResource);
        when(resourceMapper.toDto(savedResource)).thenReturn(resourceDto);

        // When
        ResourceDto result = resourceService.create(createRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.name()).isEqualTo("Test Resource");
        verify(resourceMapper).toEntity(createRequest);
        verify(resourceRepository).save(newResource);
        verify(resourceMapper).toDto(savedResource);
    }

    @Test
    void givenValidIdAndRequest_whenUpdate_thenUpdatesAndReturnsResource() {
        // Given
        Long resourceId = 1L;
        when(resourceRepository.findById(resourceId)).thenReturn(Optional.of(resource));
        when(resourceRepository.save(resource)).thenReturn(resource);
        when(resourceMapper.toDto(resource)).thenReturn(resourceDto);
        doNothing().when(resourceMapper).updateEntityFromDto(updateRequest, resource);

        // When
        ResourceDto result = resourceService.update(resourceId, updateRequest);

        // Then
        assertThat(result).isNotNull();
        verify(resourceRepository).findById(resourceId);
        verify(resourceMapper).updateEntityFromDto(updateRequest, resource);
        verify(resourceRepository).save(resource);
        verify(resourceMapper).toDto(resource);
    }

    @Test
    void givenInvalidId_whenUpdate_thenThrowsResourceNotFoundException() {
        // Given
        Long resourceId = 999L;
        when(resourceRepository.findById(resourceId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> resourceService.update(resourceId, updateRequest))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Resource not found with id: " + resourceId);

        verify(resourceRepository).findById(resourceId);
        verify(resourceRepository, never()).save(any());
    }

    @Test
    void givenValidId_whenDelete_thenDeletesResource() {
        // Given
        Long resourceId = 1L;
        when(resourceRepository.existsById(resourceId)).thenReturn(true);
        doNothing().when(resourceRepository).deleteById(resourceId);

        // When
        resourceService.delete(resourceId);

        // Then
        verify(resourceRepository).existsById(resourceId);
        verify(resourceRepository).deleteById(resourceId);
    }

    @Test
    void givenInvalidId_whenDelete_thenThrowsResourceNotFoundException() {
        // Given
        Long resourceId = 999L;
        when(resourceRepository.existsById(resourceId)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> resourceService.delete(resourceId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Resource not found with id: " + resourceId);

        verify(resourceRepository).existsById(resourceId);
        verify(resourceRepository, never()).deleteById(any());
    }
}
```

### Repository Tests

Use `@DataJpaTest` for repository tests:

```java
package com.hhg.fieldservices.servicename.repository;

import com.hhg.fieldservices.servicename.model.Resource;
import com.hhg.fieldservices.servicename.model.ResourceStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * Integration tests for {@link ResourceRepository}.
 */
@DataJpaTest
class ResourceRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ResourceRepository resourceRepository;

    private Resource resource1;
    private Resource resource2;

    @BeforeEach
    void setUp() {
        resource1 = Resource.builder()
            .name("Resource 1")
            .description("Description 1")
            .status(ResourceStatus.ACTIVE)
            .build();

        resource2 = Resource.builder()
            .name("Resource 2")
            .description("Description 2")
            .status(ResourceStatus.INACTIVE)
            .build();
    }

    @Test
    void givenNewResource_whenSave_thenResourceIsPersisted() {
        // When
        Resource saved = resourceRepository.save(resource1);

        // Then
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Resource 1");
        assertThat(saved.getCreatedAt()).isNotNull();

        Resource found = entityManager.find(Resource.class, saved.getId());
        assertThat(found).isEqualTo(saved);
    }

    @Test
    void givenResourceName_whenFindByName_thenReturnsResource() {
        // Given
        entityManager.persistAndFlush(resource1);

        // When
        Optional<Resource> found = resourceRepository.findByName("Resource 1");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Resource 1");
    }

    @Test
    void givenNonExistentName_whenFindByName_thenReturnsEmpty() {
        // When
        Optional<Resource> found = resourceRepository.findByName("Non-existent");

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    void givenResourceStatus_whenFindByStatus_thenReturnsMatchingResources() {
        // Given
        entityManager.persist(resource1);
        entityManager.persist(resource2);
        entityManager.flush();

        // When
        List<Resource> activeResources = resourceRepository.findByStatus(ResourceStatus.ACTIVE);

        // Then
        assertThat(activeResources).hasSize(1);
        assertThat(activeResources.get(0).getName()).isEqualTo("Resource 1");
    }

    @Test
    void givenSearchTerm_whenSearchByName_thenReturnsMatchingResources() {
        // Given
        entityManager.persist(resource1);
        entityManager.persist(resource2);
        entityManager.flush();

        // When
        Page<Resource> results = resourceRepository.searchByName("resource", PageRequest.of(0, 10));

        // Then
        assertThat(results.getContent()).hasSize(2);
    }

    @Test
    void givenResource_whenDelete_thenResourceIsRemoved() {
        // Given
        Resource saved = entityManager.persistAndFlush(resource1);
        Long resourceId = saved.getId();

        // When
        resourceRepository.deleteById(resourceId);
        entityManager.flush();

        // Then
        Resource found = entityManager.find(Resource.class, resourceId);
        assertThat(found).isNull();
    }
}
```

## Integration Testing

### Full Application Context Tests

```java
package com.hhg.fieldservices.servicename;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hhg.fieldservices.servicename.dto.*;
import com.hhg.fieldservices.servicename.model.Resource;
import com.hhg.fieldservices.servicename.repository.ResourceRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for Resource API.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ResourceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ResourceRepository resourceRepository;

    @AfterEach
    void tearDown() {
        resourceRepository.deleteAll();
    }

    @Test
    void givenValidRequest_whenCreateResource_thenResourceIsCreatedInDatabase() throws Exception {
        // Given
        CreateResourceRequest request = new CreateResourceRequest(
            "Integration Test Resource",
            "Test Description",
            ResourceStatus.ACTIVE
        );

        // When
        String response = mockMvc.perform(post("/api/v1/resources")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Integration Test Resource"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ResourceDto created = objectMapper.readValue(response, ResourceDto.class);

        // Then
        Resource found = resourceRepository.findById(created.id()).orElse(null);
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("Integration Test Resource");
    }

    @Test
    void givenExistingResource_whenUpdate_thenResourceIsUpdatedInDatabase() throws Exception {
        // Given
        Resource existing = resourceRepository.save(
            Resource.builder()
                .name("Original Name")
                .description("Original Description")
                .status(ResourceStatus.ACTIVE)
                .build()
        );

        UpdateResourceRequest request = new UpdateResourceRequest(
            "Updated Name",
            "Updated Description",
            ResourceStatus.INACTIVE
        );

        // When
        mockMvc.perform(put("/api/v1/resources/{id}", existing.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Updated Name"));

        // Then
        Resource updated = resourceRepository.findById(existing.getId()).orElse(null);
        assertThat(updated).isNotNull();
        assertThat(updated.getName()).isEqualTo("Updated Name");
        assertThat(updated.getStatus()).isEqualTo(ResourceStatus.INACTIVE);
    }

    @Test
    void givenExistingResource_whenDelete_thenResourceIsRemovedFromDatabase() throws Exception {
        // Given
        Resource existing = resourceRepository.save(
            Resource.builder()
                .name("To Delete")
                .description("Will be deleted")
                .status(ResourceStatus.ACTIVE)
                .build()
        );

        // When
        mockMvc.perform(delete("/api/v1/resources/{id}", existing.getId()))
            .andExpect(status().isNoContent());

        // Then
        assertThat(resourceRepository.findById(existing.getId())).isEmpty();
    }
}
```

### Testing with Test Containers

```java
package com.hhg.fieldservices.servicename;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Integration tests using Testcontainers for real database.
 */
@SpringBootTest
@Testcontainers
class DatabaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void contextLoads() {
        // Verify application context loads with real database
    }
}
```

## Testing Microservices Components

### Testing Feign Clients

```java
package com.hhg.fieldservices.servicename.client;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.hhg.fieldservices.servicename.dto.ExternalServiceDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.assertj.core.api.Assertions.*;

/**
 * Tests for {@link ExternalServiceClient} using WireMock.
 */
@SpringBootTest
@AutoConfigureWireMock(port = 0)
class ExternalServiceClientTest {

    @Autowired
    private ExternalServiceClient externalServiceClient;

    @Test
    void givenExternalServiceAvailable_whenGetResource_thenReturnsResource() {
        // Given
        stubFor(WireMock.get(urlEqualTo("/api/v1/resources/1"))
            .willReturn(aResponse()
                .withStatus(HttpStatus.OK.value())
                .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .withBody("{\"id\":1,\"name\":\"Test Resource\"}")));

        // When
        ExternalServiceDto result = externalServiceClient.getResource(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Resource");
    }

    @Test
    void givenExternalServiceUnavailable_whenGetResource_thenFallbackIsInvoked() {
        // Given
        stubFor(WireMock.get(urlEqualTo("/api/v1/resources/1"))
            .willReturn(aResponse()
                .withStatus(HttpStatus.SERVICE_UNAVAILABLE.value())));

        // When
        ExternalServiceDto result = externalServiceClient.getResource(1L);

        // Then
        assertThat(result.getName()).isEqualTo("Service Unavailable");
    }
}
```

### Testing Kafka Messaging

```java
package com.hhg.fieldservices.servicename.messaging;

import com.hhg.fieldservices.servicename.dto.ResourceEvent;
import com.hhg.fieldservices.servicename.dto.ResourceEventType;
import com.hhg.fieldservices.servicename.dto.ResourceStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.annotation.DirtiesContext;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.*;

/**
 * Integration tests for Kafka messaging.
 */
@SpringBootTest
@DirtiesContext
@EmbeddedKafka(partitions = 1, brokerProperties = { "listeners=PLAINTEXT://localhost:9092", "port=9092" })
class KafkaMessagingTest {

    @Autowired
    private ResourceEventProducer producer;

    @Autowired
    private ResourceEventHandler eventHandler;

    @Test
    void givenResourceEvent_whenPublished_thenConsumerReceivesEvent() {
        // Given
        ResourceEvent event = ResourceEvent.builder()
            .resourceId(1L)
            .eventType(ResourceEventType.CREATED)
            .resourceName("Test Resource")
            .status(ResourceStatus.ACTIVE)
            .timestamp(LocalDateTime.now())
            .source("test-service")
            .build();

        // When
        producer.publishResourceEvent(event);

        // Then
        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> verify(eventHandler).handleResourceEvent(any(ResourceEvent.class)));
    }
}
```

## Test Best Practices

### Test Naming Convention

Use the "Given-When-Then" pattern:

```java
@Test
void givenValidResource_whenCreate_thenResourceIsSaved() {
    // Test implementation
}
```

### Assertions

Use AssertJ for fluent assertions:

```java
// Good
assertThat(result).isNotNull();
assertThat(result.getName()).isEqualTo("Expected Name");
assertThat(result.getItems()).hasSize(3).contains(item1, item2);

// Avoid
assertTrue(result != null);
assertEquals("Expected Name", result.getName());
```

### Test Data Builders

Create builders for test data:

```java
public class ResourceTestDataBuilder {
    
    public static Resource.ResourceBuilder defaultResource() {
        return Resource.builder()
            .name("Default Resource")
            .description("Default Description")
            .status(ResourceStatus.ACTIVE);
    }
    
    public static CreateResourceRequest.CreateResourceRequestBuilder defaultCreateRequest() {
        return CreateResourceRequest.builder()
            .name("New Resource")
            .description("New Description")
            .status(ResourceStatus.ACTIVE);
    }
}
```

### Parameterized Tests

```java
@ParameterizedTest
@CsvSource({
    "ACTIVE, true",
    "INACTIVE, false",
    "PENDING, false"
})
void givenDifferentStatuses_whenCheckActive_thenReturnsExpectedResult(
        ResourceStatus status, boolean expectedActive) {
    // Test implementation
}

@ParameterizedTest
@MethodSource("provideInvalidNames")
void givenInvalidName_whenValidate_thenThrowsException(String invalidName) {
    // Test implementation
}

private static Stream<String> provideInvalidNames() {
    return Stream.of("", " ", null, "AB");
}
```

## Code Coverage

Target coverage:
- **Overall**: 80%+
- **Services**: 90%+
- **Controllers**: 85%+
- **Repositories**: 70%+ (simple CRUD methods)

Run coverage report:
```bash
mvn clean test jacoco:report
```

View coverage at: `target/site/jacoco/index.html`

## Summary

1. **Write tests first** or immediately after implementation
2. **Follow naming conventions** (Given-When-Then)
3. **Use appropriate test types** (unit, integration, E2E)
4. **Mock external dependencies** in unit tests
5. **Use real dependencies** in integration tests (with Testcontainers)
6. **Test happy paths and error cases**
7. **Keep tests fast** and independent
8. **Maintain high code coverage**
9. **Use test data builders** for consistency
10. **Run tests frequently** during development
