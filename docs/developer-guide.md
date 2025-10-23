# Developer Guide

Welcome to the Field Services development guide. This document will help you get started with developing microservices for the Field Services platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Using GitHub Copilot](#using-github-copilot)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Tools

- **Java Development Kit (JDK) 17 or higher**
  ```bash
  java -version
  # Should show version 17+
  ```

- **Apache Maven 3.6+**
  ```bash
  mvn -version
  # Should show Maven 3.6 or higher
  ```

- **Git**
  ```bash
  git --version
  ```

- **Docker and Docker Compose**
  ```bash
  docker --version
  docker-compose --version
  ```

### Recommended Tools

- **IDE**: IntelliJ IDEA (recommended), Eclipse, or VS Code with Java extensions
- **Postman or Insomnia**: For API testing
- **PostgreSQL Client**: For database inspection
- **Kafka Tool**: For message queue inspection (optional)

### Optional Tools

- **kubectl**: For Kubernetes deployments
- **Helm**: For managing Kubernetes charts
- **Terraform**: For infrastructure as code

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HHG-HAIL/field-services.git
cd field-services
```

### 2. Build the Project

Build all services:

```bash
mvn clean install
```

Build a specific service:

```bash
mvn clean install -pl services/user-service
```

### 3. Set Up Local Infrastructure

Start required infrastructure services (database, service registry, etc.):

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Eureka service registry
- Kafka (for event-driven communication)
- Zipkin (for distributed tracing)

### 4. Run Services

Each service can be run independently:

```bash
cd services/user-service
mvn spring-boot:run
```

Or using the JAR file:

```bash
java -jar target/user-service-1.0.0.jar
```

## Development Environment Setup

### IntelliJ IDEA Setup

1. **Import Project**
   - Open IntelliJ IDEA
   - File → Open → Select the project root directory
   - Wait for Maven to import dependencies

2. **Configure Java SDK**
   - File → Project Structure → Project
   - Set Project SDK to Java 17+

3. **Install Plugins**
   - Lombok Plugin (for code generation)
   - SonarLint (for code quality)
   - GitToolBox (for enhanced Git integration)

4. **Code Style**
   - Import the project's code style settings (if available)
   - File → Settings → Editor → Code Style → Import Scheme

### VS Code Setup

1. **Install Extensions**
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Lombok Annotations Support
   - SonarLint

2. **Configure Settings**
   ```json
   {
     "java.configuration.updateBuildConfiguration": "automatic",
     "java.compile.nullAnalysis.mode": "automatic",
     "spring-boot.ls.java.home": "/path/to/java17"
   }
   ```

### Environment Variables

Create a `.env` file in the project root (this file is gitignored):

```bash
# Database Configuration
DATABASE_URL=jdbc:postgresql://localhost:5432/fieldservices
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# Service Discovery
EUREKA_SERVER_URL=http://localhost:8761/eureka

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Zipkin Configuration
ZIPKIN_URL=http://localhost:9411

# Application Profiles
SPRING_PROFILES_ACTIVE=local
```

## Project Structure

```
field-services/
├── .github/                      # GitHub configurations
│   ├── copilot-instructions.md   # Main Copilot guidelines
│   └── copilot-instructions/     # Module-specific Copilot guides
│       ├── spring-boot.md
│       ├── microservices.md
│       ├── testing.md
│       └── api-design.md
├── docs/                         # Project documentation
│   ├── developer-guide.md        # This file
│   ├── architecture.md           # Architecture documentation
│   ├── api-guide.md              # API documentation
│   └── microservices/            # Service-specific docs
├── services/                     # Microservices
│   ├── service-registry/         # Eureka service registry
│   ├── api-gateway/              # Spring Cloud Gateway
│   ├── config-server/            # Spring Cloud Config
│   ├── user-service/             # User management service
│   └── [other-services]/
├── shared/                       # Shared libraries
│   ├── common-utils/
│   ├── security-common/
│   └── messaging-common/
├── docker-compose.yml            # Local infrastructure
├── pom.xml                       # Parent POM
└── README.md                     # Project overview
```

### Service Structure

Each microservice follows this structure:

```
service-name/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/hhg/fieldservices/servicename/
│   │   │       ├── ServiceNameApplication.java    # Main application class
│   │   │       ├── config/                        # Configuration classes
│   │   │       ├── controller/                    # REST controllers
│   │   │       ├── service/                       # Business logic
│   │   │       ├── repository/                    # Data access
│   │   │       ├── model/                         # Domain entities
│   │   │       ├── dto/                           # Data transfer objects
│   │   │       ├── mapper/                        # Entity-DTO mappers
│   │   │       ├── exception/                     # Custom exceptions
│   │   │       ├── messaging/                     # Event producers/consumers
│   │   │       └── util/                          # Utility classes
│   │   └── resources/
│   │       ├── application.yml                    # Application configuration
│   │       ├── application-local.yml              # Local profile
│   │       ├── application-dev.yml                # Dev profile
│   │       ├── application-prod.yml               # Production profile
│   │       └── db/migration/                      # Flyway migrations
│   └── test/
│       └── java/
│           └── com/hhg/fieldservices/servicename/
│               ├── controller/                    # Controller tests
│               ├── service/                       # Service tests
│               ├── repository/                    # Repository tests
│               └── integration/                   # Integration tests
├── Dockerfile                                     # Docker image definition
├── pom.xml                                        # Service dependencies
└── README.md                                      # Service documentation
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Develop Your Feature

Follow the coding standards outlined in [CONTRIBUTING.md](../CONTRIBUTING.md).

### 3. Write Tests

- Write unit tests for all new code
- Write integration tests for API endpoints
- Ensure code coverage meets the 80% threshold

```bash
mvn test
mvn test jacoco:report
```

### 4. Run Local Tests

```bash
# Run all tests
mvn clean test

# Run specific test class
mvn test -Dtest=ResourceControllerTest

# Run tests with specific profile
mvn test -Dspring.profiles.active=test
```

### 5. Lint and Format Code

```bash
# Check code style
mvn checkstyle:check

# Format code (if using spotless)
mvn spotless:apply
```

### 6. Commit Changes

Follow the commit message conventions:

```bash
git add .
git commit -m "feat(user-service): add user registration endpoint"
```

### 7. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Using GitHub Copilot

This project includes comprehensive GitHub Copilot instructions to help you write better code faster.

### Getting Started with Copilot

1. **Install GitHub Copilot** in your IDE
2. **Review Copilot Instructions**:
   - [Main Copilot Instructions](../.github/copilot-instructions.md)
   - [Spring Boot Guide](../.github/copilot-instructions/spring-boot.md)
   - [Microservices Guide](../.github/copilot-instructions/microservices.md)
   - [Testing Guide](../.github/copilot-instructions/testing.md)
   - [API Design Guide](../.github/copilot-instructions/api-design.md)

### Effective Use of Copilot

**Example 1: Creating a REST Controller**

```java
// Create a REST controller for managing service requests
// Include CRUD operations with proper validation and error handling
// Follow RESTful conventions and return appropriate HTTP status codes
@RestController
@RequestMapping("/api/v1/service-requests")
@RequiredArgsConstructor
@Slf4j
public class ServiceRequestController {
    // Copilot will suggest the implementation based on project patterns
}
```

**Example 2: Generating Tests**

```java
// Unit test for ServiceRequestController
// Test all CRUD operations with valid and invalid inputs
// Use MockMvc and mock the service layer
@WebMvcTest(ServiceRequestController.class)
class ServiceRequestControllerTest {
    // Copilot will generate comprehensive tests
}
```

**Example 3: Creating DTOs**

```java
// Create a DTO for service request creation with validation
// Include fields: customer name (required, 3-100 chars), description (required, max 500 chars),
// priority (required, enum), scheduled date (required, future date)
public record CreateServiceRequestDto(
    // Copilot will add appropriate validation annotations
}
```

## Best Practices

### Code Quality

1. **Follow SOLID Principles**
   - Single Responsibility Principle
   - Open/Closed Principle
   - Liskov Substitution Principle
   - Interface Segregation Principle
   - Dependency Inversion Principle

2. **Use Dependency Injection**
   - Prefer constructor injection
   - Use `@RequiredArgsConstructor` from Lombok

3. **Write Clean Code**
   - Meaningful variable and method names
   - Small, focused methods
   - Avoid deep nesting
   - Comment complex logic only

### Testing

1. **Write Tests First** (TDD approach when possible)
2. **Follow the AAA Pattern**: Arrange, Act, Assert
3. **Use Test Data Builders** for complex objects
4. **Keep Tests Fast** and independent
5. **Test Edge Cases** and error scenarios

### Documentation

1. **JavaDoc** for public APIs
2. **README** for each service
3. **API Documentation** using OpenAPI/Swagger
4. **Architecture Decisions** in ADR format (when applicable)

### Performance

1. **Use Caching** where appropriate (Redis, Caffeine)
2. **Optimize Database Queries** (use pagination, indexing)
3. **Implement Circuit Breakers** for external calls
4. **Monitor Performance** with Actuator metrics

### Security

1. **Validate All Input**
2. **Never Log Sensitive Data**
3. **Use Parameterized Queries** (prevent SQL injection)
4. **Implement Proper Authentication** and Authorization
5. **Keep Dependencies Updated**

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

#### 2. Database Connection Failed

- Check if PostgreSQL is running: `docker ps`
- Verify connection string in `application.yml`
- Check credentials

#### 3. Eureka Registration Failed

- Ensure Eureka server is running
- Check `eureka.client.service-url.defaultZone` in configuration
- Verify network connectivity

#### 4. Build Failures

```bash
# Clean Maven cache
mvn dependency:purge-local-repository

# Re-download dependencies
mvn clean install -U
```

#### 5. Test Failures

```bash
# Run specific test with debug logging
mvn test -Dtest=YourTest -X

# Skip tests temporarily (not recommended for CI/CD)
mvn clean install -DskipTests
```

### Getting Help

1. **Check Documentation**: Review this guide and other docs
2. **Search Issues**: Look for similar issues in the repository
3. **Ask the Team**: Reach out to team members
4. **Create an Issue**: If it's a bug or enhancement request

## Additional Resources

- [Architecture Guide](architecture.md)
- [API Documentation](api-guide.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)

## Next Steps

Now that you have your environment set up:

1. Read the [Architecture Guide](architecture.md) to understand the system design
2. Review existing services to understand patterns
3. Check out the [Contributing Guide](../CONTRIBUTING.md) for development workflow
4. Start building! 🚀
