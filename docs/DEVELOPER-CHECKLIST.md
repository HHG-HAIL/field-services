# Developer Checklist

Use this checklist to ensure your code follows the Field Services standards and best practices.

## Before You Start

- [ ] Read the [README](../README.md) and understand the project structure
- [ ] Set up your development environment following [Developer Guide](developer-guide.md)
- [ ] Review [Contributing Guidelines](../CONTRIBUTING.md)
- [ ] Familiarize yourself with [Copilot Instructions](../.github/copilot-instructions.md)

## Planning Your Work

- [ ] Create or assigned to a GitHub issue
- [ ] Understand the requirements and acceptance criteria
- [ ] Review related [Architecture Documentation](architecture.md)
- [ ] Create a feature branch following naming conventions

## During Development

### Code Quality

- [ ] Follow [Spring Boot patterns](../.github/copilot-instructions/spring-boot.md)
- [ ] Implement [Microservices patterns](../.github/copilot-instructions/microservices.md) where applicable
- [ ] Follow [API design guidelines](../.github/copilot-instructions/api-design.md) for REST endpoints
- [ ] Use constructor injection for dependencies
- [ ] Add appropriate logging (DEBUG for trace, INFO for important events, ERROR for exceptions)
- [ ] Validate all input using Bean Validation annotations
- [ ] Handle exceptions properly with global exception handlers
- [ ] Use DTOs for API contracts, never expose entities directly

### Using GitHub Copilot

- [ ] Review relevant [Copilot instructions](../.github/copilot-instructions.md) before using
- [ ] Write clear, descriptive comments to guide Copilot
- [ ] Review and understand all Copilot suggestions before accepting
- [ ] Ensure generated code follows project standards
- [ ] Refactor Copilot suggestions if they don't meet quality standards

### Testing

- [ ] Write unit tests for all new code (aim for 80%+ coverage)
- [ ] Follow [Testing Guidelines](../.github/copilot-instructions/testing.md)
- [ ] Use meaningful test names (Given-When-Then pattern)
- [ ] Test both happy paths and error scenarios
- [ ] Write integration tests for API endpoints
- [ ] Verify all tests pass locally before pushing

```bash
mvn clean test
mvn test jacoco:report
```

### Documentation

- [ ] Add JavaDoc for public APIs and complex methods
- [ ] Update README if adding new features
- [ ] Update API documentation (Swagger/OpenAPI annotations)
- [ ] Document any new environment variables
- [ ] Update relevant guides in `/docs` if needed

### Security

- [ ] Validate and sanitize all user input
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Never log sensitive data (passwords, tokens, PII)
- [ ] Secure endpoints with appropriate authentication/authorization
- [ ] Don't hardcode credentials or secrets
- [ ] Review code for security vulnerabilities

## Before Committing

### Code Review

- [ ] Review your own changes using `git diff`
- [ ] Remove any debugging code or commented-out code
- [ ] Check for console.log, System.out.println, or similar debug statements
- [ ] Ensure no TODO comments for incomplete work
- [ ] Verify no sensitive data in code or configuration

### Build and Test

- [ ] Code compiles without errors: `mvn clean install`
- [ ] All tests pass: `mvn test`
- [ ] Code style checks pass: `mvn checkstyle:check` (if configured)
- [ ] No new warnings introduced
- [ ] Application starts successfully

### Git

