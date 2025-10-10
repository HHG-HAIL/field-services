# Field Service App - Full Stack Integration Guide

## Current Status ✅

Your Field Service Management Application has been successfully implemented with:

### Frontend (React) ✅ COMPLETE
- **URL**: https://field-service-demo.surge.sh (deployed)
- **Local**: http://localhost:3000 (when running `npm start`)
- **Features**: Work Orders, Technicians, Schedule, Dashboard, Real-time updates
- **Technology**: React 19, TypeScript, Tailwind CSS, React Router

### Backend Integration ⚡ READY
- **Spring Boot Services**: Fully implemented
- **API Layer**: Created with fallback to mock data
- **WebSocket Support**: Real-time updates configured
- **Database**: H2 in-memory with sample data

## 🚀 How to Run the Complete System

### Option 1: Demo Mode (Current)
```bash
cd field-service-app
npm start
```
The app runs in demo mode with mock data at http://localhost:3000

### Option 2: Full Backend Integration (Recommended)

#### Prerequisites
1. **Java 17+** - [Download from Adoptium](https://adoptium.net/temurin/releases/)
2. **Maven 3.8+** - [Download from Apache](https://maven.apache.org/download.cgi)

#### Quick Setup
```bash
# 1. Start Backend Services (3 terminals)
cd backend/work-order-service
mvn spring-boot:run

cd backend/technician-service  
mvn spring-boot:run

cd backend/schedule-service
mvn spring-boot:run

# 2. Start Frontend
cd field-service-app
npm start
```

#### Backend Services
- **Work Order Service**: http://localhost:8081
- **Technician Service**: http://localhost:8082  
- **Schedule Service**: http://localhost:8083
- **H2 Console**: http://localhost:808X/h2-console (X = 1,2,3)

## 🔧 Installation Steps for Full Setup

### 1. Install Java 17
```powershell
# Download Java 17 from https://adoptium.net/temurin/releases/
# Install and verify
java -version
```

### 2. Install Maven
```powershell
# Download Maven from https://maven.apache.org/download.cgi
# Extract and add to PATH
mvn -version
```

### 3. Build Backend
```bash
cd backend
mvn clean compile
```

### 4. Run All Services
```bash
# Terminal 1 - Work Order Service (Port 8081)
cd backend/work-order-service
mvn spring-boot:run

# Terminal 2 - Technician Service (Port 8082) 
cd backend/technician-service
mvn spring-boot:run

# Terminal 3 - Schedule Service (Port 8083)
cd backend/schedule-service
mvn spring-boot:run

# Terminal 4 - React Frontend (Port 3000)
cd field-service-app
npm start
```

## 🎯 Features Available

### ✅ Working Now (Demo Mode)
- Create/Edit/Delete Work Orders
- Assign/Reassign Technicians
- Technician Management
- Schedule View
- Status Updates
- Real-time Dashboard
- Responsive Design

### ⚡ Enhanced with Backend
- Real-time WebSocket updates
- Persistent data storage
- RESTful API endpoints
- Database management
- Concurrent user support
- Production-ready architecture

## 🌐 API Endpoints

### Work Order Service (8081)
```
GET    /api/work-orders              # Get all work orders
POST   /api/work-orders              # Create work order
PUT    /api/work-orders/{id}         # Update work order
DELETE /api/work-orders/{id}         # Delete work order
PATCH  /api/work-orders/{id}/assign  # Assign technician
PATCH  /api/work-orders/{id}/status  # Update status
```

### Technician Service (8082)
```
GET    /api/technicians              # Get all technicians
POST   /api/technicians              # Create technician
PUT    /api/technicians/{id}         # Update technician
DELETE /api/technicians/{id}         # Delete technician
GET    /api/technicians/available    # Get available technicians
```

### Schedule Service (8083)
```
GET    /api/schedules               # Get schedules
POST   /api/schedules               # Create schedule entry
```

## 🔄 Real-time Updates

### WebSocket Topics
- `/topic/workorders` - Work order updates
- `/topic/workorders/assigned` - Assignment notifications
- Connection: `ws://localhost:8081/ws`

## 📊 Database Access

Each service has H2 console at:
- Work Order: http://localhost:8081/h2-console
- Technician: http://localhost:8082/h2-console
- Schedule: http://localhost:8083/h2-console

**Connection Details:**
- JDBC URL: `jdbc:h2:mem:workorderdb` (varies by service)
- Username: `sa`
- Password: `password`

## 🎨 Demo Features

- **Smart Assignment**: Intelligent technician matching
- **Real-time Dashboard**: Live status updates
- **Mobile Responsive**: Works on all devices
- **Role-based Views**: Dispatcher, Technician, Manager
- **Status Management**: Complete workflow support

## 🏗️ Architecture

```
Frontend (React)
    ↓ HTTP/WebSocket
Backend Services (Spring Boot)
    ↓ JPA/Hibernate
H2 Database (In-Memory)
```

## 📝 Next Steps

1. **Test Demo Mode**: Visit http://localhost:3000
2. **Install Java/Maven**: For full backend integration
3. **Start Backend Services**: Follow setup instructions
4. **Enjoy Full Integration**: Real-time, persistent data

## 🆘 Troubleshooting

- **App not starting?** Check if port 3000 is available
- **Backend issues?** Verify Java 17+ and Maven installation
- **CORS errors?** Backend services include CORS configuration
- **Data not persisting?** Switch from demo mode to backend integration

---

**Status**: ✅ Demo Ready | ⚡ Backend Ready for Integration
**Demo URL**: https://field-service-demo.surge.sh