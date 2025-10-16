# CI/CD Pipeline Documentation

This repository includes a comprehensive CI/CD pipeline setup using GitHub Actions that supports selective service deployment and automated testing.

## 🏗️ Architecture Overview

The pipeline supports the following services:
- **Frontend**: React TypeScript application (`field-service-app/`)
- **Backend Services**:
  - Work Order Service (Port: 8081)
  - Technician Service (Port: 8082)
  - Schedule Service (Port: 8083)

## 📋 Available Workflows

### 1. Main CI/CD Pipeline (`ci-cd.yml`)
**Trigger**: Manual dispatch, Push to main/develop, Pull requests

**Features**:
- ✅ Service selection (all, frontend-only, backend-only, individual services, custom)
- ✅ Environment targeting (development, staging, production)
- ✅ Skip tests option
- ✅ Security scanning with Trivy
- ✅ Artifact uploading
- ✅ Quality gate enforcement
- ✅ Automatic deployment to staging/production

**Usage**:
```bash
# Via GitHub UI: Actions → CI/CD Pipeline → Run workflow
# Select services: all, frontend-only, backend-only, work-order-service, etc.
# Choose environment: development, staging, production
# Skip tests: true/false
```

### 2. Manual Deployment (`manual-deploy.yml`)
**Trigger**: Manual dispatch only

**Features**:
- 🎯 Single service deployment
- 🏷️ Version/tag selection
- 🔄 Force deployment option
- 🩺 Health checks
- ↩️ Automatic rollback on failure

**Usage**:
```bash
# Via GitHub UI: Actions → Manual Deployment → Run workflow
# Service: frontend, work-order-service, technician-service, schedule-service, all-backend, all-services
# Environment: development, staging, production
# Version: leave empty for latest or specify tag/commit
```

### 3. Pull Request Check (`pr-check.yml`)
**Trigger**: Pull requests to main/develop

**Features**:
- 🔍 Automatic change detection
- 🧪 Service-specific testing
- 🔗 Integration testing
- 📊 Code quality analysis
- 💬 Automated PR comments with results

## 🚀 Quick Start

### 1. Repository Setup

1. **Clone and setup**:
   ```bash
   git clone <your-repo>
   cd task-app
   ```

2. **Environment Configuration**:
   Create the following GitHub repository secrets:
   ```
   # Optional: For SonarCloud integration
   SONAR_TOKEN=your_sonar_token
   
   # For deployment (add your deployment secrets)
   AZURE_CREDENTIALS=your_azure_service_principal
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   DOCKER_HUB_USERNAME=your_docker_username
   DOCKER_HUB_TOKEN=your_docker_token
   ```

### 2. Running Your First Build

1. **Automatic (on PR)**:
   - Create a pull request
   - Pipeline automatically detects changes and runs relevant tests

2. **Manual (full build)**:
   - Go to Actions → CI/CD Pipeline → Run workflow
   - Select "all" services
   - Choose "development" environment
   - Click "Run workflow"

3. **Manual (single service)**:
   - Go to Actions → Manual Deployment → Run workflow
   - Select your desired service
   - Choose target environment
   - Click "Run workflow"

## ⚙️ Configuration

### Service Selection Options

| Option | Description | Services Built |
|--------|-------------|----------------|
| `all` | Build everything | Frontend + All Backend Services |
| `frontend-only` | Frontend only | field-service-app |
| `backend-only` | All backend services | work-order + technician + schedule |
| `work-order-service` | Single service | work-order-service only |
| `technician-service` | Single service | technician-service only |
| `schedule-service` | Single service | schedule-service only |
| `custom` | Custom selection | Based on custom_services input |

### Environment Configuration

The pipeline supports three environments:

1. **Development**:
   - API URL: `http://localhost:8080`
   - WebSocket: `ws://localhost:8080/ws`
   - Auto-deploy: On workflow_dispatch

2. **Staging**:
   - API URL: `https://staging-api.yourdomain.com`
   - WebSocket: `wss://staging-api.yourdomain.com/ws`
   - Auto-deploy: On push to `develop` branch

3. **Production**:
   - API URL: `https://api.yourdomain.com`
   - WebSocket: `wss://api.yourdomain.com/ws`
   - Auto-deploy: On push to `main` branch

