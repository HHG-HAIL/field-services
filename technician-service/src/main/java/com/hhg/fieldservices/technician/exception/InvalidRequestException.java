package com.hhg.fieldservices.technician.exception;

/**
 * Exception thrown when a request contains invalid data or business logic violations.
 * This typically results in a 400 HTTP status code (Bad Request).
 * 
 * @author Field Services Team
 * @version 1.0
 */
public class InvalidRequestException extends RuntimeException {

    /**
     * Constructs a new InvalidRequestException with the specified detail message.
     * 
     * @param message the detail message
     */
    public InvalidRequestException(String message) {
        super(message);
    }

    /**
     * Constructs a new InvalidRequestException with the specified detail message and cause.
     * 
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public InvalidRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
