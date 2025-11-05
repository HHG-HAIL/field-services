-- Initial schema for Technician Service
-- This creates the foundational tables for managing technicians

-- Create technicians table
CREATE TABLE IF NOT EXISTS technicians (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    status VARCHAR(20) NOT NULL,
    skill_level VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Create indexes for common queries
CREATE INDEX idx_technicians_status ON technicians(status);
CREATE INDEX idx_technicians_skill_level ON technicians(skill_level);
CREATE INDEX idx_technicians_email ON technicians(email);
CREATE INDEX idx_technicians_employee_id ON technicians(employee_id);
