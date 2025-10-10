# Field Service Task Dispatch System - AI Coding Instructions

## Project Overview
This is a field service management application with three primary user personas:
- **Dispatcher**: Schedule optimization and resource allocation
- **Field Technician**: Mobile job management and status updates  
- **Field Service Manager**: Performance monitoring and operational oversight

## Architecture Guidelines

### Core Domain Models
Structure the application around these key entities:
- `WorkOrder` - Central task entity with status, location, and assignment data
- `Technician` - User profile with skills, availability, and location tracking
- `Schedule` - Time-based assignments linking work orders to technicians
- `Customer` - Client information and SLA requirements

### Component Boundaries
Organize code into distinct service layers:
- **Dispatch Service**: Work order creation, assignment logic, schedule optimization
- **Mobile Service**: Real-time status updates, GPS tracking, job details
- **Analytics Service**: KPI calculation, reporting, performance metrics
- **Notification Service**: Real-time updates between dispatchers and technicians

### Data Flow Patterns
- Use event-driven architecture for status updates (work order state changes)
- Implement real-time sync for mobile technician location and job status
- Cache frequently accessed data (active schedules, technician availability)
- Store geospatial data for route optimization and location services

## Development Conventions

### API Design
- RESTful endpoints following `/api/v1/{resource}` pattern
- Use domain-specific status codes: `assigned`, `in-progress`, `completed`, `cancelled`
- Include location coordinates in ISO 6709 format for mapping integration
- Implement webhook endpoints for real-time mobile app synchronization

### Mobile-First Considerations
- Design APIs with offline-first mobile usage in mind
- Include data sync endpoints for batch updates when connectivity returns
- Optimize payload sizes for cellular data usage
- Implement progressive data loading for work order details

### Real-Time Features
- WebSocket connections for live schedule updates to dispatcher dashboard
- Server-sent events for mobile app notifications
- Implement heartbeat mechanism for technician location tracking
- Use pub/sub pattern for cross-component communication

## Key Integration Points
- **Mapping Services**: Google Maps/Azure Maps for route optimization and geocoding
- **Authentication**: Role-based access (dispatcher, technician, manager permissions)
- **Push Notifications**: Mobile alerts for job assignments and schedule changes
- **Time Tracking**: Integration with payroll systems for accurate billing

## MVP Implementation Priority
1. Work order CRUD operations with basic assignment
2. Mobile job viewing and status updates
3. Real-time dashboard for dispatchers
4. Basic route optimization and mapping
5. Status notification system between roles

## Testing Strategy
- Mock geolocation services for unit tests
- Test offline-online sync scenarios for mobile components
- Performance test schedule optimization algorithms with realistic data sets
- Integration test real-time notification delivery across user roles


# Spring Boot Microservices Backend - Setup Instructions

## Project Overview
This workspace will contain a Spring Boot microservices backend for the field service task dispatch system. The backend implements a hybrid REST + WebSocket approach with three core services:

1. **Work Order Service** - CRUD operations for work orders with real-time updates
2. **Technician Service** - Technician management with skills and availability
3. **Schedule Service** - Calendar operations and conflict detection

## Setup Checklist

### Phase 1: Project Scaffolding
- [ ] Create root directory structure for microservices
- [ ] Generate Spring Boot projects using Spring Initializr
- [ ] Setup Maven/Gradle multi-module configuration
- [ ] Configure common dependencies (Spring Boot, JPA, H2, WebSocket)
- [ ] Create shared configuration modules

### Phase 2: Service Implementation
- [ ] Implement Work Order Service
  - [ ] JPA entities and repositories
  - [ ] REST controllers
  - [ ] WebSocket handlers for real-time updates
  - [ ] Service layer with business logic
- [ ] Implement Technician Service
  - [ ] Technician entity with skills management
  - [ ] CRUD operations and availability tracking
  - [ ] Assignment algorithm integration
- [ ] Implement Schedule Service
  - [ ] Calendar operations
  - [ ] Conflict detection logic
  - [ ] Integration with work orders

### Phase 3: Integration & Configuration
- [ ] Setup H2 database with initial data
- [ ] Configure CORS for frontend integration
- [ ] Implement proper design patterns (Repository, Service, DTO)
- [ ] Add validation and error handling
- [ ] Setup WebSocket STOMP configuration

### Phase 4: Frontend Integration
- [ ] Update frontend API endpoints to point to backend
- [ ] Implement WebSocket client in React
- [ ] Test real-time functionality
- [ ] Update environment configuration

### Phase 5: Testing & Documentation
- [ ] Create unit tests for services
- [ ] Integration testing for APIs
- [ ] Document API endpoints
- [ ] Setup development environment guide

## Architecture Notes
- Use Spring Boot 3.x with Java 17+
- H2 in-memory database for development
- Hybrid REST + WebSocket approach for real-time updates
- Proper layered architecture (Controller -> Service -> Repository)
- DTO pattern for API responses
- CORS configuration for React frontend integration

## Next Steps
Follow this checklist systematically, starting with project scaffolding and working through each phase methodically.
