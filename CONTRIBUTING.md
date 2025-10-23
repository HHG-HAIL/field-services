# Contributing to Field Services

Thank you for your interest in contributing to the Field Services project! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Requirements](#documentation-requirements)
- [Pull Request Process](#pull-request-process)
- [Using GitHub Copilot](#using-github-copilot)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional in all interactions.

## Getting Started

1. **Fork the repository** and clone your fork locally
2. **Set up your development environment** following the [Developer Guide](docs/developer-guide.md)
3. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following our coding standards
5. **Test your changes** thoroughly
6. **Submit a pull request** for review

## Development Workflow

### Branch Naming Conventions

- Feature branches: `feature/description`
- Bug fixes: `bugfix/description`
- Hot fixes: `hotfix/description`
- Documentation: `docs/description`

### Commit Messages

Write clear, descriptive commit messages following this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(user-service): add user authentication endpoint

Implement JWT-based authentication for user service.
Includes token generation and validation.

Closes #123
```

## Coding Standards

### Java/Spring Boot Standards

- **Java Version**: Use Java 17+ features where appropriate
- **Code Style**: Follow Google Java Style Guide
- **Naming Conventions**:
  - Classes: PascalCase
  - Methods/Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Packages: lowercase

### Spring Boot Best Practices

1. **Dependency Injection**: Use constructor injection (preferred) or setter injection
2. **Configuration**: Use `application.yml` for configuration, externalize sensitive data
3. **REST APIs**: Follow RESTful conventions
   - Use proper HTTP methods (GET, POST, PUT, DELETE, PATCH)
   - Use plural nouns for endpoints (e.g., `/users`, not `/user`)
   - Return appropriate HTTP status codes
4. **Exception Handling**: Implement global exception handlers using `@ControllerAdvice`
5. **Logging**: Use SLF4J with appropriate log levels
6. **DTOs**: Use Data Transfer Objects for API requests/responses

### Microservices Patterns

- Follow the [Architecture Guide](docs/architecture.md) for service design
- Implement circuit breakers for external service calls
- Use asynchronous messaging for inter-service communication when appropriate
- Maintain service independence and avoid tight coupling

## Testing Guidelines

### Test Requirements

All code contributions must include appropriate tests:

1. **Unit Tests**: Test individual components in isolation
   - Use JUnit 5 and Mockito
   - Aim for 80%+ code coverage
   - Test both happy paths and error scenarios

2. **Integration Tests**: Test component interactions
   - Use `@SpringBootTest` for integration tests
   - Test API endpoints with MockMvc or TestRestTemplate
   - Use test containers for external dependencies

3. **Contract Tests**: For API providers
   - Use Spring Cloud Contract where appropriate

### Test Naming Conventions

```java
@Test
void givenValidUser_whenCreateUser_thenUserIsCreated() {
    // Arrange
    // Act
    // Assert
}
```

### Running Tests

```bash
# Run all tests
mvn test

# Run tests for a specific service
mvn test -pl services/user-service

# Run tests with coverage
mvn clean test jacoco:report
```

## Documentation Requirements

### Code Documentation

- **JavaDoc**: Document public APIs, classes, and complex methods
- **README**: Each service must have its own README
- **API Documentation**: Use Swagger/OpenAPI annotations

### Updating Documentation

When making changes:

1. Update relevant markdown files in `/docs`
2. Update service-specific documentation
3. Update API specifications
4. Add examples where appropriate

See [Documentation Guide](docs/developer-guide.md#documentation) for details.

## Pull Request Process

### Before Submitting

1. ✅ Code follows project standards
2. ✅ All tests pass
3. ✅ Code coverage is adequate
4. ✅ Documentation is updated
5. ✅ Commit messages are clear
6. ✅ Branch is up to date with `main`

### PR Template

When creating a pull request, include:

- **Description**: Clear explanation of changes
- **Related Issue**: Reference issue number(s)
- **Type of Change**: Feature, bugfix, documentation, etc.
- **Testing**: Describe testing performed
- **Checklist**: Confirm all requirements are met

### Review Process

1. Automated checks must pass (CI/CD pipeline)
2. Code review by at least one maintainer
3. All review comments addressed
4. Final approval before merge

## Using GitHub Copilot

This project includes specific instructions for GitHub Copilot to help maintain consistency and quality:

### Copilot Resources

- **[Main Copilot Instructions](.github/copilot-instructions.md)**: General guidelines for the entire project
- **[Spring Boot Copilot Guide](.github/copilot-instructions/spring-boot.md)**: Spring Boot-specific patterns
- **[Microservices Copilot Guide](.github/copilot-instructions/microservices.md)**: Microservices patterns
- **[Testing Copilot Guide](.github/copilot-instructions/testing.md)**: Test generation guidelines

### Best Practices with Copilot

1. **Review Suggestions**: Always review Copilot suggestions before accepting
2. **Context Matters**: Provide clear comments to guide Copilot
3. **Follow Patterns**: Copilot learns from existing code - maintain consistency
4. **Security**: Be cautious with Copilot suggestions for security-sensitive code

### Example Usage

```java
// Create a REST controller for user management with CRUD operations
// Follow RESTful conventions and include proper error handling
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    // Copilot will suggest appropriate implementation
}
```

For more details, see our [Copilot Guidelines](.github/copilot-instructions.md).

## Questions?

If you have questions:

- Check the [documentation](docs/)
- Search existing issues
- Create a new issue with the `question` label
- Reach out to maintainers

Thank you for contributing to Field Services! 🎉
