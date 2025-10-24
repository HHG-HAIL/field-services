package com.hhg.fieldservices.workorder.exception;

/**
 * Exception thrown when work order validation fails.
 * 
 * @author Field Services Team
 * @version 1.0
 */
public class WorkOrderValidationException extends RuntimeException {
    
    public WorkOrderValidationException(String message) {
        super(message);
    }
    
    public WorkOrderValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
