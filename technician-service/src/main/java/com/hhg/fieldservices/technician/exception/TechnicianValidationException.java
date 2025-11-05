package com.hhg.fieldservices.technician.exception;

/**
 * Exception thrown when technician validation fails.
 * 
 * @author Field Services Team
 * @version 1.0
 */
public class TechnicianValidationException extends RuntimeException {
    
    public TechnicianValidationException(String message) {
        super(message);
    }
}
