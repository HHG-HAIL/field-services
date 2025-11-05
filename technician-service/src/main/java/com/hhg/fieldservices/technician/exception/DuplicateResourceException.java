package com.hhg.fieldservices.technician.exception;

/**
 * Exception thrown when attempting to create a resource that already exists.
 * This typically results in a 409 HTTP status code (Conflict).
 * 
 * @author Field Services Team
 * @version 1.0
 */
public class DuplicateResourceException extends RuntimeException {

    /**
     * Constructs a new DuplicateResourceException with the specified detail message.
     * 
     * @param message the detail message
     */
    public DuplicateResourceException(String message) {
        super(message);
    }

    /**
     * Constructs a new DuplicateResourceException with the specified detail message and cause.
     * 
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }
}
