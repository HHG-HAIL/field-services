# Spring Boot Microservices Backend - Setup Guide

## Project Structure
```
backend/
├── pom.xml (parent)
├── work-order-service/
│   ├── pom.xml
│   └── src/main/java/com/fieldservice/workorder/
├── technician-service/
│   ├── pom.xml  
│   └── src/main/java/com/fieldservice/technician/
└── schedule-service/
    ├── pom.xml
    └── src/main/java/com/fieldservice/schedule/
```

## Prerequisites

### 1. Java 17+ Installation
Your system currently has Java 11, but Spring Boot 3 requires Java 17+.

**Download and install Java 17:**
- Visit: https://adoptium.net/temurin/releases/
- Download OpenJDK 17 for Windows
- Install and update JAVA_HOME environment variable

**Verify installation:**
```bash
java -version
# Should show Java 17 or higher
```

### 2. Maven Installation
**Download and install Maven:**
- Visit: https://maven.apache.org/download.cgi
- Download Binary zip archive
- Extract to C:\Program Files\Maven
- Add C:\Program Files\Maven\bin to PATH environment variable

**Verify installation:**
```bash
mvn -version
```

## Build and Run Instructions

### 1. Compile All Services
```bash
cd backend
mvn clean compile
```

### 2. Run Individual Services

**Terminal 1 - Work Order Service:**
```bash
cd work-order-service
mvn spring-boot:run
```
Runs on: http://localhost:8081

**Terminal 2 - Technician Service:**
```bash
cd technician-service  
mvn spring-boot:run
```
Runs on: http://localhost:8082

**Terminal 3 - Schedule Service:**
```bash
cd schedule-service
mvn spring-boot:run
```
Runs on: http://localhost:8083

## API Endpoints

### Work Order Service (Port 8081)
- GET /api/work-orders - Get all work orders
- POST /api/work-orders - Create work order
- PUT /api/work-orders/{id} - Update work order
- DELETE /api/work-orders/{id} - Delete work order
- PATCH /api/work-orders/{id}/assign - Assign technician
- PATCH /api/work-orders/{id}/status - Update status

### Technician Service (Port 8082)
- GET /api/technicians - Get all technicians
- POST /api/technicians - Create technician
- PUT /api/technicians/{id} - Update technician
- DELETE /api/technicians/{id} - Delete technician
- GET /api/technicians/available - Get available technicians

### Schedule Service (Port 8083)
- GET /api/schedules - Get schedules
- POST /api/schedules - Create schedule entry
- GET /api/schedules/conflicts - Check conflicts

## Database Access
Each service has its own H2 database accessible at:
- Work Order: http://localhost:8081/h2-console
- Technician: http://localhost:8082/h2-console  
- Schedule: http://localhost:8083/h2-console

**Connection Details:**
- JDBC URL: See application.properties for each service
- Username: sa
- Password: password

## WebSocket Endpoints
- Work Order updates: ws://localhost:8081/ws
- Topics: /topic/workorders, /topic/workorders/updated, /topic/workorders/assigned

## Testing
```bash
# Run all tests
mvn test

# Run specific service tests
cd work-order-service && mvn test
```

## Frontend Integration
Update your React frontend to use these endpoints:
- Work Orders: http://localhost:8081/api/work-orders
- Technicians: http://localhost:8082/api/technicians
- Schedules: http://localhost:8083/api/schedules

## Next Steps
1. Install Java 17 and Maven
2. Run `mvn clean compile` to build
3. Start services in separate terminals
4. Update React frontend API calls
5. Test WebSocket connections for real-time updates

## Architecture Features
✅ **Multi-module Maven project**
✅ **Spring Boot 3.x with Java 17**  
✅ **H2 in-memory databases with initial data**
✅ **REST APIs with proper HTTP methods**
✅ **WebSocket for real-time updates**
✅ **CORS configuration for React frontend**
✅ **JPA entities with validation**
✅ **Repository pattern with custom queries**
✅ **Service layer with business logic**
✅ **DTO pattern for API responses**
✅ **Exception handling and logging**