# Technician Service

A Spring Boot microservice for managing field service technicians.

## Overview

The Technician Service is responsible for managing technician profiles, skills, availability, and assignments within the Field Services platform. This service provides REST APIs for CRUD operations on technician data and integrates with other microservices in the ecosystem.

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA** - Data access layer
- **Spring Web** - REST API support
- **Spring Validation** - Input validation
- **Spring Actuator** - Health checks and metrics
- **H2 Database** - In-memory database for development
- **PostgreSQL** - Production database
- **Flyway** - Database migration management
- **Lombok** - Boilerplate code reduction
- **MapStruct** - Object mapping
- **SpringDoc OpenAPI** - API documentation

## Features

- RESTful API for technician management
- Database migration support with Flyway
- Comprehensive API documentation with Swagger/OpenAPI
- Health checks and monitoring endpoints
- CORS configuration for frontend integration

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker (optional, for PostgreSQL)

### Building the Service

```bash
# Build the service
mvn clean install

# Run tests
mvn test

# Package the application
mvn package
```

### Running Locally

```bash
# Run with Maven
mvn spring-boot:run

# Or run the JAR directly
java -jar target/technician-service-1.0.0-SNAPSHOT.jar
```

The service will start on port **8085** by default.

### Configuration

The service can be configured using environment variables or `application.yml`:

- `PORT` - Server port (default: 8085)
- `DATABASE_URL` - Database connection URL
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password

## API Documentation

### Interactive Documentation

Once the service is running, you can access the interactive API documentation at:

- **Swagger UI**: http://localhost:8085/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8085/v3/api-docs

### Documentation Files

Comprehensive documentation is available in the `docs/` directory:

- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete REST API reference with all endpoints, request/response formats, and examples
- **[Error Handling](docs/ERROR_HANDLING.md)** - Detailed guide on error handling, exception types, and best practices

### Main Endpoints

#### Technician Management

- **GET** `/api/v1/technicians` - List all technicians
- **GET** `/api/v1/technicians/{id}` - Get technician by ID
- **GET** `/api/v1/technicians/employee/{employeeId}` - Get technician by employee ID
- **GET** `/api/v1/technicians/status/{status}` - Get technicians by status
- **GET** `/api/v1/technicians/skill-level/{skillLevel}` - Get technicians by skill level
- **GET** `/api/v1/technicians/skill/{skill}` - Get technicians by skill
- **POST** `/api/v1/technicians` - Create new technician
- **PUT** `/api/v1/technicians/{id}` - Update technician
- **DELETE** `/api/v1/technicians/{id}` - Delete technician

#### Health Check

- **GET** `/api/v1/health` - Basic health check endpoint

#### Actuator Endpoints

- **GET** `/actuator/health` - Detailed health information
- **GET** `/actuator/info` - Service information
- **GET** `/actuator/metrics` - Service metrics

### RESTful Standards

The API follows REST best practices:

- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (remove)
- **Status Codes**: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 404 (Not Found), 409 (Conflict), 500 (Internal Server Error)
- **Error Handling**: Centralized exception handling with consistent error response format
- **Validation**: Input validation using Bean Validation annotations
- **Documentation**: OpenAPI/Swagger documentation for all endpoints

## Database

The service uses Flyway for database migrations. Migration scripts are located in `src/main/resources/db/migration/`.

### Development Database

In development, the service uses an in-memory H2 database. The H2 console is available at:
- http://localhost:8085/h2-console
- JDBC URL: `jdbc:h2:mem:techniciandb`
- Username: `sa`
- Password: (empty)

### Production Database

For production, configure PostgreSQL connection via environment variables.

## Testing

The service includes comprehensive tests:

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## Docker Support

(To be added in future updates)

## Project Structure

```
technician-service/
├── docs/                        # Documentation
│   ├── API_DOCUMENTATION.md     # Complete API reference
│   └── ERROR_HANDLING.md        # Error handling guide
├── src/
│   ├── main/
│   │   ├── java/com/hhg/fieldservices/technician/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── service/         # Business logic
│   │   │   ├── repository/      # Data access
│   │   │   ├── model/           # Domain entities
│   │   │   ├── dto/             # Data transfer objects
│   │   │   ├── mapper/          # Object mappers
│   │   │   ├── exception/       # Custom exceptions & handlers
│   │   │   └── TechnicianServiceApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/    # Flyway migrations
│   └── test/
│       └── java/com/hhg/fieldservices/technician/
├── pom.xml
└── README.md
```

## Contributing

Please follow the project's contributing guidelines and coding standards. See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## Related Services

- **work-order-service** - Manages work orders
- (Other services to be added)

## License

See the project LICENSE file for details.

## Support

For questions and support:
- Create an issue in the repository
- Check the [documentation](../docs/)
- Review [contributing guidelines](../CONTRIBUTING.md)