## 🔧 Customization

### Adding New Services

1. **Update CI/CD Pipeline**:
   ```yaml
   # In .github/workflows/ci-cd.yml
   # Add your service to the service selection logic
   # Add build steps for your service
   ```

2. **Add Service Configuration**:
   ```yaml
   # Example for new service
   - name: Build new-service
     if: ${{ matrix.service == 'new-service' }}
     working-directory: ./backend
     run: mvn clean package -pl new-service -am -DskipTests
   ```

### Deployment Customization

Update the deployment sections in both workflows to match your infrastructure:

```yaml
# Example: Docker deployment
- name: Deploy service
  run: |
    docker build -t ${{ matrix.service }}:${{ github.sha }} .
    docker push your-registry/${{ matrix.service }}:${{ github.sha }}
    kubectl set image deployment/${{ matrix.service }} ${{ matrix.service }}=your-registry/${{ matrix.service }}:${{ github.sha }}
```

```yaml
# Example: Azure App Service deployment
- name: Deploy to Azure
  uses: azure/webapps-deploy@v2
  with:
    app-name: ${{ matrix.service }}-app
    package: backend/${{ matrix.service }}/target/*.jar
```

### Testing Configuration

#### Frontend Testing
- Tests run with Jest and React Testing Library
- Coverage reports uploaded to CodeCov
- Lint checking with ESLint (if configured)
- Type checking with TypeScript

#### Backend Testing
- Maven Surefire for unit tests
- Integration tests with embedded H2
- Service-specific test isolation
- Test reports uploaded as artifacts

## 📊 Monitoring and Notifications

### Artifacts
- **Build Artifacts**: JAR files, frontend builds (30-day retention)
- **Test Results**: Coverage reports, test outputs (7-day retention)
- **Security Scans**: Trivy vulnerability reports

### Notifications
The pipeline includes notification placeholders for:
- Slack integration
- Microsoft Teams
- Email notifications
- Custom webhook endpoints

To enable notifications, update the `notify` jobs in each workflow.

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check Java version
   java -version  # Should be 17+
   
   # Check Node version
   node -v        # Should be 18+
   
   # Clear Maven cache
   rm -rf ~/.m2/repository
   ```

2. **Test Failures**:
   ```bash
   # Run tests locally
   cd backend && mvn test
   cd field-service-app && npm test
   ```

3. **Deployment Issues**:
   - Check environment secrets are configured
   - Verify deployment target accessibility
   - Review deployment logs in GitHub Actions

### Debug Mode
Enable debug logging by adding these secrets to your repository:
```
ACTIONS_STEP_DEBUG=true
ACTIONS_RUNNER_DEBUG=true
```

## 🔒 Security

### Security Features
- ✅ Trivy vulnerability scanning
- ✅ Dependency checking
- ✅ Secret scanning (GitHub native)
- ✅ Code quality analysis (SonarCloud ready)
- ✅ SARIF report uploading

### Best Practices
- Use least-privilege service accounts
- Regularly update dependencies
- Review security scan results
- Enable branch protection rules
- Use environment-specific secrets

## 📈 Performance

### Optimization Features
- ✅ Maven dependency caching
- ✅ Node modules caching
- ✅ Parallel job execution
- ✅ Service-specific building
- ✅ Skip tests option for faster deploys

### Build Times (Approximate)
- Frontend only: 3-5 minutes
- Single backend service: 2-4 minutes
- All services: 8-12 minutes
- Full pipeline with tests: 10-15 minutes

## 🤝 Contributing

When contributing to this repository:

1. Create feature branches from `develop`
2. Ensure your changes include appropriate tests
3. Update documentation if needed
4. Submit PR against `develop` branch
5. Pipeline will automatically test your changes

### PR Requirements
- ✅ All tests must pass
- ✅ Code coverage maintained
- ✅ No security vulnerabilities
- ✅ Linting passes
- ✅ Build succeeds

## 📞 Support

For pipeline issues:
1. Check the [GitHub Actions logs](../../actions)
2. Review this documentation
3. Create an issue with the `ci/cd` label
4. Include workflow run URL and error details