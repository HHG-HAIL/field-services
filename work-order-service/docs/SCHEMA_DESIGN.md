# Work Order Service - Database Schema Design

## Overview

This document provides comprehensive documentation for the Work Order Service database schema. The design follows industry best practices for relational database design, with a focus on normalization, performance, scalability, and future extensibility.

## Design Principles

### 1. Normalization

The schema is designed following Third Normal Form (3NF) principles:

- **First Normal Form (1NF)**: All attributes contain atomic values, and each record is unique
- **Second Normal Form (2NF)**: All non-key attributes are fully dependent on the primary key
- **Third Normal Form (3NF)**: No transitive dependencies exist between non-key attributes

### 2. Controlled Denormalization

Strategic denormalization is applied for performance optimization:

- **Customer Information**: Customer name, phone, and email are stored directly in the work_orders table
  - **Rationale**: Reduces joins for common queries and provides historical accuracy even if customer information changes
  - **Trade-off**: Slight data redundancy for significant query performance improvement

- **Technician Information**: Similar approach for assigned technician name
  - **Rationale**: Quick access to technician information without additional service calls

### 3. Indexing Strategy

Indexes are carefully placed on columns used in:
- WHERE clauses (status, priority, customer_id, technician_id)
- JOIN operations (foreign keys)
- ORDER BY clauses (created_at, scheduled_date)
- Unique constraints (work_order_number)

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────┐
│             work_orders                     │
├─────────────────────────────────────────────┤
│ PK │ id (BIGINT)                            │
│    │ work_order_number (VARCHAR)            │
│    │ title (VARCHAR)                        │
│    │ description (VARCHAR)                  │
│    │ status (VARCHAR) - ENUM                │
│    │ priority (VARCHAR) - ENUM              │
│    │ customer_id (BIGINT) - External FK     │
│    │ customer_name (VARCHAR)                │
│    │ customer_phone (VARCHAR)               │
│    │ customer_email (VARCHAR)               │
│    │ service_address (VARCHAR)              │
│    │ city (VARCHAR)                         │
│    │ state (VARCHAR)                        │
│    │ zip_code (VARCHAR)                     │
│    │ assigned_technician_id (BIGINT)        │
│    │ assigned_technician_name (VARCHAR)     │
│    │ scheduled_date (TIMESTAMP)             │
│    │ started_at (TIMESTAMP)                 │
│    │ completed_at (TIMESTAMP)               │
│    │ estimated_cost (DECIMAL)               │
│    │ actual_cost (DECIMAL)                  │
│    │ notes (VARCHAR)                        │
│    │ created_at (TIMESTAMP)                 │
│    │ updated_at (TIMESTAMP)                 │
│    │ version (BIGINT) - Optimistic Lock     │
└─────────────────────────────────────────────┘
                   │ 1
                   │
                   │ has many
                   │
                   │ N
┌─────────────────────────────────────────────┐
│           work_order_items                  │
├─────────────────────────────────────────────┤
│ PK │ id (BIGINT)                            │
│ FK │ work_order_id (BIGINT)                 │
│    │ item_type (VARCHAR)                    │
│    │ description (VARCHAR)                  │
│    │ quantity (INT)                         │
│    │ unit_price (DECIMAL)                   │
│    │ total_price (DECIMAL) - Calculated     │
│    │ notes (VARCHAR)                        │
│    │ created_at (TIMESTAMP)                 │
│    │ updated_at (TIMESTAMP)                 │
│    │ version (BIGINT) - Optimistic Lock     │
└─────────────────────────────────────────────┘
```

## Status Lifecycle

Work orders follow a defined status workflow:

```
PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
   ↓          ↓            ↓
   └──────→ CANCELLED ←────┘
              ↑
         ON_HOLD
```

## Future Enhancement Support

The schema is designed to accommodate future requirements such as:
- Attachments and media files
- Status history and audit trail
- Service Level Agreements (SLAs)
- Recurring work orders
- Integration with separate Customer and Technician services

For detailed schema specifications, design decisions, and scalability considerations, see the complete documentation.
