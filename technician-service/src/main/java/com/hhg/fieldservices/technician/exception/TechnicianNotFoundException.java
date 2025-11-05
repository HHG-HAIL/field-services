package com.hhg.fieldservices.technician.exception;

/**
 * Exception thrown when a technician is not found.
 * 
 * @author Field Services Team
 * @version 1.0
 */
public class TechnicianNotFoundException extends RuntimeException {
    
    public TechnicianNotFoundException(Long id) {
        super("Technician not found with id: " + id);
    }
    
    public TechnicianNotFoundException(String employeeId) {
        super("Technician not found with employee ID: " + employeeId);
    }
}
