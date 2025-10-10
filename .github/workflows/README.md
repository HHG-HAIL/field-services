# GitHub Actions Workflow Templates

This directory contains ready-to-use GitHub Actions workflow templates for the Task Dispatch System.

## 🚀 Available Workflows

### 1. Main Workflows (Production Ready)

- **`ci-cd.yml`** - Main CI/CD pipeline with service selection
- **`manual-deploy.yml`** - Manual deployment workflow
- **`pr-check.yml`** - Pull request validation
- **`feature-branch.yml`** - Feature branch quick checks

### 2. Template Examples

#### Docker Deployment Template
```yaml
name: Docker Deployment
on:
  workflow_dispatch:
    inputs:
      service:
        description: 'Service to deploy'
        required: true
        type: choice
        options: ['frontend', 'work-order-service', 'technician-service', 'schedule-service']

jobs:
  docker-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and Push Docker Image
        run: |
          docker build -t your-registry/${{ github.event.inputs.service }}:${{ github.sha }} .
          docker push your-registry/${{ github.event.inputs.service }}:${{ github.sha }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/${{ github.event.inputs.service }} \
            ${{ github.event.inputs.service }}=your-registry/${{ github.event.inputs.service }}:${{ github.sha }}
```

#### Azure Deployment Template
```yaml
name: Azure App Service Deployment
on:
  workflow_dispatch:
    inputs:
      service:
        type: choice
        options: ['frontend', 'backend-services']

jobs:
  deploy-azure:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Deploy to Azure App Service
        uses: azure/webapps-deploy@v2
        with:
          app-name: task-dispatch-${{ github.event.inputs.service }}
          package: './build'
```

#### AWS Deployment Template
```yaml
name: AWS ECS Deployment
on:
  workflow_dispatch:

jobs:
  deploy-aws:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster task-dispatch --service frontend --force-new-deployment
```

## 🛠️ Customization Guide

### Adding New Services

1. **Update service lists in all workflows**:
   ```yaml
   options:
     - 'frontend'
     - 'work-order-service'
     - 'technician-service' 
     - 'schedule-service'
     - 'your-new-service'    # Add here
   ```

2. **Add build logic**:
   ```yaml
   - name: Build your-new-service
     if: ${{ matrix.service == 'your-new-service' }}
     working-directory: ./backend
     run: mvn clean package -pl your-new-service -am -DskipTests
   ```

### Environment Configuration

Update environment URLs in workflows:

```yaml
# Development
REACT_APP_API_URL: "http://localhost:8080"
REACT_APP_WS_URL: "ws://localhost:8080/ws"

# Staging  
REACT_APP_API_URL: "https://staging-api.yourdomain.com"
REACT_APP_WS_URL: "wss://staging-api.yourdomain.com/ws"

# Production
REACT_APP_API_URL: "https://api.yourdomain.com" 
REACT_APP_WS_URL: "wss://api.yourdomain.com/ws"
```

### Notification Setup

Add to any workflow:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#deployments'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}

- name: Notify Teams
  if: always()
  uses: skitionek/notify-microsoft-teams@master
  with:
    webhook_url: ${{ secrets.TEAMS_WEBHOOK }}
    message: "Deployment ${{ job.status }}"
```

## 🔐 Required Secrets

Set these in GitHub Settings → Secrets:

### General
- `GITHUB_TOKEN` (automatically provided)

### Cloud Providers
- `AZURE_CREDENTIALS` - Azure service principal
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

### Container Registries
- `DOCKER_HUB_USERNAME` - Docker Hub username
- `DOCKER_HUB_TOKEN` - Docker Hub access token
- `GITHUB_TOKEN` - For GitHub Container Registry

### Code Quality
- `SONAR_TOKEN` - SonarCloud token
- `CODECOV_TOKEN` - CodeCov token

### Notifications
- `SLACK_WEBHOOK` - Slack webhook URL
- `TEAMS_WEBHOOK` - Microsoft Teams webhook URL

## 📋 Workflow Triggers

### Automatic Triggers
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday 2 AM
```

### Manual Triggers
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment'
        required: true
        type: choice
        options: ['dev', 'staging', 'prod']
        default: 'dev'
```

## 🏃‍♂️ Quick Start

1. **Copy a workflow template**
2. **Customize for your infrastructure**
3. **Add required secrets**
4. **Test with a manual trigger**
5. **Enable automatic triggers**

## 💡 Best Practices

### Security
- Use least-privilege service accounts
- Store sensitive data in secrets
- Enable branch protection rules
- Use environment protection rules

### Performance  
- Cache dependencies (Maven, npm)
- Run jobs in parallel when possible
- Skip unnecessary steps with conditions
- Use appropriate runner types

### Maintainability
- Use reusable workflows for common tasks
- Document custom workflows
- Version your deployment scripts
- Use semantic versioning for releases

## 🐛 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Check secrets are set
   # Verify service account permissions
   # Review workflow permissions
   ```

2. **Build Failures**
   ```bash
   # Clear caches
   # Check dependency versions
   # Review error logs
   ```

3. **Deployment Failures**
   ```bash
   # Check target environment health
   # Verify network connectivity
   # Review deployment logs
   ```

### Debug Mode
```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

## 📞 Support

For workflow issues:
1. Check workflow run logs
2. Review this documentation  
3. Search existing issues
4. Create new issue with `workflow` label