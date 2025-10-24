package com.hhg.fieldservices.workorder.exception;

/**
 * Exception thrown when a work order is not found.
 * 
 * @author Field Services Team
 * @version 1.0
 */
public class WorkOrderNotFoundException extends RuntimeException {
    
    public WorkOrderNotFoundException(Long id) {
        super("Work order not found with id: " + id);
    }
    
    public WorkOrderNotFoundException(String workOrderNumber) {
        super("Work order not found with number: " + workOrderNumber);
    }
    
    public WorkOrderNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
