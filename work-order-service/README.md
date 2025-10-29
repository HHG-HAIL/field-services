# Work Order Service

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/HHG-HAIL/field-services)

A microservice for managing field service work orders in the Field Services platform.

## Overview

The Work Order Service is responsible for managing the complete lifecycle of work orders, from creation to completion. It provides RESTful APIs for CRUD operations, status management, assignment to technicians, and various query capabilities.

## 🚀 Quick Deploy to Heroku

### One-Click Deployment

1. Click the **Deploy to Heroku** button above
2. Enter a unique app name (e.g., `your-work-order-service`)
3. Choose your region (US or Europe)  
4. Click **Deploy app**
5. Wait for deployment to complete
6. Click **View** to access your application
7. Access Swagger UI at: `https://your-app-name.herokuapp.com/swagger-ui.html`

### Manual Heroku Deployment

```bash
# Clone the repository
git clone https://github.com/HHG-HAIL/field-services.git
cd field-services/work-order-service

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-work-order-service

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:essential-0

# Deploy
git push heroku main

# Open your app
heroku open
```

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **H2 Database** (In-memory for development/testing)
- **Flyway** for database migrations
- **MapStruct** for object mapping
- **Lombok** for reducing boilerplate
- **JUnit 5** and **Mockito** for testing

## Database Schema

### Work Orders Table

The `work_orders` table stores the main work order information.

| Column                      | Type          | Constraints           | Description                              |
|-----------------------------|---------------|-----------------------|------------------------------------------|
| id                          | BIGINT        | PRIMARY KEY, AUTO_INC | Unique identifier                        |
| work_order_number           | VARCHAR(50)   | UNIQUE, NOT NULL      | Human-readable work order number         |
| title                       | VARCHAR(200)  | NOT NULL              | Brief title/summary                      |
| description                 | VARCHAR(2000) |                       | Detailed description                     |
| status                      | VARCHAR(20)   | NOT NULL              | Current status (enum)                    |
| priority                    | VARCHAR(20)   | NOT NULL              | Priority level (enum)                    |
| customer_id                 | BIGINT        | NOT NULL              | Reference to customer                    |
| customer_name               | VARCHAR(200)  |                       | Customer name for quick reference        |
| customer_phone              | VARCHAR(20)   |                       | Customer phone number                    |
| customer_email              | VARCHAR(100)  |                       | Customer email                           |
| service_address             | VARCHAR(500)  |                       | Address where service is performed       |
| city                        | VARCHAR(100)  |                       | Service location city                    |
| state                       | VARCHAR(50)   |                       | Service location state                   |
| zip_code                    | VARCHAR(20)   |                       | Service location ZIP code                |
| assigned_technician_id      | BIGINT        |                       | Reference to assigned technician         |
| assigned_technician_name    | VARCHAR(200)  |                       | Technician name for quick reference      |
| scheduled_date              | TIMESTAMP     |                       | Scheduled date and time                  |
| started_at                  | TIMESTAMP     |                       | Actual start time                        |
| completed_at                | TIMESTAMP     |                       | Actual completion time                   |
| estimated_cost              | DECIMAL(10,2) |                       | Estimated cost                           |
| actual_cost                 | DECIMAL(10,2) |                       | Actual cost after completion             |
| notes                       | VARCHAR(1000) |                       | Additional notes                         |
| created_at                  | TIMESTAMP     | NOT NULL              | Record creation timestamp                |
| updated_at                  | TIMESTAMP     | NOT NULL              | Record last update timestamp             |
| version                     | BIGINT        | NOT NULL, DEFAULT 0   | Optimistic locking version               |

#### Status Enumeration

- `PENDING` - Work order created but not yet assigned
- `ASSIGNED` - Assigned to a technician
- `IN_PROGRESS` - Currently being worked on
- `ON_HOLD` - Paused or put on hold
- `COMPLETED` - Successfully completed
- `CANCELLED` - Cancelled

#### Priority Enumeration

- `LOW` - Low priority, can be scheduled at convenience
- `NORMAL` - Standard priority
- `HIGH` - High priority, should be scheduled soon
- `CRITICAL` - Critical priority, requires immediate attention
- `EMERGENCY` - Highest priority, immediate response required

#### Indexes

The following indexes are created for optimal query performance:

- `idx_work_order_number` - Unique index on work_order_number
- `idx_status` - Index on status for filtering
- `idx_priority` - Index on priority for filtering
- `idx_customer_id` - Index for customer queries
- `idx_assigned_technician_id` - Index for technician queries
- `idx_scheduled_date` - Index for date-based queries
- `idx_created_at` - Index for temporal queries

### Work Order Items Table

The `work_order_items` table stores line items/tasks associated with work orders.

| Column          | Type          | Constraints           | Description                          |
|-----------------|---------------|-----------------------|--------------------------------------|
| id              | BIGINT        | PRIMARY KEY, AUTO_INC | Unique identifier                    |
| work_order_id   | BIGINT        | FK, NOT NULL          | Reference to work_orders table       |
| item_type       | VARCHAR(20)   | NOT NULL              | Type of item (LABOR, MATERIAL, etc.) |
| description     | VARCHAR(200)  | NOT NULL              | Item description                     |
| quantity        | INT           | NOT NULL              | Quantity                             |
| unit_price      | DECIMAL(10,2) |                       | Price per unit                       |
| total_price     | DECIMAL(10,2) |                       | Total price (calculated)             |
| notes           | VARCHAR(500)  |                       | Additional notes                     |
| created_at      | TIMESTAMP     | NOT NULL              | Record creation timestamp            |
| updated_at      | TIMESTAMP     | NOT NULL              | Record last update timestamp         |
| version         | BIGINT        | NOT NULL, DEFAULT 0   | Optimistic locking version           |

