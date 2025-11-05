package com.hhg.fieldservices.technician.exception;

/**
 * Exception thrown when attempting to create a technician that already exists.
 * 
 * @author Field Services Team
 * @version 1.0
 */
public class TechnicianAlreadyExistsException extends RuntimeException {
    
    public TechnicianAlreadyExistsException(String email) {
        super("Technician already exists with email: " + email);
    }
    
    public TechnicianAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
