# GitHub Copilot Agents - Best Practices and Usage Guide

This document provides comprehensive guidelines for using GitHub Copilot agents within the Field Services Spring Boot microservices project. Agents are AI-powered assistants that help automate various development tasks, from code generation to testing and documentation.

## Table of Contents

- [Overview](#overview)
- [Types of Agents](#types-of-agents)
- [Best Practices](#best-practices)
- [Agent Configuration](#agent-configuration)
- [Usage Scenarios](#usage-scenarios)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## Overview

GitHub Copilot agents are specialized AI assistants designed to help with specific development tasks. They complement the general GitHub Copilot code completion by providing more focused, task-oriented assistance for complex workflows in our Spring Boot microservices architecture.

### What Are Agents?

Agents are AI-powered tools that can:
- Generate complete code components (controllers, services, repositories)
- Create comprehensive test suites
- Refactor existing code following best practices
- Generate documentation and API specifications
- Assist with debugging and troubleshooting
- Automate repetitive development tasks

### When to Use Agents

✅ **Recommended Use Cases:**
- Scaffolding new microservices
- Generating boilerplate Spring Boot code
- Creating comprehensive test suites
- Refactoring legacy code
- Generating API documentation
- Setting up CI/CD pipelines
- Creating database migrations
- Implementing common design patterns

⚠️ **Use with Caution:**
- Critical business logic implementation
- Security-sensitive code (authentication, authorization)
- Complex architectural decisions
- Production configuration changes
- Database schema modifications

## Types of Agents

### 1. Code Generation Agents

**Purpose:** Generate complete code components following project patterns and best practices.

**Capabilities:**
- Create REST controllers with proper annotations and error handling
- Generate service layer classes with business logic structure
- Create repository interfaces with custom queries
- Generate entity models with proper JPA annotations
- Create DTOs and request/response objects
- Implement validation logic

**Example Usage:**
```
Prompt: "Create a Spring Boot REST controller for managing field service tickets 
with CRUD operations, pagination, and proper error handling"
```

**Best Practices:**
- Provide clear context about the domain model
- Specify required fields and validation rules
- Mention any specific patterns (e.g., using Lombok, MapStruct)
- Review generated code for alignment with project standards

### 2. Testing Agents

**Purpose:** Generate comprehensive test suites for unit, integration, and end-to-end testing.

**Capabilities:**
- Create unit tests with JUnit 5 and Mockito
- Generate integration tests using Spring Boot Test
- Create repository tests with @DataJpaTest
- Generate controller tests with @WebMvcTest
- Create tests for Feign clients
- Generate Kafka messaging tests
- Set up test fixtures and mock data

**Example Usage:**
```
Prompt: "Generate unit tests for the TicketService class with Mockito, 
covering all CRUD operations and edge cases"
```

**Best Practices:**
- Request tests for both happy paths and error scenarios
- Ensure tests follow AAA pattern (Arrange, Act, Assert)
- Ask for meaningful test names that describe behavior
- Request proper use of test annotations (@Mock, @InjectMocks)

### 3. Refactoring Agents

**Purpose:** Improve existing code quality, performance, and maintainability.

**Capabilities:**
- Extract methods and classes for better organization
- Apply design patterns (Strategy, Factory, Builder, etc.)
- Improve error handling and logging
- Optimize database queries
- Modernize legacy code to use Java 17+ features
- Improve code readability and documentation

**Example Usage:**
```
Prompt: "Refactor this service class to use constructor injection instead of 
field injection and add proper logging"
```

**Best Practices:**
- Start with small, focused refactoring tasks
- Ensure existing tests pass after refactoring
- Request explanations for suggested changes
- Validate that refactored code maintains functionality

### 4. Documentation Agents

**Purpose:** Generate comprehensive documentation for code, APIs, and architecture.

**Capabilities:**
- Generate JavaDoc comments for classes and methods
- Create OpenAPI/Swagger API documentation
- Generate README files for microservices
- Create architecture decision records (ADRs)
- Generate API usage examples
- Create changelog entries

**Example Usage:**
```
Prompt: "Generate comprehensive JavaDoc for this controller class including 
parameter descriptions and return values"
```

**Best Practices:**
- Request documentation that matches project style
- Include examples in API documentation
- Ensure documentation stays in sync with code
- Use consistent terminology across documentation

### 5. Microservices Scaffolding Agents

**Purpose:** Set up new microservices with complete project structure and dependencies.

**Capabilities:**
- Create complete Spring Boot project structure
- Set up Maven/Gradle dependencies
- Configure Spring Cloud components (Eureka, Config, Gateway)
- Set up database configuration and migrations
- Create Docker and Kubernetes manifests
- Set up CI/CD pipeline configuration

**Example Usage:**
```
Prompt: "Create a new Spring Boot microservice for inventory management with 
Eureka integration, PostgreSQL database, and Kafka messaging"
```

**Best Practices:**
- Follow the project's established structure
- Use consistent naming conventions
- Include all necessary Spring Cloud dependencies
- Set up proper health checks and metrics

### 6. Debugging and Troubleshooting Agents

**Purpose:** Help identify and fix bugs, performance issues, and code problems.

**Capabilities:**
- Analyze error logs and stack traces
- Suggest fixes for common Spring Boot issues
- Identify performance bottlenecks
- Recommend improvements for error handling
- Help with dependency conflicts
- Assist with configuration issues

**Example Usage:**
```
Prompt: "Analyze this NullPointerException and suggest a fix with proper 
null checking and error handling"
```

**Best Practices:**
- Provide complete error messages and stack traces
- Share relevant code context
- Request explanations for suggested fixes
- Validate fixes with appropriate tests

## Best Practices

### General Guidelines

1. **Be Specific and Clear**
   - Provide detailed context in your prompts
   - Specify the exact component or functionality needed
   - Mention any constraints or requirements

2. **Iterative Refinement**
   - Start with a basic request
   - Review the generated code
   - Refine your prompt based on the results
   - Iterate until the code meets standards

3. **Always Review Generated Code**
   - Understand what the agent generated
   - Verify alignment with project patterns
   - Check for security vulnerabilities
   - Ensure proper error handling

4. **Maintain Consistency**
   - Follow existing code patterns
   - Use project naming conventions
   - Maintain consistent code style
   - Adhere to architectural principles

5. **Test Thoroughly**
   - Generate tests along with code
   - Run existing test suites
   - Add integration tests for new features
   - Verify edge cases

### Effective Prompting

**Good Example:**
```
"Create a Spring Boot REST controller for managing customer orders with the following:
- CRUD operations (create, read, update, delete)
- Pagination support with default page size of 20
- Filtering by status and date range
- Proper validation using @Valid
- Exception handling with @RestControllerAdvice
- Logging using Slf4j
- OpenAPI documentation annotations"
```

**Poor Example:**
```
"Create an order controller"
```

### Code Quality Checklist

Before accepting agent-generated code, verify:

- [ ] Follows Spring Boot best practices
- [ ] Uses dependency injection correctly
- [ ] Includes proper error handling
- [ ] Has appropriate logging statements
- [ ] Includes input validation
- [ ] Has JavaDoc documentation
- [ ] Follows REST API conventions
- [ ] Includes appropriate tests
- [ ] Uses transactions where needed
- [ ] Handles edge cases
- [ ] No security vulnerabilities
- [ ] No hardcoded values or credentials

## Agent Configuration

### Setting Up Agents in Your IDE

#### IntelliJ IDEA

1. Install the GitHub Copilot plugin
2. Sign in with your GitHub account
3. Enable Copilot in Settings > Tools > GitHub Copilot
4. Configure agent preferences:
   - Set language preferences to Java
   - Enable suggestions for comments and code
   - Configure keybindings for quick access

#### VS Code

1. Install GitHub Copilot extension
2. Install GitHub Copilot Chat extension
3. Sign in with your GitHub account
4. Configure workspace settings:
   ```json
   {
     "github.copilot.enable": {
       "*": true,
       "java": true,
       "yaml": true,
       "markdown": true
     }
   }
   ```

### Project-Specific Configuration

Create a `.copilot` configuration in your service directory:

```yaml
# .copilot/config.yml
language: java
framework: spring-boot
version: 3.x
patterns:
  - controller-service-repository
  - dto-mapper
  - exception-handling
style:
  - lombok
  - slf4j-logging
  - constructor-injection
```

### Environment Variables

Set up environment variables for agent context:

```bash
export COPILOT_PROJECT_TYPE="spring-boot-microservices"
export COPILOT_JAVA_VERSION="17"
export COPILOT_SPRING_BOOT_VERSION="3.x"
```

## Field Service Dispatch System

For comprehensive guidelines on managing the Field Service Task Dispatch System, including user personas, MVP features, product backlog, and daily operational procedures, see the dedicated [Field Service Task Dispatch System Guide](field-service-dispatch-system.md).

The dispatch system documentation includes:
- **User Personas**: Dispatcher, Field Technician, and Field Service Manager profiles with goals and pain points
- **MVP Features**: Core functionality including work order management, manual assignment, schedule visualization, mobile access, and location mapping
- **Product Backlog**: Organized using MoSCoW framework (Must-Have, Should-Have, Could-Have, Won't-Have)
- **Success Metrics**: Measurable targets for adoption, completion rates, and operational efficiency
- **Phased Roadmap**: 24-month implementation plan from MVP to AI-powered features
- **Agent Instructions**: Daily workflows for schedule optimization, real-time communication, exception handling, and reporting

## Usage Scenarios

### Scenario 1: Creating a New Microservice

**Task:** Create a new User Management microservice

**Agent Workflow:**
1. Use scaffolding agent to create project structure
2. Use code generation agent to create domain models
3. Use code generation agent to create repositories
4. Use code generation agent to create services
5. Use code generation agent to create controllers
6. Use testing agent to generate test suites
7. Use documentation agent to create API docs

**Example Prompts:**
```
1. "Create a Spring Boot 3.x microservice project structure for user management 
   with Eureka discovery, Config Server, and PostgreSQL"

2. "Create a User entity with fields: id, email, firstName, lastName, role, 
   createdAt, updatedAt. Include JPA annotations and validation"

3. "Create a UserRepository extending JpaRepository with custom queries for 
   finding users by email and role"

4. "Create a UserService with CRUD operations, including user registration, 
   update, deletion, and search functionality"

5. "Create a UserController with REST endpoints for all user operations, 
   including pagination and filtering"

6. "Generate comprehensive unit tests for UserService using JUnit 5 and Mockito"

7. "Generate OpenAPI documentation for the User Management API"
```

### Scenario 2: Adding a New Feature to Existing Service

**Task:** Add password reset functionality to User service

**Agent Workflow:**
1. Use code generation agent to add new methods to service
2. Use code generation agent to add new controller endpoints
3. Use testing agent to generate tests
4. Use documentation agent to update API docs

**Example Prompts:**
```
1. "Add password reset functionality to UserService including:
   - Generate reset token with expiration
   - Send reset email
   - Validate reset token
   - Update password"

2. "Add REST endpoints for password reset: POST /api/v1/users/forgot-password 
   and POST /api/v1/users/reset-password"

3. "Generate unit tests for password reset functionality including token 
   validation and expiration scenarios"

4. "Update OpenAPI documentation with new password reset endpoints"
```

### Scenario 3: Refactoring Legacy Code

**Task:** Modernize a legacy service to use Java 17 features

**Agent Workflow:**
1. Use refactoring agent to modernize code
2. Use testing agent to ensure tests still pass
3. Use documentation agent to update comments

**Example Prompts:**
```
1. "Refactor this service to use Java 17 features including:
   - Records for DTOs
   - Pattern matching for instanceof
   - Text blocks for multi-line strings
   - Switch expressions"

2. "Update tests to work with the refactored code and add any missing test cases"

3. "Update JavaDoc to reflect the refactored implementation"
```

### Scenario 4: Implementing Cross-Cutting Concerns

**Task:** Add distributed tracing to all services

**Agent Workflow:**
1. Use configuration agent to add dependencies
2. Use code generation agent to create tracing configuration
3. Use code generation agent to add tracing annotations
4. Use documentation agent to create usage guide

**Example Prompts:**
```
1. "Add Spring Cloud Sleuth and Zipkin dependencies to pom.xml"

2. "Create configuration class for distributed tracing with custom span names 
   and trace ID format"

3. "Add tracing annotations to service methods that make external calls"

4. "Create documentation explaining how to view traces in Zipkin"
```

### Scenario 5: Setting Up CI/CD Pipeline

**Task:** Create GitHub Actions workflow for service

**Agent Workflow:**
1. Use automation agent to create workflow file
2. Use configuration agent to set up build steps
3. Use documentation agent to document pipeline

**Example Prompts:**
```
1. "Create GitHub Actions workflow for Spring Boot microservice with:
   - Build and test on pull requests
   - Security scanning with CodeQL
   - Docker image build and push
   - Deployment to staging environment"

2. "Add sonarqube analysis step to the workflow"

3. "Create documentation for the CI/CD pipeline including deployment process"
```

## Security Considerations

### Code Security

When using agents for code generation:

- **Never commit credentials:** Agents should not generate hardcoded credentials
- **Validate input:** Ensure generated code includes proper input validation
- **Use parameterized queries:** Prevent SQL injection in generated database code
- **Implement authentication:** Verify security annotations are properly applied
- **Handle sensitive data:** Ensure sensitive data is encrypted and logged appropriately

### Agent Access Control

- Use agents only in development environments
- Don't share agent-generated credentials
- Review security-sensitive code manually
- Run security scans on generated code
- Follow principle of least privilege

### Compliance

Ensure agent-generated code complies with:
- OWASP Top 10 security standards
- GDPR data protection requirements
- Industry-specific regulations
- Company security policies

## Troubleshooting

### Common Issues and Solutions

#### Issue: Agent generates code that doesn't follow project patterns

**Solution:**
- Provide more specific prompts with examples from existing code
- Reference project style guides in your prompts
- Break down complex requests into smaller, focused tasks

#### Issue: Generated code doesn't compile

**Solution:**
- Verify all required imports are included
- Check for compatibility with Spring Boot version
- Ensure dependencies are in pom.xml
- Review for syntax errors

#### Issue: Generated tests fail

**Solution:**
- Verify mock setup is correct
- Check test data matches actual behavior
- Ensure proper test isolation
- Review assertions for correctness

#### Issue: Agent suggests outdated patterns

**Solution:**
- Specify the Spring Boot and Java versions in your prompt
- Mention that you want modern best practices
- Reference current project patterns
- Review and update generated code

#### Issue: Generated code has performance issues

**Solution:**
- Request optimization in your prompt
- Specify performance requirements
- Ask for lazy loading where appropriate
- Review database query efficiency

### Getting Help

If you encounter issues with agents:

1. **Check documentation:** Review this guide and [Copilot instructions](copilot-instructions.md)
2. **Search existing issues:** Check if others have encountered similar problems
3. **Ask the team:** Reach out in development channels
4. **Create an issue:** Document the problem for team awareness
5. **Refine your approach:** Experiment with different prompting strategies

## Best Use Guidelines by Development Phase

### Planning Phase
- Use agents to create ADRs (Architecture Decision Records)
- Generate project structure proposals
- Create technical specification templates

### Development Phase
- Use agents for boilerplate code generation
- Generate test cases alongside implementation
- Create API documentation as you build

### Testing Phase
- Generate comprehensive test suites
- Create test data and fixtures
- Generate performance test scenarios

### Deployment Phase
- Generate deployment scripts
- Create monitoring and alerting configurations
- Generate runbooks and operational documentation

### Maintenance Phase
- Use agents for refactoring
- Generate migration scripts
- Create changelog entries

## Integration with Project Workflow

### Pull Request Guidelines

When submitting agent-generated code:

1. **Disclosure:** Mention that code was agent-generated in PR description
2. **Review:** Ensure thorough code review
3. **Testing:** Include comprehensive tests
4. **Documentation:** Update relevant documentation
5. **Changelog:** Add entries for significant changes

### Code Review Checklist

When reviewing agent-generated code:

- [ ] Code follows project conventions
- [ ] No security vulnerabilities
- [ ] Proper error handling
- [ ] Adequate test coverage
- [ ] Documentation is complete
- [ ] Performance is acceptable
- [ ] No breaking changes (or properly versioned)

## Continuous Improvement

### Feedback Loop

Help improve agent effectiveness:

1. **Document patterns:** Add successful prompts to team knowledge base
2. **Share learnings:** Present agent usage tips in team meetings
3. **Update guidelines:** Contribute to this documentation
4. **Report issues:** Document problems and workarounds

### Training and Onboarding

For new team members:

1. Review this guide thoroughly
2. Practice with simple tasks first
3. Pair with experienced developers
4. Start with code generation, progress to complex tasks
5. Ask for prompt review before using agents for critical code

## Additional Resources

### Internal Documentation
- [Main Copilot Instructions](copilot-instructions.md)
- [Field Service Task Dispatch System](field-service-dispatch-system.md)
- [Spring Boot Guidelines](copilot-instructions/spring-boot.md)
- [Microservices Patterns](copilot-instructions/microservices.md)
- [Testing Guidelines](copilot-instructions/testing.md)
- [API Design Guidelines](copilot-instructions/api-design.md)

### External Resources
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Java 17 Features](https://openjdk.org/projects/jdk/17/)

## Updating This Guide

This guide should evolve with our practices. To suggest updates:

1. Create an issue with the `documentation` label
2. Submit a pull request with proposed changes
3. Discuss in team meetings
4. Keep examples current and relevant

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-23  
**Maintained By:** Field Services Development Team

**Remember:** Agents are powerful tools, but they don't replace thoughtful engineering. Always review, understand, and test agent-generated code thoroughly before committing to the codebase.
