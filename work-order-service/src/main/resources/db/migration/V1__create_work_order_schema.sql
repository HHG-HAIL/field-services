-- Create work_orders table
CREATE TABLE work_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    work_order_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    status VARCHAR(20) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(200),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    service_address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    assigned_technician_id BIGINT,
    assigned_technician_name VARCHAR(200),
    scheduled_date TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    notes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Create work_order_items table
CREATE TABLE work_order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    description VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_work_order_items_work_order FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE
);

-- Create indexes for work_orders table for optimal query performance
CREATE INDEX idx_work_order_number ON work_orders(work_order_number);
CREATE INDEX idx_status ON work_orders(status);
CREATE INDEX idx_priority ON work_orders(priority);
CREATE INDEX idx_customer_id ON work_orders(customer_id);
CREATE INDEX idx_assigned_technician_id ON work_orders(assigned_technician_id);
CREATE INDEX idx_scheduled_date ON work_orders(scheduled_date);
CREATE INDEX idx_created_at ON work_orders(created_at);

-- Create indexes for work_order_items table
CREATE INDEX idx_work_order_id ON work_order_items(work_order_id);
