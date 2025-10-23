# Field Services - Spring Boot Microservices

A microservices-based field services management system built with Spring Boot.

## Overview

This repository contains a collection of Spring Boot microservices designed to manage field service operations. The architecture follows best practices for microservices development, including service isolation, API-first design, and comprehensive documentation.

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker and Docker Compose (for containerized deployments)
- Your favorite IDE (IntelliJ IDEA, Eclipse, or VS Code with Java extensions)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/HHG-HAIL/field-services.git
cd field-services

# Build all services
mvn clean install

# Run services locally
# Instructions for each service are in their respective README files
```

## Architecture

This project follows a microservices architecture pattern with the following key components:

- **Service Discovery**: Eureka-based service registry
- **API Gateway**: Spring Cloud Gateway for routing and load balancing
- **Configuration**: Spring Cloud Config for centralized configuration
- **Messaging**: Event-driven communication between services

## Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Documentation Index](docs/INDEX.md)** - Complete documentation index and navigation
- **[Developer Guide](docs/developer-guide.md)** - Getting started with development
- **[Developer Checklist](docs/DEVELOPER-CHECKLIST.md)** - Checklist for code quality and standards
- **[Architecture Guide](docs/architecture.md)** - System architecture and design decisions
- **[API Documentation](docs/api-guide.md)** - API specifications and usage
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Copilot Instructions](.github/copilot-instructions.md)** - GitHub Copilot usage guidelines
- **[Integration Summary](docs/INTEGRATION-SUMMARY.md)** - Summary of Copilot instructions integration

### Service-Specific Documentation

Each microservice has its own documentation:

- Service documentation can be found in `services/<service-name>/docs/`
- API specifications are available as OpenAPI/Swagger definitions

## Project Structure

```
field-services/
├── .github/                    # GitHub configurations and Copilot instructions
│   ├── copilot-instructions.md # Main Copilot guidelines
│   └── workflows/              # CI/CD workflows
├── docs/                       # Project-wide documentation
│   ├── developer-guide.md
│   ├── architecture.md
│   ├── api-guide.md
│   └── microservices/          # Service-specific guidelines
├── services/                   # Microservices implementations
│   ├── service-registry/
│   ├── api-gateway/
│   ├── config-server/
│   └── [other-services]/
└── shared/                     # Shared libraries and utilities
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Coding standards and best practices
- Pull request process
- Testing requirements

## GitHub Copilot Usage

This project includes comprehensive GitHub Copilot instructions to help developers:

- Write consistent, high-quality code
- Follow Spring Boot best practices
- Implement microservices patterns correctly
- Generate appropriate tests and documentation

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions and support:

- Create an issue in this repository
- Check the [documentation](docs/)
- Review [contributing guidelines](CONTRIBUTING.md)
