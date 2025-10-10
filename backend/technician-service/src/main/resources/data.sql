-- Initial data for Technicians
INSERT INTO technicians (name, email, phone_number, status, current_location, experience_years, hourly_rate, max_concurrent_orders, created_at, updated_at) VALUES
('John Smith', 'john.smith@fieldservice.com', '+1-555-1001', 'BUSY', 'StartupHub', 5, 75.00, 3, NOW(), NOW()),
('Sarah Johnson', 'sarah.johnson@fieldservice.com', '+1-555-1002', 'BUSY', 'Metro Properties', 8, 85.00, 4, NOW(), NOW()),
('Mike Davis', 'mike.davis@fieldservice.com', '+1-555-1003', 'BUSY', 'Manufacturing Co', 3, 65.00, 2, NOW(), NOW()),
('Emily Chen', 'emily.chen@fieldservice.com', '+1-555-1004', 'OFFLINE', 'Home Base', 10, 95.00, 5, NOW(), NOW()),
('Robert Wilson', 'robert.wilson@fieldservice.com', '+1-555-1005', 'BUSY', 'City Mall', 6, 80.00, 3, NOW(), NOW()),
('Lisa Brown', 'lisa.brown@fieldservice.com', '+1-555-1006', 'AVAILABLE', 'Central Hub', 4, 70.00, 3, NOW(), NOW());

-- Initial skills data for technicians
INSERT INTO technician_skills (technician_id, skill) VALUES
(1, 'Network Installation'),
(1, 'Hardware Repair'),
(1, 'Cable Management'),
(2, 'HVAC Systems'),
(2, 'Electrical Work'),
(2, 'Troubleshooting'),
(3, 'Software Installation'),
(3, 'System Configuration'),
(3, 'User Training'),
(4, 'Security Systems'),
(4, 'Access Control'),
(4, 'Surveillance'),
(4, 'Network Security'),
(5, 'Plumbing'),
(5, 'General Maintenance'),
(5, 'Equipment Repair'),
(6, 'Network Installation'),
(6, 'Electrical Work'),
(6, 'Project Management');