#### Relationships

- **One-to-Many**: A work order can have multiple work order items
- **Cascade Delete**: When a work order is deleted, all associated items are deleted

## Entity Relationships

```
WorkOrder (1) -----> (Many) WorkOrderItem
```

## API Endpoints

### Work Order Operations

#### Get All Work Orders
```
GET /api/v1/work-orders
```
Returns a list of all work orders.

#### Get Work Order by ID
```
GET /api/v1/work-orders/{id}
```
Returns a specific work order by its ID.

#### Get Work Order by Number
```
GET /api/v1/work-orders/number/{workOrderNumber}
```
Returns a work order by its unique work order number.

#### Get Work Orders by Status
```
GET /api/v1/work-orders/status/{status}
```
Returns all work orders with the specified status.

#### Get Work Orders by Priority
```
GET /api/v1/work-orders/priority/{priority}
```
Returns all work orders with the specified priority.

#### Get Work Orders by Customer
```
GET /api/v1/work-orders/customer/{customerId}
```
Returns all work orders for a specific customer.

#### Get Work Orders by Technician
```
GET /api/v1/work-orders/technician/{technicianId}
```
Returns all work orders assigned to a specific technician.

#### Get Overdue Work Orders
```
GET /api/v1/work-orders/overdue
```
Returns all work orders that are past their scheduled date and not completed.

#### Create Work Order
```
POST /api/v1/work-orders
Content-Type: application/json

{
  "title": "HVAC Repair",
  "description": "Air conditioning unit not cooling",
  "priority": "HIGH",
  "customerId": 100,
  "customerName": "John Doe",
  "customerPhone": "555-1234",
  "customerEmail": "john@example.com",
  "serviceAddress": "123 Main St",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62701",
  "scheduledDate": "2025-10-25T10:00:00",
  "estimatedCost": 500.00,
  "items": [
    {
      "itemType": "LABOR",
      "description": "Diagnostic and repair",
      "quantity": 2,
      "unitPrice": 100.00
    }
  ]
}
```

#### Update Work Order
```
PUT /api/v1/work-orders/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "priority": "CRITICAL",
  "status": "IN_PROGRESS",
  "actualCost": 550.00
}
```

#### Delete Work Order
```
DELETE /api/v1/work-orders/{id}
```

#### Assign Work Order to Technician
```
POST /api/v1/work-orders/{id}/assign?technicianId=200&technicianName=Jane Tech
```

#### Update Work Order Status
```
PATCH /api/v1/work-orders/{id}/status?status=IN_PROGRESS
```

## Building and Running

### Prerequisites

- Java 17 or higher
- Maven 3.6+

### Build

```bash
mvn clean install
```

### Run

```bash
mvn spring-boot:run
```

The service will start on port 8084 by default.

### Access H2 Console

When running locally, you can access the H2 database console at:
```
http://localhost:8084/h2-console
```

Connection details:
- JDBC URL: `jdbc:h2:mem:workorderdb`
- Username: `sa`
- Password: (empty)

## Testing

### Run All Tests

```bash
mvn test
```

### Test Coverage

The project includes:
- Unit tests for service layer
- Integration tests for repository layer
- Controller integration tests using MockMvc

## Configuration

### Application Properties

Key configuration properties in `application.yml`:

```yaml
spring:
  application:
    name: work-order-service
  datasource:
    url: jdbc:h2:mem:workorderdb
  jpa:
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true

server:
  port: 8084
```

## Database Migrations

Database migrations are managed using Flyway. Migration scripts are located in:
```
src/main/resources/db/migration/
```

Current migrations:
- `V1__create_work_order_schema.sql` - Initial schema creation

## Design Decisions

### Normalization

The schema follows third normal form (3NF) with proper separation of concerns:
- Work orders and work order items are in separate tables
- No repeating groups
- All non-key attributes depend on the primary key

### Denormalization for Performance

Some denormalization is used for performance optimization:
- Customer name, phone, and email are stored in work_orders table for quick access
- Technician name is stored alongside technician ID

### Indexing Strategy

Indexes are created on frequently queried columns:
- Status and priority for filtering
- Customer and technician IDs for relationship queries
- Dates for temporal queries

### Scalability Considerations

- Uses optimistic locking (version field) to handle concurrent updates
- Indexes on foreign keys and frequently queried fields
- Cascade delete ensures referential integrity
- H2 can be easily replaced with PostgreSQL/MySQL for production

### Future Enhancements

The schema is designed to support:
- Integration with separate Customer and Technician services
- Event-driven architecture for status changes
- Audit logging of all changes
- File attachments (photos, documents)
- Work order templates
- Recurring work orders
- Service Level Agreements (SLAs)

## Monitoring

Health check endpoint:
```
GET /actuator/health
```

Flyway migration info:
```
GET /actuator/flyway
```

## Contributing

Please follow the coding standards and best practices outlined in the [Copilot Instructions](../.github/copilot-instructions.md).

## License

This project is part of the Field Services platform.