- [ ] Stage only relevant files (don't commit temp files, logs, etc.)
- [ ] Write clear commit message following conventions:
  ```
  <type>(<scope>): <subject>
  
  Examples:
  feat(user-service): add user registration endpoint
  fix(order-service): correct calculation in order total
  docs(readme): update installation instructions
  test(resource-service): add tests for resource deletion
  ```
- [ ] Commit message is clear and descriptive
- [ ] Commits are atomic (one logical change per commit)

## Before Creating Pull Request

### Final Checks

- [ ] Rebase on latest `main` branch
- [ ] All conflicts resolved
- [ ] Code builds successfully
- [ ] All tests pass
- [ ] Code coverage meets requirements (80%+)
- [ ] No new linter warnings

### Pull Request

- [ ] PR title is clear and descriptive
- [ ] PR description explains what and why
- [ ] Reference related issue(s): "Closes #123"
- [ ] Screenshots included for UI changes
- [ ] Breaking changes are clearly documented
- [ ] Reviewers assigned

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No new warnings
```

## Code Review Response

When your PR is reviewed:

- [ ] Respond to all review comments
- [ ] Make requested changes promptly
- [ ] Re-request review after changes
- [ ] Keep PR up to date with main branch
- [ ] Be open to feedback and suggestions

## After Merge

- [ ] Delete feature branch (local and remote)
- [ ] Verify deployment in dev/staging environment
- [ ] Monitor for any issues
- [ ] Close related issue(s) if not auto-closed
- [ ] Update documentation if needed

## Service-Specific Checklist

### REST Controllers

- [ ] Use `@RestController` annotation
- [ ] Define `@RequestMapping` with versioned path (`/api/v1/...`)
- [ ] Use appropriate HTTP methods (GET, POST, PUT, PATCH, DELETE)
- [ ] Return `ResponseEntity` with proper status codes
- [ ] Validate input with `@Valid` annotation
- [ ] Add OpenAPI/Swagger documentation
- [ ] Include proper error handling

### Service Layer

- [ ] Use `@Service` annotation
- [ ] Mark as `@Transactional` where appropriate
- [ ] Use `@Transactional(readOnly = true)` for read operations
- [ ] Implement business logic here, not in controllers
- [ ] Use constructor injection
- [ ] Add appropriate logging
- [ ] Throw meaningful exceptions

### Repository Layer

- [ ] Extend `JpaRepository`
- [ ] Use query methods following Spring Data conventions
- [ ] Use `@Query` for complex queries
- [ ] Never expose repository directly in controllers

### Entity Models

- [ ] Use `@Entity` annotation
- [ ] Define `@Table` with table name
- [ ] Add `@EntityListeners(AuditingEntityListener.class)` for auditing
- [ ] Use `@CreatedDate` and `@LastModifiedDate`
- [ ] Add `@Version` for optimistic locking
- [ ] Use appropriate column constraints

### DTOs

- [ ] Use Java records for immutability (Java 17+)
- [ ] Add validation annotations
- [ ] Never expose entities in API responses
- [ ] Include JavaDoc descriptions

### Exception Handling

- [ ] Create custom exceptions extending `RuntimeException`
- [ ] Use `@RestControllerAdvice` for global exception handling
- [ ] Return consistent error response format
- [ ] Include appropriate HTTP status codes
- [ ] Log exceptions appropriately

## Microservices-Specific Checklist

### Service Discovery

- [ ] Add `@EnableDiscoveryClient` to main application class
- [ ] Configure Eureka client in `application.yml`
- [ ] Set unique `spring.application.name`
- [ ] Test service registration with Eureka

### Inter-Service Communication

- [ ] Use Feign for synchronous communication
- [ ] Implement circuit breakers with Resilience4j
- [ ] Add fallback methods
- [ ] Configure appropriate timeouts
- [ ] Use Kafka for asynchronous communication
- [ ] Implement proper error handling

### Configuration

- [ ] Externalize configuration to `application.yml`
- [ ] Use environment variables for sensitive data
- [ ] Create profile-specific configurations
- [ ] Never commit secrets to version control

### Health & Monitoring

- [ ] Enable Spring Boot Actuator
- [ ] Implement custom health indicators
- [ ] Add custom metrics
- [ ] Configure distributed tracing
- [ ] Add correlation IDs for logging

## Common Pitfalls to Avoid

- ❌ Exposing entities directly in REST APIs
- ❌ Business logic in controllers or repositories
- ❌ Hardcoded configuration values
- ❌ Missing input validation
- ❌ Inadequate error handling
- ❌ Poor test coverage
- ❌ Missing documentation
- ❌ Ignoring security best practices
- ❌ Not using transactions appropriately
- ❌ Tight coupling between services
- ❌ Synchronous calls where async would be better
- ❌ Not implementing circuit breakers for external calls

## Resources

- [Developer Guide](developer-guide.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Architecture Guide](architecture.md)
- [API Guide](api-guide.md)
- [Copilot Instructions](../.github/copilot-instructions.md)
- [Spring Boot Guide](../.github/copilot-instructions/spring-boot.md)
- [Microservices Guide](../.github/copilot-instructions/microservices.md)
- [Testing Guide](../.github/copilot-instructions/testing.md)
- [API Design Guide](../.github/copilot-instructions/api-design.md)
- [Quick Reference](microservices/quick-reference.md)

---

**Pro Tip**: Keep this checklist handy and review it before committing code. It will help you catch issues early and maintain high code quality!
